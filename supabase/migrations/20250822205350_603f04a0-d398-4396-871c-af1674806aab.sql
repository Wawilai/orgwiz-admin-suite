-- Insert seed data for the database

-- Create basic master data types
INSERT INTO public.master_data_types (type_name, description, is_system_type) 
SELECT * FROM (VALUES
  ('organization_type', 'ประเภทองค์กร', true),
  ('user_status', 'สถานะผู้ใช้', true),
  ('license_type', 'ประเภทใบอนุญาต', true),
  ('contact_type', 'ประเภทติดต่อ', true)
) AS v(type_name, description, is_system_type)
WHERE NOT EXISTS (SELECT 1 FROM public.master_data_types WHERE type_name = v.type_name);

-- Create system roles (using only existing enum values)
INSERT INTO public.roles (name, role_type, description, is_system_role, permissions) 
SELECT * FROM (VALUES
  ('Super Admin', 'super_admin', 'ผู้ดูแลระบบสูงสุด มีสิทธิ์เข้าถึงทุกฟังก์ชัน', true, 
   '["users", "organizations", "domains", "reports", "system", "billing", "storage", "roles"]'::jsonb),
  ('Organization Admin', 'organization_admin', 'ผู้ดูแลองค์กร มีสิทธิ์จัดการข้อมูลในองค์กรของตน', true,
   '["users", "organizations", "domains", "reports", "billing", "storage", "roles"]'::jsonb),
  ('User', 'user', 'ผู้ใช้ทั่วไป มีสิทธิ์ใช้งานพื้นฐาน', true,
   '["reports"]'::jsonb)
) AS v(name, role_type, description, is_system_role, permissions)
WHERE NOT EXISTS (SELECT 1 FROM public.roles WHERE role_type = v.role_type);

-- Create sample tenant
INSERT INTO public.tenants (name, slug, description, status, settings) 
SELECT * FROM (VALUES
  ('Default Tenant', 'default', 'Default tenant for the system', 'active', 
   '{"features": ["email", "storage", "reports"], "limits": {"max_users": 10000, "max_domains": 100}}'::jsonb)
) AS v(name, slug, description, status, settings)
WHERE NOT EXISTS (SELECT 1 FROM public.tenants WHERE slug = v.slug);

-- Create sample organizations
DO $$
DECLARE
  sample_org_id UUID;
  default_tenant_id UUID;
BEGIN
  -- Get the default tenant ID
  SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default' LIMIT 1;
  
  -- Check if organizations already exist
  IF NOT EXISTS (SELECT 1 FROM public.organizations WHERE name = 'บริษัท เทคโนโลยี จำกัด') THEN
    -- Create sample organization
    SELECT public.initialize_organization(
      'บริษัท เทคโนโลยี จำกัด',
      'admin@techcompany.com',
      'บริษัทจำกัด',
      'admin@techcompany.com',
      'ผู้ดูแล',
      'ระบบ'
    ) INTO sample_org_id;
    
    -- Update organization with tenant_id
    UPDATE public.organizations 
    SET tenant_id = default_tenant_id,
        description = 'บริษัทด้านเทคโนโลยีสารสนเทศ',
        website = 'https://techcompany.com',
        phone = '02-123-4567',
        address = '123 ถนนเทคโนโลยี เขตบางรัก กรุงเทพฯ 10500',
        tax_id = '0123456789012',
        registration_number = 'REG123456789'
    WHERE id = sample_org_id;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.organizations WHERE name = 'หน่วยงานราชการ') THEN
    -- Create another sample organization
    SELECT public.initialize_organization(
      'หน่วยงานราชการ',
      'contact@government.go.th',
      'หน่วยงานราชการ',
      'admin@government.go.th',
      'ผู้อำนวยการ',
      'สำนักงาน'
    ) INTO sample_org_id;
    
    -- Update organization with tenant_id
    UPDATE public.organizations 
    SET tenant_id = default_tenant_id,
        description = 'หน่วยงานราชการด้านเทคโนโลยี',
        website = 'https://government.go.th',
        phone = '02-987-6543',
        address = '456 ถนนราชดำเนิน เขตพระนคร กรุงเทพฯ 10200',
        tax_id = '9876543210987'
    WHERE id = sample_org_id;
  END IF;
END $$;