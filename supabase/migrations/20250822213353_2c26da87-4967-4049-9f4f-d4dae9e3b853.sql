-- สร้าง profile สำหรับผู้ใช้ที่มีอยู่
INSERT INTO public.profiles (
  user_id,
  organization_id, 
  first_name,
  last_name,
  email,
  display_name,
  position,
  user_type,
  status
) VALUES (
  'af8a0cf5-bfed-4a8b-a23c-c4d3909ed5fb',
  '8a6c4c9d-69f2-4582-b7d4-b72238637b2b', -- บริษัท เทคโนโลยี จำกัด
  'วรพล',
  'วาวี',
  'worapon.wawi@gmail.com',
  'วรพล วาวี',
  'ผู้ดูแลระบบ',
  'admin',
  'active'
);

-- ให้สิทธิ์ super_admin แก่ผู้ใช้นี้
INSERT INTO public.user_roles (
  user_id,
  role_id,
  assigned_by,
  is_active
) 
SELECT 
  'af8a0cf5-bfed-4a8b-a23c-c4d3909ed5fb',
  r.id,
  'af8a0cf5-bfed-4a8b-a23c-c4d3909ed5fb',
  true
FROM public.roles r 
WHERE r.role_type = 'super_admin'
LIMIT 1;

-- สร้างผู้ใช้ตัวอย่างเพิ่มเติมสำหรับ demo
INSERT INTO public.profiles (
  user_id,
  organization_id,
  first_name, 
  last_name,
  email,
  display_name,
  position,
  user_type,
  status
) VALUES 
(gen_random_uuid(), '8a6c4c9d-69f2-4582-b7d4-b72238637b2b', 'สมชาย', 'ใจดี', 'somchai@techcompany.com', 'สมชาย ใจดี', 'นักพัฒนา', 'user', 'active'),
(gen_random_uuid(), '8a6c4c9d-69f2-4582-b7d4-b72238637b2b', 'สมหญิง', 'รักงาน', 'somying@techcompany.com', 'สมหญิง รักงาน', 'นักวิเคราะห์', 'user', 'active'),
(gen_random_uuid(), '040b5562-d185-469a-8eb8-46f96ef7dbdc', 'นายทดสอบ', 'ระบบ', 'test@government.go.th', 'นายทดสอบ ระบบ', 'เจ้าหน้าที่', 'user', 'active');

-- สร้าง contacts ตัวอย่าง
INSERT INTO public.contacts (
  organization_id,
  created_by,
  contact_type,
  first_name,
  last_name,
  email,
  phone,
  company,
  position
) VALUES 
('8a6c4c9d-69f2-4582-b7d4-b72238637b2b', 'af8a0cf5-bfed-4a8b-a23c-c4d3909ed5fb', 'business', 'ลูกค้า', 'ใหญ่', 'customer@bigcompany.com', '02-123-4567', 'บริษัท ใหญ่ จำกัด', 'ผู้จัดการ'),
('8a6c4c9d-69f2-4582-b7d4-b72238637b2b', 'af8a0cf5-bfed-4a8b-a23c-c4d3909ed5fb', 'supplier', 'คู่ค้า', 'ดี', 'partner@supplier.com', '02-987-6543', 'บริษัท คู่ค้า จำกัด', 'หัวหน้าขาย');

-- สร้าง domains ตัวอย่าง
INSERT INTO public.domains (
  organization_id,
  name, 
  status,
  verified_at,
  max_mailboxes,
  max_aliases
) VALUES 
('8a6c4c9d-69f2-4582-b7d4-b72238637b2b', 'techcompany.com', 'active', now(), 1000, 500),
('040b5562-d185-469a-8eb8-46f96ef7dbdc', 'government.go.th', 'active', now(), 500, 250);