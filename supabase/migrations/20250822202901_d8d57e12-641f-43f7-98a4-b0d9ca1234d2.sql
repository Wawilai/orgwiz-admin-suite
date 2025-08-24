-- เพิ่มค่าใหม่ใน enum app_role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'global_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'tenant_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'org_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'domain_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'system_security';

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
ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE;