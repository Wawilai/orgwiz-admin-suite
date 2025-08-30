-- Create profile and assign super admin role for existing user worapon.wawi@gmail.com
DO $$
DECLARE
    existing_user_id UUID := 'af8a0cf5-bfed-4a8b-a23c-c4d3909ed5fb';
    org_id UUID := '8a6c4c9d-69f2-4582-b7d4-b72238637b2b';
    super_admin_role_id UUID := 'bff8ab97-8e8a-4ff7-8aaa-fded881f2826';
BEGIN
    -- Insert profile for existing user
    INSERT INTO public.profiles (
        user_id,
        organization_id,
        first_name,
        last_name,
        email,
        status,
        user_type
    ) VALUES (
        existing_user_id,
        org_id,
        'Worapon',
        'Wawi', 
        'worapon.wawi@gmail.com',
        'active',
        'admin'
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Assign super admin role (if not already assigned)
    INSERT INTO public.user_roles (
        user_id,
        role_id,
        is_active,
        assigned_at
    ) VALUES (
        existing_user_id,
        super_admin_role_id,
        true,
        now()
    )
    ON CONFLICT (user_id, role_id) DO UPDATE SET
        is_active = true,
        assigned_at = now();
    
END $$;