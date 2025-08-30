-- Create super admin user worapon.wawi@gmail.com
DO $$
DECLARE
    new_user_id UUID;
    org_id UUID := '8a6c4c9d-69f2-4582-b7d4-b72238637b2b';
    super_admin_role_id UUID := 'bff8ab97-8e8a-4ff7-8aaa-fded881f2826';
BEGIN
    -- Generate a new user ID
    new_user_id := gen_random_uuid();
    
    -- Insert into auth.users (this creates the authentication record)
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        is_super_admin
    ) VALUES (
        new_user_id,
        'worapon.wawi@gmail.com',
        crypt('TempPass123!', gen_salt('bf')), -- temporary password, user should reset
        now(),
        now(),
        now(),
        '{"first_name": "Worapon", "last_name": "Wawi"}'::jsonb,
        true
    );
    
    -- Insert profile
    INSERT INTO public.profiles (
        user_id,
        organization_id,
        first_name,
        last_name,
        email,
        status,
        user_type
    ) VALUES (
        new_user_id,
        org_id,
        'Worapon',
        'Wawi', 
        'worapon.wawi@gmail.com',
        'active',
        'admin'
    );
    
    -- Assign super admin role
    INSERT INTO public.user_roles (
        user_id,
        role_id,
        is_active,
        assigned_at
    ) VALUES (
        new_user_id,
        super_admin_role_id,
        true,
        now()
    );
    
END $$;