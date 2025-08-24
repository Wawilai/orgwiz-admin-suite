-- เพิ่มข้อมูล License ตัวอย่างใน Database
-- สำหรับทดสอบระบบ License Management

DO $$
DECLARE
  tech_org_id UUID;
  gov_org_id UUID;
  admin_user_id UUID;
BEGIN
  -- ดึง organization IDs
  SELECT id INTO tech_org_id FROM public.organizations WHERE name = 'บริษัท เทคโนโลยี จำกัด' LIMIT 1;
  SELECT id INTO gov_org_id FROM public.organizations WHERE name = 'หน่วยงานราชการ' LIMIT 1;
  
  -- สร้าง admin user สำหรับทดสอบ (ถ้ายังไม่มี)
  INSERT INTO auth.users (id, email) 
  VALUES ('550e8400-e29b-41d4-a716-446655440000', 'admin@test.com')
  ON CONFLICT (id) DO NOTHING;
  
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@test.com' LIMIT 1;
  
  -- เพิ่ม License ตัวอย่าง
  INSERT INTO public.licenses (
    license_key, product_name, license_type, organization_id,
    max_users, features, issue_date, expiry_date, status, notes
  ) VALUES 
  (
    'ENT-2024-TECH001-ABCD1234',
    'Enterprise Communication Suite',
    'User-Based',
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
    'Concurrent',
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
    'Enterprise',
    tech_org_id,
    25,
    '["analytics", "reporting", "dashboard", "data_export", "api_access"]'::jsonb,
    '2024-03-01',
    '2024-12-31',
    'expiring_soon',
    'ใบอนุญาตระบบวิเคราะห์ข้อมูล'
  ),
  (
    'TEST-2023-DEMO004-MNOP3456',
    'Demo Testing Suite',
    'Trial',
    tech_org_id,
    10,
    '["testing", "monitoring"]'::jsonb,
    '2023-12-01',
    '2024-01-15',
    'expired',
    'ใบอนุญาตทดลองใช้งาน'
  )
  ON CONFLICT (license_key) DO NOTHING;
  
  -- เพิ่ม License Usage Logs
  INSERT INTO public.license_usage_logs (
    license_id, user_id, session_start, session_end, duration_minutes,
    ip_address, user_agent, features_used
  )
  SELECT 
    l.id,
    admin_user_id,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '30 minutes',
    90,
    '192.168.1.100'::inet,
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    '["email", "chat"]'::jsonb
  FROM public.licenses l 
  WHERE l.license_key = 'ENT-2024-TECH001-ABCD1234'
  LIMIT 1;
  
  INSERT INTO public.license_usage_logs (
    license_id, user_id, session_start, session_end, duration_minutes,
    ip_address, user_agent, features_used  
  )
  SELECT 
    l.id,
    admin_user_id,
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '3 hours',
    60,
    '192.168.1.101'::inet,
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    '["document_management", "workflow"]'::jsonb
  FROM public.licenses l 
  WHERE l.license_key = 'GOV-2024-DEPT002-EFGH5678'
  LIMIT 1;
  
END $$;