-- เพิ่ม master data type สำหรับบทบาทผู้ใช้
INSERT INTO master_data_types (type_name, name_en, description, is_system_type)
VALUES 
  ('บทบาทผู้ใช้', 'User Roles', 'บทบาทและสิทธิ์ของผู้ใช้ในระบบ', true)
ON CONFLICT (type_name) DO NOTHING;

-- เพิ่มข้อมูลบทบาทผู้ใช้เริ่มต้น
DO $$
DECLARE
    type_id uuid;
BEGIN
    -- หา ID ของ master data type
    SELECT id INTO type_id FROM master_data_types WHERE type_name = 'บทบาทผู้ใช้';
    
    -- เพิ่มข้อมูลบทบาทเริ่มต้น
    INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
    VALUES 
      (type_id, 'ADMIN', 'ผู้ดูแลระบบ', 'Administrator', 'ผู้ดูแลระบบทั้งหมด', true, 1),
      (type_id, 'MANAGER', 'ผู้จัดการ', 'Manager', 'ผู้จัดการองค์กร', true, 2),
      (type_id, 'USER', 'ผู้ใช้', 'User', 'ผู้ใช้ทั่วไป', true, 3),
      (type_id, 'GUEST', 'แขก', 'Guest', 'ผู้เข้าชมระบบ', true, 4)
    ON CONFLICT DO NOTHING;
END $$;