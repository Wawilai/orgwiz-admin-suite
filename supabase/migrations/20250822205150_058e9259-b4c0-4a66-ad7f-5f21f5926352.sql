-- Insert seed data for the database

-- First, let's create some basic master data types and items
INSERT INTO public.master_data_types (type_name, description, is_system_type) VALUES
('organization_type', 'ประเภทองค์กร', true),
('user_status', 'สถานะผู้ใช้', true),
('license_type', 'ประเภทใบอนุญาต', true),
('contact_type', 'ประเภทติดต่อ', true)
ON CONFLICT DO NOTHING;

-- Insert master data items
INSERT INTO public.master_data_items (type_id, code, name, name_en, description, is_active, sort_order) 
SELECT 
  t.id,
  unnest(ARRAY['company', 'government', 'education', 'non_profit']),
  unnest(ARRAY['บริษัทจำกัด', 'หน่วยงานราชการ', 'สถาบันการศึกษา', 'องค์กรไม่แสวงหากำไร']),
  unnest(ARRAY['Company', 'Government', 'Education', 'Non-profit']),
  unnest(ARRAY['บริษัทเอกชน', 'หน่วยงานภาครัฐ', 'สถาบันการศึกษา', 'องค์กรไม่แสวงหากำไร']),
  true,
  unnest(ARRAY[1, 2, 3, 4])
FROM public.master_data_types t
WHERE t.type_name = 'organization_type'
ON CONFLICT DO NOTHING;

INSERT INTO public.master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT 
  t.id,
  unnest(ARRAY['active', 'inactive', 'suspended', 'pending']),
  unnest(ARRAY['ใช้งาน', 'ไม่ใช้งาน', 'ระงับใช้งาน', 'รอการอนุมัติ']),
  unnest(ARRAY['Active', 'Inactive', 'Suspended', 'Pending']),
  unnest(ARRAY['สถานะใช้งานปกติ', 'ไม่ได้ใช้งาน', 'ถูกระงับใช้งาน', 'รอการอนุมัติ']),
  true,
  unnest(ARRAY[1, 2, 3, 4])
FROM public.master_data_types t
WHERE t.type_name = 'user_status'
ON CONFLICT DO NOTHING;

INSERT INTO public.master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT 
  t.id,
  unnest(ARRAY['basic', 'premium', 'enterprise', 'trial']),
  unnest(ARRAY['พื้นฐาน', 'พรีเมียม', 'องค์กร', 'ทดลองใช้']),
  unnest(ARRAY['Basic', 'Premium', 'Enterprise', 'Trial']),
  unnest(ARRAY['แพ็คเกจพื้นฐาน', 'แพ็คเกจพรีเมียม', 'แพ็คเกจองค์กร', 'แพ็คเกจทดลองใช้']),
  true,
  unnest(ARRAY[1, 2, 3, 4])
FROM public.master_data_types t
WHERE t.type_name = 'license_type'
ON CONFLICT DO NOTHING;

INSERT INTO public.master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT 
  t.id,
  unnest(ARRAY['business', 'personal', 'vendor', 'customer']),
  unnest(ARRAY['ธุรกิจ', 'ส่วนตัว', 'ผู้จำหน่าย', 'ลูกค้า']),
  unnest(ARRAY['Business', 'Personal', 'Vendor', 'Customer']),
  unnest(ARRAY['ติดต่อทางธุรกิจ', 'ติดต่อส่วนตัว', 'ผู้จำหน่าย', 'ลูกค้า']),
  true,
  unnest(ARRAY[1, 2, 3, 4])
FROM public.master_data_types t
WHERE t.type_name = 'contact_type'
ON CONFLICT DO NOTHING;

-- Create system roles
INSERT INTO public.roles (name, role_type, description, is_system_role, permissions) VALUES
('Super Admin', 'super_admin', 'ผู้ดูแลระบบสูงสุด มีสิทธิ์เข้าถึงทุกฟังก์ชัน', true, 
 '["users", "organizations", "domains", "reports", "system", "billing", "storage", "roles"]'::jsonb),
('Organization Admin', 'organization_admin', 'ผู้ดูแลองค์กร มีสิทธิ์จัดการข้อมูลในองค์กรของตน', true,
 '["users", "organizations", "domains", "reports", "billing", "storage", "roles"]'::jsonb),
('User Manager', 'user_manager', 'ผู้จัดการผู้ใช้ มีสิทธิ์จัดการผู้ใช้ในองค์กร', true,
 '["users", "reports"]'::jsonb),
('Domain Admin', 'domain_admin', 'ผู้ดูแลโดเมน มีสิทธิ์จัดการโดเมนและอีเมล', true,
 '["domains", "reports"]'::jsonb),
('User', 'user', 'ผู้ใช้ทั่วไป มีสิทธิ์ใช้งานพื้นฐาน', true,
 '["reports"]'::jsonb)
ON CONFLICT (role_type) DO NOTHING;

-- Create sample tenant
INSERT INTO public.tenants (name, slug, description, status, settings) VALUES
('Default Tenant', 'default', 'Default tenant for the system', 'active', 
 '{"features": ["email", "storage", "reports"], "limits": {"max_users": 10000, "max_domains": 100}}'::jsonb)
ON CONFLICT DO NOTHING;

-- Create sample organizations using the initialize_organization function
DO $$
DECLARE
  sample_org_id UUID;
  default_tenant_id UUID;
BEGIN
  -- Get the default tenant ID
  SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default' LIMIT 1;
  
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
END $$;

-- Create sample domains for organizations
INSERT INTO public.domains (organization_id, name, status, max_mailboxes, max_aliases, 
                           spf_enabled, dkim_enabled, dmarc_enabled, routing_enabled)
SELECT 
  o.id,
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 'techcompany.com'
    ELSE 'government.go.th'
  END,
  'active',
  1000,
  500,
  true,
  true,
  true,
  true
FROM public.organizations o
WHERE o.tenant_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create sample contacts for organizations
INSERT INTO public.contacts (organization_id, contact_type, first_name, last_name, email, phone, 
                            company, position, created_by)
SELECT 
  o.id,
  'business',
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 'สมชาย'
    ELSE 'สมหญิง'
  END,
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 'ใจดี'
    ELSE 'ช่วยเหลือ'
  END,
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 'somchai@techcompany.com'
    ELSE 'somying@government.go.th'
  END,
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN '081-234-5678'
    ELSE '082-987-6543'
  END,
  o.name,
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 'ผู้จัดการฝ่ายขาย'
    ELSE 'เจ้าหน้าที่ประชาสัมพันธ์'
  END,
  (SELECT id FROM auth.users LIMIT 1) -- This will need to be updated when actual users exist
FROM public.organizations o
WHERE o.tenant_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create sample licenses for organizations
INSERT INTO public.licenses (organization_id, product_name, license_type, license_key, 
                            max_users, issue_date, expiry_date, status, features)
SELECT 
  o.id,
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 'Enterprise Email Suite'
    ELSE 'Government Email Package'
  END,
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 'enterprise'
    ELSE 'premium'
  END,
  'LICENSE-' || UPPER(LEFT(MD5(o.id::text), 16)),
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 500
    ELSE 200
  END,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '1 year',
  'active',
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN '["email", "calendar", "storage", "advanced_security", "api_access"]'
    ELSE '["email", "calendar", "storage", "basic_security"]'
  END::jsonb
FROM public.organizations o
WHERE o.tenant_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create sample groups for organizations
INSERT INTO public.groups (organization_id, group_name, group_email, description, created_by)
SELECT 
  o.id,
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 'IT Support Team'
    ELSE 'Public Relations'
  END,
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 'it-support@techcompany.com'
    ELSE 'pr@government.go.th'
  END,
  CASE 
    WHEN o.name LIKE '%เทคโนโลยี%' THEN 'ทีมสนับสนุนด้านไอที'
    ELSE 'ฝ่ายประชาสัมพันธ์'
  END,
  (SELECT id FROM auth.users LIMIT 1) -- This will need to be updated when actual users exist
FROM public.organizations o
WHERE o.tenant_id IS NOT NULL
ON CONFLICT DO NOTHING;