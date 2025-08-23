-- Create table for system services status
CREATE TABLE public.system_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_type TEXT NOT NULL, -- 'mail', 'chat', 'storage', 'meeting'
  status TEXT NOT NULL DEFAULT 'online', -- 'online', 'maintenance', 'offline'
  uptime_percentage DECIMAL(5,2) NOT NULL DEFAULT 99.9,
  last_check TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  organization_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.system_services ENABLE ROW LEVEL SECURITY;

-- Create policies for system services
CREATE POLICY "Organization users can view organization services" 
ON public.system_services 
FOR SELECT 
USING (organization_id = get_current_user_organization_id() OR organization_id IS NULL);

CREATE POLICY "Organization admins can manage organization services" 
ON public.system_services 
FOR ALL 
USING ((organization_id = get_current_user_organization_id()) AND is_organization_admin(auth.uid(), organization_id));

CREATE POLICY "Super admins can manage all services" 
ON public.system_services 
FOR ALL 
USING (is_super_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_system_services_updated_at
BEFORE UPDATE ON public.system_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system services (global)
INSERT INTO public.system_services (service_name, service_type, status, uptime_percentage) VALUES
('Mail Service', 'mail', 'online', 99.9),
('Chat Service', 'chat', 'online', 99.8),
('Storage Service', 'storage', 'maintenance', 98.5),
('Meeting Service', 'meeting', 'online', 99.7);

-- Create function to calculate organization growth statistics
CREATE OR REPLACE FUNCTION public.get_organization_growth_stats(org_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_stats JSONB;
  previous_stats JSONB;
  growth_stats JSONB;
  current_month_start DATE;
  previous_month_start DATE;
  previous_month_end DATE;
BEGIN
  -- Calculate date ranges
  current_month_start := DATE_TRUNC('month', CURRENT_DATE);
  previous_month_start := DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');
  previous_month_end := current_month_start - INTERVAL '1 day';
  
  -- Get current month stats
  SELECT jsonb_build_object(
    'total_users', (
      SELECT COUNT(*) FROM public.profiles 
      WHERE organization_id = org_id 
      AND created_at < current_month_start + INTERVAL '1 month'
    ),
    'active_users', (
      SELECT COUNT(*) FROM public.profiles 
      WHERE organization_id = org_id 
      AND status = 'active'
      AND created_at < current_month_start + INTERVAL '1 month'
    ),
    'total_domains', (
      SELECT COUNT(*) FROM public.domains 
      WHERE organization_id = org_id
      AND created_at < current_month_start + INTERVAL '1 month'
    ),
    'total_licenses', (
      SELECT COUNT(*) FROM public.licenses 
      WHERE organization_id = org_id
      AND created_at < current_month_start + INTERVAL '1 month'
    )
  ) INTO current_stats;
  
  -- Get previous month stats
  SELECT jsonb_build_object(
    'total_users', (
      SELECT COUNT(*) FROM public.profiles 
      WHERE organization_id = org_id 
      AND created_at < current_month_start
    ),
    'active_users', (
      SELECT COUNT(*) FROM public.profiles 
      WHERE organization_id = org_id 
      AND status = 'active'
      AND created_at < current_month_start
    ),
    'total_domains', (
      SELECT COUNT(*) FROM public.domains 
      WHERE organization_id = org_id
      AND created_at < current_month_start
    ),
    'total_licenses', (
      SELECT COUNT(*) FROM public.licenses 
      WHERE organization_id = org_id
      AND created_at < current_month_start
    )
  ) INTO previous_stats;
  
  -- Calculate growth percentages
  SELECT jsonb_build_object(
    'users_growth', CASE 
      WHEN (previous_stats->>'total_users')::INTEGER = 0 THEN 0
      ELSE ROUND(
        ((current_stats->>'total_users')::INTEGER - (previous_stats->>'total_users')::INTEGER) * 100.0 / 
        NULLIF((previous_stats->>'total_users')::INTEGER, 0), 1
      )
    END,
    'active_users_growth', CASE 
      WHEN (previous_stats->>'active_users')::INTEGER = 0 THEN 0
      ELSE ROUND(
        ((current_stats->>'active_users')::INTEGER - (previous_stats->>'active_users')::INTEGER) * 100.0 / 
        NULLIF((previous_stats->>'active_users')::INTEGER, 0), 1
      )
    END,
    'domains_growth', CASE 
      WHEN (previous_stats->>'total_domains')::INTEGER = 0 THEN 0
      ELSE ROUND(
        ((current_stats->>'total_domains')::INTEGER - (previous_stats->>'total_domains')::INTEGER) * 100.0 / 
        NULLIF((previous_stats->>'total_domains')::INTEGER, 0), 1
      )
    END,
    'licenses_growth', CASE 
      WHEN (previous_stats->>'total_licenses')::INTEGER = 0 THEN 0
      ELSE ROUND(
        ((current_stats->>'total_licenses')::INTEGER - (previous_stats->>'total_licenses')::INTEGER) * 100.0 / 
        NULLIF((previous_stats->>'total_licenses')::INTEGER, 0), 1
      )
    END
  ) INTO growth_stats;
  
  RETURN growth_stats;
END;
$$;