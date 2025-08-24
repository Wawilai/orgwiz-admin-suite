-- ทำความสะอาดข้อมูล master_data_types ที่ซ้ำ
DELETE FROM public.master_data_types 
WHERE type_name IN ('contact_types', 'departments', 'organization_types', 'positions', 'user_roles');

-- เพิ่ม Foreign Key constraints ที่จำเป็น
ALTER TABLE public.master_data_items 
ADD CONSTRAINT fk_master_data_items_type_id 
FOREIGN KEY (type_id) REFERENCES public.master_data_types(id) 
ON DELETE CASCADE;

ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_organization_unit_id 
FOREIGN KEY (organization_unit_id) REFERENCES public.organization_units(id) 
ON DELETE SET NULL;

-- สร้างข้อมูลเริ่มต้นสำหรับ master_data_items
DO $$
DECLARE
    org_type_id uuid;
    dept_type_id uuid;
    pos_type_id uuid;
    role_type_id uuid;
    country_type_id uuid;
BEGIN
    -- ดึง ID ของแต่ละ type
    SELECT id INTO org_type_id FROM public.master_data_types WHERE type_name = 'ประเภทองค์กร';
    SELECT id INTO dept_type_id FROM public.master_data_types WHERE type_name = 'แผนก';
    SELECT id INTO pos_type_id FROM public.master_data_types WHERE type_name = 'ตำแหน่ง';
    SELECT id INTO role_type_id FROM public.master_data_types WHERE type_name = 'บทบาทผู้ใช้';
    SELECT id INTO country_type_id FROM public.master_data_types WHERE type_name = 'ประเทศ';

    -- เพิ่มข้อมูล Organization Types
    INSERT INTO public.master_data_items (type_id, code, name, name_en, description, sort_order, is_active) VALUES
    (org_type_id, 'PUBLIC', 'บริษัทมหาชน', 'Public Company', 'บริษัทจดทะเบียนในตลาดหลักทรัพย์', 1, true),
    (org_type_id, 'LIMITED', 'บริษัทจำกัด', 'Limited Company', 'บริษัทจำกัดทั่วไป', 2, true),
    (org_type_id, 'PARTNERSHIP', 'ห้างหุ้นส่วน', 'Partnership', 'ห้างหุ้นส่วนจำกัด', 3, true)
    ON CONFLICT (type_id, code) DO UPDATE SET
        name = EXCLUDED.name,
        name_en = EXCLUDED.name_en,
        description = EXCLUDED.description;

    -- เพิ่มข้อมูล Departments (จะใช้จาก organization_units แทน)
    -- เพิ่มข้อมูล Positions
    INSERT INTO public.master_data_items (type_id, code, name, name_en, description, sort_order, is_active) VALUES
    (pos_type_id, 'CEO', 'ประธานเจ้าหน้าที่บริหาร', 'Chief Executive Officer', 'ผู้บริหารสูงสุด', 1, true),
    (pos_type_id, 'MANAGER', 'ผู้จัดการ', 'Manager', 'ผู้จัดการระดับกลาง', 2, true),
    (pos_type_id, 'SUPERVISOR', 'หัวหน้างาน', 'Supervisor', 'หัวหน้าทีมงาน', 3, true),
    (pos_type_id, 'SENIOR_STAFF', 'พนักงานอาวุโส', 'Senior Staff', 'พนักงานระดับอาวุโส', 4, true),
    (pos_type_id, 'STAFF', 'พนักงาน', 'Staff', 'พนักงานทั่วไป', 5, true)
    ON CONFLICT (type_id, code) DO UPDATE SET
        name = EXCLUDED.name,
        name_en = EXCLUDED.name_en,
        description = EXCLUDED.description;

    -- เพิ่มข้อมูล User Roles
    INSERT INTO public.master_data_items (type_id, code, name, name_en, description, sort_order, is_active) VALUES
    (role_type_id, 'SUPER_ADMIN', 'ผู้ดูแลระบบสูงสุด', 'Super Administrator', 'สิทธิ์เต็มทั้งระบบ', 1, true),
    (role_type_id, 'ORG_ADMIN', 'ผู้ดูแลองค์กร', 'Organization Administrator', 'จัดการผู้ใช้ในองค์กร', 2, true),
    (role_type_id, 'HR_MANAGER', 'ผู้จัดการทรัพยากรบุคคล', 'HR Manager', 'จัดการข้อมูลบุคลากร', 3, true),
    (role_type_id, 'DEPARTMENT_HEAD', 'หัวหน้าแผนก', 'Department Head', 'จัดการผู้ใช้ในแผนก', 4, true),
    (role_type_id, 'USER', 'ผู้ใช้งานทั่วไป', 'User', 'สิทธิ์การใช้งานพื้นฐาน', 5, true)
    ON CONFLICT (type_id, code) DO UPDATE SET
        name = EXCLUDED.name,
        name_en = EXCLUDED.name_en,
        description = EXCLUDED.description;

    -- เพิ่มข้อมูล Countries
    INSERT INTO public.master_data_items (type_id, code, name, name_en, description, sort_order, is_active) VALUES
    (country_type_id, 'TH', 'ประเทศไทย', 'Thailand', 'Kingdom of Thailand', 1, true),
    (country_type_id, 'US', 'สหรัฐอเมริกา', 'United States', 'United States of America', 2, true),
    (country_type_id, 'JP', 'ญี่ปุ่น', 'Japan', 'Japan', 3, true),
    (country_type_id, 'SG', 'สิงคโปร์', 'Singapore', 'Republic of Singapore', 4, true),
    (country_type_id, 'MY', 'มาเลเซีย', 'Malaysia', 'Malaysia', 5, true)
    ON CONFLICT (type_id, code) DO UPDATE SET
        name = EXCLUDED.name,
        name_en = EXCLUDED.name_en,
        description = EXCLUDED.description;
END $$;