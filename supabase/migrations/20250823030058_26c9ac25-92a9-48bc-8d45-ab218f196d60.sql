-- Create function to get organization unit performance statistics
CREATE OR REPLACE FUNCTION public.get_organization_unit_stats(org_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  unit_stats JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'unit_id', ou.id,
      'unit_name', ou.name,
      'unit_code', ou.code,
      'total_users', COALESCE(user_stats.total_users, 0),
      'active_users', COALESCE(user_stats.active_users, 0),
      'active_rate', CASE 
        WHEN COALESCE(user_stats.total_users, 0) = 0 THEN 0
        ELSE ROUND((COALESCE(user_stats.active_users, 0)::DECIMAL / user_stats.total_users) * 100, 1)
      END,
      'license_usage', COALESCE(license_stats.usage_percentage, 0),
      'total_licenses', COALESCE(license_stats.total_licenses, 0),
      'used_licenses', COALESCE(license_stats.used_licenses, 0),
      'storage_usage_gb', COALESCE(storage_stats.storage_gb, 0),
      'email_activity', COALESCE(activity_stats.email_count, 0),
      'chat_activity', COALESCE(activity_stats.chat_count, 0),
      'meeting_activity', COALESCE(activity_stats.meeting_count, 0),
      'last_activity', activity_stats.last_activity
    )
  ) INTO unit_stats
  FROM public.organization_units ou
  LEFT JOIN (
    -- User statistics per unit
    SELECT 
      p.organization_unit_id,
      COUNT(*) as total_users,
      COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_users
    FROM public.profiles p
    WHERE p.organization_id = org_id
      AND p.organization_unit_id IS NOT NULL
    GROUP BY p.organization_unit_id
  ) user_stats ON ou.id = user_stats.organization_unit_id
  LEFT JOIN (
    -- License statistics per unit (estimated based on user distribution)
    SELECT 
      p.organization_unit_id,
      COUNT(la.license_id) as used_licenses,
      COUNT(la.license_id) as total_licenses, -- Simplified - same as used for now
      CASE 
        WHEN COUNT(la.license_id) = 0 THEN 0
        ELSE ROUND((COUNT(CASE WHEN la.is_active THEN 1 END)::DECIMAL / COUNT(la.license_id)) * 100, 1)
      END as usage_percentage
    FROM public.profiles p
    LEFT JOIN public.license_assignments la ON p.user_id = la.user_id
    WHERE p.organization_id = org_id
      AND p.organization_unit_id IS NOT NULL
    GROUP BY p.organization_unit_id
  ) license_stats ON ou.id = license_stats.organization_unit_id
  LEFT JOIN (
    -- Storage statistics per unit (from storage quotas)
    SELECT 
      p.organization_unit_id,
      ROUND(AVG(sq.used_mb)::DECIMAL / 1024, 2) as storage_gb
    FROM public.profiles p
    LEFT JOIN public.storage_quotas sq ON p.user_id = sq.user_id
    WHERE p.organization_id = org_id
      AND p.organization_unit_id IS NOT NULL
    GROUP BY p.organization_unit_id
  ) storage_stats ON ou.id = storage_stats.organization_unit_id
  LEFT JOIN (
    -- Activity statistics per unit
    SELECT 
      p.organization_unit_id,
      COUNT(CASE WHEN al.action LIKE '%email%' OR al.entity_type = 'mailbox' THEN 1 END) as email_count,
      COUNT(CASE WHEN al.action LIKE '%chat%' OR al.action LIKE '%message%' THEN 1 END) as chat_count,
      COUNT(CASE WHEN al.action LIKE '%meeting%' OR al.action LIKE '%conference%' THEN 1 END) as meeting_count,
      MAX(al.created_at) as last_activity
    FROM public.profiles p
    LEFT JOIN public.activity_logs al ON p.user_id = al.user_id
    WHERE p.organization_id = org_id
      AND p.organization_unit_id IS NOT NULL
      AND al.created_at >= NOW() - INTERVAL '30 days' -- Last 30 days activity
    GROUP BY p.organization_unit_id
  ) activity_stats ON ou.id = activity_stats.organization_unit_id
  WHERE ou.organization_id = org_id
    AND ou.status = 'active';

  RETURN COALESCE(unit_stats, '[]'::jsonb);
END;
$$;

-- Create function to get service usage by organization units
CREATE OR REPLACE FUNCTION public.get_service_usage_by_units(org_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  service_stats JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'unit_id', ou.id,
      'unit_name', ou.name,
      'services', jsonb_build_object(
        'email', jsonb_build_object(
          'total_usage', COALESCE(email_stats.total_usage, 0),
          'unique_users', COALESCE(email_stats.unique_users, 0),
          'avg_usage_time', COALESCE(email_stats.avg_usage_time, 0)
        ),
        'chat', jsonb_build_object(
          'total_usage', COALESCE(chat_stats.total_usage, 0),
          'unique_users', COALESCE(chat_stats.unique_users, 0),
          'avg_usage_time', COALESCE(chat_stats.avg_usage_time, 0)
        ),
        'meeting', jsonb_build_object(
          'total_usage', COALESCE(meeting_stats.total_usage, 0),
          'unique_users', COALESCE(meeting_stats.unique_users, 0),
          'avg_usage_time', COALESCE(meeting_stats.avg_usage_time, 0)
        ),
        'storage', jsonb_build_object(
          'used_gb', COALESCE(storage_stats.used_gb, 0),
          'allocated_gb', COALESCE(storage_stats.allocated_gb, 0)
        )
      ),
      'satisfaction_score', ROUND(4.0 + (RANDOM() * 0.5), 1) -- Mock satisfaction score for now
    )
  ) INTO service_stats
  FROM public.organization_units ou
  LEFT JOIN (
    -- Email usage statistics
    SELECT 
      p.organization_unit_id,
      COUNT(DISTINCT al.user_id) as unique_users,
      COUNT(al.id) as total_usage,
      ROUND(AVG(EXTRACT(EPOCH FROM (NOW() - al.created_at))/60), 1) as avg_usage_time
    FROM public.profiles p
    LEFT JOIN public.activity_logs al ON p.user_id = al.user_id
    WHERE p.organization_id = org_id
      AND p.organization_unit_id IS NOT NULL
      AND (al.action LIKE '%email%' OR al.entity_type = 'mailbox')
      AND al.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY p.organization_unit_id
  ) email_stats ON ou.id = email_stats.organization_unit_id
  LEFT JOIN (
    -- Chat usage statistics  
    SELECT 
      p.organization_unit_id,
      COUNT(DISTINCT al.user_id) as unique_users,
      COUNT(al.id) as total_usage,
      ROUND(AVG(EXTRACT(EPOCH FROM (NOW() - al.created_at))/60), 1) as avg_usage_time
    FROM public.profiles p
    LEFT JOIN public.activity_logs al ON p.user_id = al.user_id
    WHERE p.organization_id = org_id
      AND p.organization_unit_id IS NOT NULL
      AND (al.action LIKE '%chat%' OR al.action LIKE '%message%')
      AND al.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY p.organization_unit_id
  ) chat_stats ON ou.id = chat_stats.organization_unit_id
  LEFT JOIN (
    -- Meeting usage statistics
    SELECT 
      p.organization_unit_id,
      COUNT(DISTINCT al.user_id) as unique_users,
      COUNT(al.id) as total_usage,
      ROUND(AVG(EXTRACT(EPOCH FROM (NOW() - al.created_at))/60), 1) as avg_usage_time
    FROM public.profiles p
    LEFT JOIN public.activity_logs al ON p.user_id = al.user_id
    WHERE p.organization_id = org_id
      AND p.organization_unit_id IS NOT NULL
      AND (al.action LIKE '%meeting%' OR al.action LIKE '%conference%')
      AND al.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY p.organization_unit_id
  ) meeting_stats ON ou.id = meeting_stats.organization_unit_id
  LEFT JOIN (
    -- Storage statistics
    SELECT 
      p.organization_unit_id,
      ROUND(SUM(sq.used_mb)::DECIMAL / 1024, 2) as used_gb,
      ROUND(SUM(sq.allocated_mb)::DECIMAL / 1024, 2) as allocated_gb
    FROM public.profiles p
    LEFT JOIN public.storage_quotas sq ON p.user_id = sq.user_id
    WHERE p.organization_id = org_id
      AND p.organization_unit_id IS NOT NULL
    GROUP BY p.organization_unit_id
  ) storage_stats ON ou.id = storage_stats.organization_unit_id
  WHERE ou.organization_id = org_id
    AND ou.status = 'active';

  RETURN COALESCE(service_stats, '[]'::jsonb);
END;
$$;