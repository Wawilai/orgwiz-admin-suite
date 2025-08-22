-- เพิ่มฟิลด์ name_en ในตาราง master_data_types
ALTER TABLE public.master_data_types 
ADD COLUMN name_en text;

-- เพิ่มฟิลด์ name_en ในตาราง master_data_items  
ALTER TABLE public.master_data_items 
ADD COLUMN name_en text;

-- เพิ่ม comment อธิบายการใช้งาน
COMMENT ON COLUMN public.master_data_types.name_en IS 'English name of the master data type';
COMMENT ON COLUMN public.master_data_items.name_en IS 'English name of the master data item';

-- อัปเดตข้อมูลเริ่มต้นสำหรับ master_data_types
UPDATE public.master_data_types 
SET name_en = CASE 
  WHEN type_name = 'ประเภทองค์กร' THEN 'Organization Types'
  WHEN type_name = 'แผนก' THEN 'Departments'
  WHEN type_name = 'ตำแหน่ง' THEN 'Positions'
  WHEN type_name = 'บทบาทผู้ใช้' THEN 'User Roles'
  WHEN type_name = 'ประเทศ' THEN 'Countries'
  WHEN type_name = 'สถานที่เซิร์ฟเวอร์' THEN 'Server Locations'
  WHEN type_name = 'ประเภทเซิร์ฟเวอร์' THEN 'Server Types'
  WHEN type_name = 'ประเภทการสำรอง' THEN 'Backup Types'
  WHEN type_name = 'ประเภทใบรับรอง' THEN 'Certificate Types'
  ELSE name_en
END;

-- สร้างข้อมูลเริ่มต้นสำหรับ master data types หากยังไม่มี
INSERT INTO public.master_data_types (type_name, name_en, description, is_system_type) 
VALUES 
  ('ประเภทองค์กร', 'Organization Types', 'จัดการประเภทขององค์กรต่างๆ', true),
  ('แผนก', 'Departments', 'จัดการแผนกและหน่วยงานต่างๆ', true),
  ('ตำแหน่ง', 'Positions', 'จัดการตำแหน่งงานต่างๆ', true),
  ('บทบาทผู้ใช้', 'User Roles', 'จัดการบทบาทและสิทธิ์ผู้ใช้', true),
  ('ประเทศ', 'Countries', 'จัดการข้อมูลประเทศต่างๆ', true)
ON CONFLICT (type_name) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  description = EXCLUDED.description;