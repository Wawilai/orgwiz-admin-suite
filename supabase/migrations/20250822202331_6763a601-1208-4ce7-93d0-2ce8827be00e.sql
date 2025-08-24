-- ตรวจสอบและแก้ไขข้อมูลเก่าในระบบ
-- อัปเดตข้อมูลเก่าใน master_data_items ที่ยังไม่มี name_en
UPDATE public.master_data_items 
SET name_en = CASE 
  -- Organization Types
  WHEN code = 'company_limited' THEN 'Limited Company'
  WHEN code = 'public_limited' THEN 'Public Limited Company'
  WHEN code = 'partnership' THEN 'Partnership'
  WHEN code = 'government' THEN 'Government Agency'
  
  -- Departments (เก่า)
  WHEN code = 'it' THEN 'IT Department'
  WHEN code = 'hr' THEN 'HR Department'
  WHEN code = 'finance' THEN 'Finance Department'
  WHEN code = 'marketing' THEN 'Marketing Department'
  WHEN code = 'sales' THEN 'Sales Department'
  
  -- Positions (เก่า) 
  WHEN code = 'manager' THEN 'Manager'
  WHEN code = 'supervisor' THEN 'Supervisor'
  WHEN code = 'officer' THEN 'Officer'
  WHEN code = 'specialist' THEN 'Specialist'
  
  -- User Roles (เก่า)
  WHEN code = 'admin' THEN 'Administrator'
  WHEN code = 'user' THEN 'User'
  
  ELSE name_en
END
WHERE name_en IS NULL;

-- สร้างข้อมูลเริ่มต้นใน organization_units (กรณีที่ยังไม่มีข้อมูล)
INSERT INTO public.organization_units (organization_id, name, name_en, code, description, status)
SELECT 
    o.id as organization_id,
    'แผนกเทคโนโลยีสารสนเทศ' as name,
    'Information Technology Department' as name_en,
    'IT' as code,
    'จัดการระบบและเทคโนโลยี' as description,
    'active' as status
FROM public.organizations o
WHERE NOT EXISTS (
    SELECT 1 FROM public.organization_units ou 
    WHERE ou.organization_id = o.id 
    AND ou.code = 'IT'
)
LIMIT 1;

INSERT INTO public.organization_units (organization_id, name, name_en, code, description, status)
SELECT 
    o.id as organization_id,
    'แผนกทรัพยากรบุคคล' as name,
    'Human Resources Department' as name_en,
    'HR' as code,
    'จัดการบุคลากรและสวัสดิการ' as description,
    'active' as status
FROM public.organizations o
WHERE NOT EXISTS (
    SELECT 1 FROM public.organization_units ou 
    WHERE ou.organization_id = o.id 
    AND ou.code = 'HR'
)
LIMIT 1;

INSERT INTO public.organization_units (organization_id, name, name_en, code, description, status)
SELECT 
    o.id as organization_id,
    'แผนกการเงิน' as name,
    'Finance Department' as name_en,
    'FIN' as code,
    'จัดการเงินและบัญชี' as description,
    'active' as status
FROM public.organizations o
WHERE NOT EXISTS (
    SELECT 1 FROM public.organization_units ou 
    WHERE ou.organization_id = o.id 
    AND ou.code = 'FIN'
)
LIMIT 1;