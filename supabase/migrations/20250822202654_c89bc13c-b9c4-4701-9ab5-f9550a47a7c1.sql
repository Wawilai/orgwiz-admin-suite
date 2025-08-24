-- ปรับปรุง enum app_role ให้รองรับ roles hierarchy ใหม่
-- Drop existing enum first
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create new app_role enum with proper hierarchy
CREATE TYPE public.app_role AS ENUM (
    'global_admin',      -- สิทธิ์สูงสุด (ทุก Tenant/ทุก Resource)
    'tenant_admin',      -- สิทธิ์สูงสุดภายใน Tenant ตนเอง
    'org_admin',         -- ดูแล Organization/OU/Domain ในขอบเขตตนเอง
    'domain_admin',      -- ดูแลเฉพาะ Domain/OU ที่ได้รับมอบหมาย
    'user',              -- ผู้ใช้งานทั่วไป
    'system_security'    -- งานเบื้องหลัง, Health, Key Rotation, Alerts
);

-- Recreate the columns that used app_role
ALTER TABLE public.roles 
ALTER COLUMN role_type TYPE public.app_role USING role_type::text::public.app_role;

-- เพิ่มตาราง tenants สำหรับ multi-tenant architecture
CREATE TABLE IF NOT EXISTS public.tenants (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    settings jsonb DEFAULT '{}',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- เพิ่ม tenant_id ในตาราง organizations
ALTER TABLE public.organizations 
ADD COLUMN tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE;

-- อัปเดตข้อมูล roles ให้สอดคล้องกับ hierarchy ใหม่
UPDATE public.roles 
SET role_type = CASE 
    WHEN role_type::text = 'super_admin' THEN 'global_admin'::public.app_role
    WHEN role_type::text = 'organization_admin' THEN 'org_admin'::public.app_role
    ELSE role_type
END;

-- สร้าง default tenant หากยังไม่มี
INSERT INTO public.tenants (name, slug, description, status)
VALUES ('Default Tenant', 'default', 'Default tenant for single-tenant setup', 'active')
ON CONFLICT (slug) DO NOTHING;

-- อัปเดต organizations ให้มี tenant_id
UPDATE public.organizations 
SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'default' LIMIT 1)
WHERE tenant_id IS NULL;