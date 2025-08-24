-- ===============================
-- SAMPLE DATA AND INITIALIZATION (Fixed)
-- ===============================

-- Insert Master Data Types
INSERT INTO public.master_data_types (type_name, description, is_system_type) VALUES
('organization_types', 'ประเภทองค์กร', true),
('departments', 'แผนกในองค์กร', true),
('positions', 'ตำแหน่งงาน', true),
('user_roles', 'บทบาทผู้ใช้', true),
('contact_types', 'ประเภทผู้ติดต่อ', true);

-- Insert Master Data Items for Organization Types (Fixed: organization_id should be NULL for system items)
INSERT INTO public.master_data_items (type_id, code, name, description, sort_order, organization_id) 
SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'organization_types'),
    'company_limited', 'บริษัทจำกัด', 'บริษัทจำกัด', 1, NULL::UUID
UNION ALL SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'organization_types'),
    'public_limited', 'บริษัทมหาชน', 'บริษัทจำกัด (มหาชน)', 2, NULL::UUID
UNION ALL SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'organization_types'),
    'partnership', 'ห้างหุ้นส่วน', 'ห้างหุ้นส่วนจำกัด', 3, NULL::UUID
UNION ALL SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'organization_types'),
    'government', 'หน่วยงานราชการ', 'หน่วยงานภาครัฐ', 4, NULL::UUID;

-- Insert Master Data Items for Departments
INSERT INTO public.master_data_items (type_id, code, name, description, sort_order, organization_id) 
SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'departments'),
    'it', 'ฝ่ายไอที', 'Information Technology Department', 1, NULL::UUID
UNION ALL SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'departments'),
    'hr', 'ฝ่ายทรัพยากรบุคคล', 'Human Resources Department', 2, NULL::UUID
UNION ALL SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'departments'),
    'finance', 'ฝ่ายการเงิน', 'Finance Department', 3, NULL::UUID
UNION ALL SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'departments'),
    'marketing', 'ฝ่ายการตลาด', 'Marketing Department', 4, NULL::UUID
UNION ALL SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'departments'),
    'sales', 'ฝ่ายขาย', 'Sales Department', 5, NULL::UUID;

-- Insert Master Data Items for Positions
INSERT INTO public.master_data_items (type_id, code, name, description, sort_order, organization_id) 
SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'positions'),
    'manager', 'ผู้จัดการ', 'Manager', 1, NULL::UUID
UNION ALL SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'positions'),
    'supervisor', 'หัวหน้างาน', 'Supervisor', 2, NULL::UUID
UNION ALL SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'positions'),
    'officer', 'เจ้าหน้าที่', 'Officer', 3, NULL::UUID
UNION ALL SELECT 
    (SELECT id FROM public.master_data_types WHERE type_name = 'positions'),
    'specialist', 'ผู้เชี่ยวชาญ', 'Specialist', 4, NULL::UUID;

-- Insert System Roles
INSERT INTO public.roles (name, description, role_type, is_system_role, permissions) VALUES
('Super Administrator', 'ผู้ดูแลระบบสูงสุด มีสิทธิ์เต็มทั้งระบบ', 'super_admin', true, 
 '["*"]'::jsonb),
('Organization Administrator', 'ผู้ดูแลองค์กร สามารถจัดการผู้ใช้และข้อมูลในองค์กร', 'organization_admin', true,
 '["user.create", "user.read", "user.update", "user.delete", "org.read", "org.update", "domain.manage", "license.manage"]'::jsonb),
('Manager', 'ผู้จัดการ สามารถดูรายงานและจัดการทีม', 'manager', true,
 '["user.read", "user.update", "report.read", "team.manage"]'::jsonb),
('User', 'ผู้ใช้งานทั่วไป สามารถใช้บริการพื้นฐาน', 'user', true,
 '["profile.read", "profile.update", "email.read", "calendar.read"]'::jsonb),
('Viewer', 'ผู้ดูข้อมูล มีสิทธิ์ดูข้อมูลเท่านั้น', 'viewer', true,
 '["profile.read", "report.read"]'::jsonb);

-- ===============================
-- UTILITY FUNCTIONS
-- ===============================

-- Function to initialize a new organization with sample data
CREATE OR REPLACE FUNCTION public.initialize_organization(
  org_name TEXT,
  org_email TEXT,
  org_type TEXT DEFAULT 'บริษัทจำกัด',
  admin_email TEXT DEFAULT NULL,
  admin_first_name TEXT DEFAULT 'ผู้ดูแล',
  admin_last_name TEXT DEFAULT 'ระบบ'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  it_dept_id UUID;
  hr_dept_id UUID;
  finance_dept_id UUID;
BEGIN
  -- Create organization
  INSERT INTO public.organizations (
    name, 
    type, 
    email, 
    status
  ) VALUES (
    org_name,
    org_type,
    org_email,
    'active'
  ) RETURNING id INTO new_org_id;
  
  -- Create default departments
  INSERT INTO public.organization_units (
    organization_id,
    name,
    code,
    description
  ) VALUES 
    (new_org_id, 'ฝ่ายไอที', 'IT', 'แผนกเทคโนโลยีสารสนเทศ')
  RETURNING id INTO it_dept_id;
  
  INSERT INTO public.organization_units (
    organization_id,
    name,
    code,
    description
  ) VALUES 
    (new_org_id, 'ฝ่ายทรัพยากรบุคคล', 'HR', 'แผนกบุคคล')
  RETURNING id INTO hr_dept_id;
  
  INSERT INTO public.organization_units (
    organization_id,
    name,
    code,
    description
  ) VALUES 
    (new_org_id, 'ฝ่ายการเงิน', 'FIN', 'แผนกการเงินและบัญชี')
  RETURNING id INTO finance_dept_id;
  
  -- Create billing account
  INSERT INTO public.billing_accounts (
    organization_id,
    account_name,
    billing_email,
    currency
  ) VALUES (
    new_org_id,
    org_name,
    COALESCE(admin_email, org_email),
    'THB'
  );
  
  -- Create default storage quotas
  INSERT INTO public.storage_quotas (
    organization_id,
    quota_type,
    allocated_mb,
    warning_threshold_mb
  ) VALUES 
    (new_org_id, 'mailbox', 10240, 8192),  -- 10GB mailbox quota
    (new_org_id, 'file_storage', 51200, 40960), -- 50GB file storage
    (new_org_id, 'backup', 20480, 16384); -- 20GB backup storage
  
  -- Log organization creation
  INSERT INTO public.activity_logs (
    organization_id,
    action,
    entity_type,
    entity_id,
    new_values
  ) VALUES (
    new_org_id,
    'organization_created',
    'organization',
    new_org_id,
    jsonb_build_object(
      'name', org_name,
      'type', org_type,
      'email', org_email
    )
  );
  
  RETURN new_org_id;
END;
$$;

-- Function to get organization statistics
CREATE OR REPLACE FUNCTION public.get_organization_stats(org_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_users', (
      SELECT COUNT(*) FROM public.profiles WHERE organization_id = org_id
    ),
    'active_users', (
      SELECT COUNT(*) FROM public.profiles 
      WHERE organization_id = org_id AND status = 'active'
    ),
    'total_domains', (
      SELECT COUNT(*) FROM public.domains WHERE organization_id = org_id
    ),
    'active_domains', (
      SELECT COUNT(*) FROM public.domains 
      WHERE organization_id = org_id AND status = 'active'
    ),
    'total_licenses', (
      SELECT COUNT(*) FROM public.licenses WHERE organization_id = org_id
    ),
    'active_licenses', (
      SELECT COUNT(*) FROM public.licenses 
      WHERE organization_id = org_id AND status = 'active'
    ),
    'total_contacts', (
      SELECT COUNT(*) FROM public.contacts WHERE organization_id = org_id
    ),
    'storage_usage', (
      SELECT jsonb_object_agg(quota_type, used_mb)
      FROM public.storage_quotas 
      WHERE organization_id = org_id AND user_id IS NULL
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$;