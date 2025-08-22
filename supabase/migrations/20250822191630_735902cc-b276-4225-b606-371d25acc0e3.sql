-- Add missing unique constraints on profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_username_unique UNIQUE (username),
ADD CONSTRAINT profiles_national_id_unique UNIQUE (national_id);

-- Create missing indexes that weren't created due to the failure
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_national_id ON public.profiles(national_id);

-- Verify and fix the groups table structure if needed
-- Check if all required columns exist
DO $$
BEGIN
    -- Add any missing columns to groups table if needed
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'groups' AND column_name = 'group_name') THEN
        ALTER TABLE public.groups ADD COLUMN group_name TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'groups' AND column_name = 'group_email') THEN
        ALTER TABLE public.groups ADD COLUMN group_email TEXT NOT NULL UNIQUE;
    END IF;
END $$;

-- Update the phone data migration that might have been interrupted
UPDATE public.profiles 
SET phone_mobile = phone 
WHERE phone IS NOT NULL 
  AND (phone_mobile IS NULL OR phone_mobile = '');

-- Add sample data for user types if not exists
INSERT INTO public.master_data_items (type_id, organization_id, code, name, description, sort_order, is_active)
SELECT 
  (SELECT id FROM public.master_data_types WHERE type_name = 'user_roles'),
  NULL, -- System-wide data
  code,
  name,
  description,
  sort_order,
  true
FROM (VALUES 
  ('user', 'ผู้ใช้งานทั่วไป', 'ผู้ใช้งานทั่วไปของระบบ', 1),
  ('admin', 'ผู้ดูแลระบบ', 'ผู้ดูแลระบบทั่วไป', 2),
  ('manager', 'ผู้จัดการ', 'ผู้จัดการระดับต่างๆ', 3),
  ('supervisor', 'หัวหน้างาน', 'หัวหน้าทีมงาน', 4)
) AS user_types(code, name, description, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.master_data_items mdi
  JOIN public.master_data_types mdt ON mdi.type_id = mdt.id
  WHERE mdt.type_name = 'user_roles' AND mdi.code = user_types.code
);