-- Clean up duplicate master data types and add missing ones
-- First, migrate data from duplicate types to the canonical ones

-- Migrate organization_types data to ประเภทองค์กร (keep the Thai version as primary)
INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order, organization_id)
SELECT 
  (SELECT id FROM master_data_types WHERE type_name = 'ประเภทองค์กร' LIMIT 1),
  mdi.code, 
  mdi.name, 
  mdi.name_en, 
  mdi.description, 
  mdi.is_active, 
  mdi.sort_order, 
  mdi.organization_id
FROM master_data_items mdi
JOIN master_data_types mdt ON mdi.type_id = mdt.id
WHERE mdt.type_name = 'organization_types'
ON CONFLICT (code, type_id) DO NOTHING;

-- Migrate contact_types data to contact_type (keep singular version)
INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order, organization_id)
SELECT 
  (SELECT id FROM master_data_types WHERE type_name = 'contact_type' LIMIT 1),
  mdi.code, 
  mdi.name, 
  mdi.name_en, 
  mdi.description, 
  mdi.is_active, 
  mdi.sort_order, 
  mdi.organization_id
FROM master_data_items mdi
JOIN master_data_types mdt ON mdi.type_id = mdt.id
WHERE mdt.type_name = 'contact_types'
ON CONFLICT (code, type_id) DO NOTHING;

-- Migrate departments data to แผนก (keep Thai version)
INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order, organization_id)
SELECT 
  (SELECT id FROM master_data_types WHERE type_name = 'แผนก' LIMIT 1),
  mdi.code, 
  mdi.name, 
  mdi.name_en, 
  mdi.description, 
  mdi.is_active, 
  mdi.sort_order, 
  mdi.organization_id
FROM master_data_items mdi
JOIN master_data_types mdt ON mdi.type_id = mdt.id
WHERE mdt.type_name = 'departments'
ON CONFLICT (code, type_id) DO NOTHING;

-- Migrate positions data to ตำแหน่ง (keep Thai version)
INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order, organization_id)
SELECT 
  (SELECT id FROM master_data_types WHERE type_name = 'ตำแหน่ง' LIMIT 1),
  mdi.code, 
  mdi.name, 
  mdi.name_en, 
  mdi.description, 
  mdi.is_active, 
  mdi.sort_order, 
  mdi.organization_id
FROM master_data_items mdi
JOIN master_data_types mdt ON mdi.type_id = mdt.id
WHERE mdt.type_name = 'positions'
ON CONFLICT (code, type_id) DO NOTHING;

-- Migrate user_roles data to บทบาทผู้ใช้ (keep Thai version)
INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order, organization_id)
SELECT 
  (SELECT id FROM master_data_types WHERE type_name = 'บทบาทผู้ใช้' LIMIT 1),
  mdi.code, 
  mdi.name, 
  mdi.name_en, 
  mdi.description, 
  mdi.is_active, 
  mdi.sort_order, 
  mdi.organization_id
FROM master_data_items mdi
JOIN master_data_types mdt ON mdi.type_id = mdt.id
WHERE mdt.type_name = 'user_roles'
ON CONFLICT (code, type_id) DO NOTHING;

-- Delete old master data items for duplicate types
DELETE FROM master_data_items WHERE type_id IN (
  SELECT id FROM master_data_types WHERE type_name IN ('organization_types', 'contact_types', 'departments', 'positions', 'user_roles', 'organization_type')
);

-- Delete duplicate master data types
DELETE FROM master_data_types WHERE type_name IN ('organization_types', 'contact_types', 'departments', 'positions', 'user_roles', 'organization_type');

-- Update existing type descriptions to be clearer
UPDATE master_data_types SET 
  description = 'ประเภทองค์กรต่างๆ เช่น บริษัทจำกัด บริษัทมหาชน',
  name_en = 'Organization Types'
WHERE type_name = 'ประเภทองค์กร';

UPDATE master_data_types SET 
  description = 'ประเภทของผู้ติดต่อ เช่น ลูกค้า ผู้จำหน่าย',
  name_en = 'Contact Types'
WHERE type_name = 'contact_type';

-- Add missing master data types that forms should use
INSERT INTO master_data_types (type_name, name_en, description, is_system_type) VALUES
('สถานะบริการ', 'Service Status', 'สถานะของบริการต่างๆ เช่น ออนไลน์ ออฟไลน์ บำรุงรักษา', true),
('ประเภทใบอนุญาต', 'License Types', 'ประเภทของใบอนุญาตต่างๆ', true),
('สถานะใบอนุญาต', 'License Status', 'สถานะของใบอนุญาต เช่น ใช้งาน หมดอายุ ยกเลิก', true),
('หน่วยจัดเก็บ', 'Storage Units', 'หน่วยการจัดเก็บข้อมูล เช่น MB GB TB', true),
('ความรุนแรง', 'Severity Levels', 'ระดับความรุนแรง เช่น ต่ำ กลาง สูง วิกฤต', true),
('ประเภทนโยบายความปลอดภัย', 'Security Policy Types', 'ประเภทของนโยบายความปลอดภัย', true),
('สกุลเงิน', 'Currency', 'สกุลเงินต่างๆ', true),
('เขตเวลา', 'Timezone', 'เขตเวลาต่างๆ', true),
('ภาษา', 'Languages', 'ภาษาที่รองรับในระบบ', true)
ON CONFLICT (type_name) DO NOTHING;

-- Add default data for new types
-- Service Status
INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'ONLINE', 'ออนไลน์', 'Online', 'บริการทำงานปกติ', true, 1
FROM master_data_types WHERE type_name = 'สถานะบริการ';

INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'OFFLINE', 'ออฟไลน์', 'Offline', 'บริการไม่พร้อมใช้งาน', true, 2
FROM master_data_types WHERE type_name = 'สถานะบริการ';

INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'MAINTENANCE', 'บำรุงรักษา', 'Maintenance', 'อยู่ระหว่างบำรุงรักษา', true, 3
FROM master_data_types WHERE type_name = 'สถานะบริการ';

-- License Types  
INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'STANDARD', 'มาตรฐาน', 'Standard', 'ใบอนุญาตมาตรฐาน', true, 1
FROM master_data_types WHERE type_name = 'ประเภทใบอนุญาต';

INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'PREMIUM', 'พรีเมียม', 'Premium', 'ใบอนุญาตแบบพรีเมียม', true, 2
FROM master_data_types WHERE type_name = 'ประเภทใบอนุญาต';

INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'ENTERPRISE', 'องค์กร', 'Enterprise', 'ใบอนุญาตสำหรับองค์กรขนาดใหญ่', true, 3
FROM master_data_types WHERE type_name = 'ประเภทใบอนุญาต';

-- License Status
INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'ACTIVE', 'ใช้งาน', 'Active', 'ใบอนุญาตสามารถใช้งานได้', true, 1
FROM master_data_types WHERE type_name = 'สถานะใบอนุญาต';

INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'EXPIRED', 'หมดอายุ', 'Expired', 'ใบอนุญาตหมดอายุแล้ว', true, 2
FROM master_data_types WHERE type_name = 'สถานะใบอนุญาต';

INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'SUSPENDED', 'ถูกระงับ', 'Suspended', 'ใบอนุญาตถูกระงับการใช้งาน', true, 3
FROM master_data_types WHERE type_name = 'สถานะใบอนุญาต';

-- Currency
INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'THB', 'บาทไทย', 'Thai Baht', 'สกุลเงินบาทไทย', true, 1
FROM master_data_types WHERE type_name = 'สกุลเงิน';

INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'USD', 'ดอลลาร์สหรัฐ', 'US Dollar', 'สกุลเงินดอลลาร์สหรัฐ', true, 2
FROM master_data_types WHERE type_name = 'สกุลเงิน';

-- Languages
INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'TH', 'ไทย', 'Thai', 'ภาษาไทย', true, 1
FROM master_data_types WHERE type_name = 'ภาษา';

INSERT INTO master_data_items (type_id, code, name, name_en, description, is_active, sort_order)
SELECT id, 'EN', 'อังกฤษ', 'English', 'ภาษาอังกฤษ', true, 2
FROM master_data_types WHERE type_name = 'ภาษา';