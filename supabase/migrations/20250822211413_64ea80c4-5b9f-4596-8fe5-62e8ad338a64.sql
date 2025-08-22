-- เพิ่มข้อมูล License ตัวอย่างใน Database (ไม่รวม usage logs)

DO $$
DECLARE
  tech_org_id UUID;
  gov_org_id UUID;
BEGIN
  -- ดึง organization IDs
  SELECT id INTO tech_org_id FROM public.organizations WHERE name = 'บริษัท เทคโนโลยี จำกัด' LIMIT 1;
  SELECT id INTO gov_org_id FROM public.organizations WHERE name = 'หน่วยงานราชการ' LIMIT 1;
  
  -- เพิ่ม License ตัวอย่าง
  INSERT INTO public.licenses (
    license_key, product_name, license_type, organization_id,
    max_users, features, issue_date, expiry_date, status, notes
  ) VALUES 
  (
    'ENT-2024-TECH001-ABCD1234',
    'Enterprise Communication Suite',
    'user_based',
    tech_org_id,
    50,
    '["email", "chat", "video_conference", "file_sharing", "calendar"]'::jsonb,
    '2024-01-01',
    '2025-01-01', 
    'active',
    'ใบอนุญาตสำหรับระบบสื่อสารองค์กร'
  ),
  (
    'GOV-2024-DEPT002-EFGH5678',
    'Government Document Management',
    'concurrent',
    gov_org_id,
    100,
    '["document_management", "workflow", "digital_signature", "audit_trail"]'::jsonb,
    '2024-02-01',
    '2025-02-01',
    'active',
    'ใบอนุญาตระบบจัดการเอกสารราชการ'
  ),
  (
    'ENT-2024-TECH003-IJKL9012',
    'Advanced Analytics Platform',
    'feature_based',
    tech_org_id,
    25,
    '["analytics", "reporting", "dashboard", "data_export", "api_access"]'::jsonb,
    '2024-03-01',
    '2024-12-31',
    'active',
    'ใบอนุญาตระบบวิเคราะห์ข้อมูล (ใกล้หมดอายุ)'
  ),
  (
    'TEST-2023-DEMO004-MNOP3456',
    'Demo Testing Suite',
    'site_wide',
    tech_org_id,
    10,
    '["testing", "monitoring"]'::jsonb,
    '2023-12-01',
    '2024-01-15',
    'expired',
    'ใบอนุญาตทดลองใช้งาน'
  ),
  (
    'SUSP-2024-TECH005-QRST7890',
    'Suspended License Test',
    'user_based',
    tech_org_id,
    20,
    '["basic_features"]'::jsonb,
    '2024-01-01',
    '2025-01-01',
    'suspended',
    'ใบอนุญาตที่ถูกระงับ'
  )
  ON CONFLICT (license_key) DO NOTHING;
  
END $$;