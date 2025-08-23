-- Add super_admin role to the current user
-- First, get the super_admin role ID
DO $$
DECLARE
    super_admin_role_id UUID;
    current_user_id UUID := 'af8a0cf5-bfed-4a8b-a23c-c4d3909ed5fb';
BEGIN
    -- Get super_admin role ID
    SELECT id INTO super_admin_role_id 
    FROM public.roles 
    WHERE role_type = 'super_admin' 
    LIMIT 1;
    
    -- If super_admin role doesn't exist, create it
    IF super_admin_role_id IS NULL THEN
        INSERT INTO public.roles (
            name, 
            role_type, 
            description, 
            permissions, 
            is_system_role
        ) VALUES (
            'Super Administrator',
            'super_admin',
            'ผู้ดูแลระบบระดับสูงสุด มีสิทธิ์เข้าถึงทุกอย่างในระบบ',
            '["manage_users", "manage_organizations", "manage_domains", "view_reports", "manage_system", "manage_billing", "manage_storage", "manage_roles", "manage_security", "manage_contacts", "manage_groups", "manage_licenses", "manage_quotas", "manage_mail", "manage_tenants", "manage_global_settings"]'::jsonb,
            true
        )
        RETURNING id INTO super_admin_role_id;
    END IF;
    
    -- Add super_admin role to the user (if not already exists)
    INSERT INTO public.user_roles (
        user_id,
        role_id,
        assigned_by,
        is_active
    ) VALUES (
        current_user_id,
        super_admin_role_id,
        current_user_id,
        true
    )
    ON CONFLICT (user_id, role_id) 
    DO UPDATE SET 
        is_active = true,
        expires_at = null;
        
END $$;