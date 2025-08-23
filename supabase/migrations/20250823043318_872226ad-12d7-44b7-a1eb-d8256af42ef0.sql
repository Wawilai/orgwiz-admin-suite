-- Update tenant_admin role to have full permissions
UPDATE public.roles 
SET permissions = '["manage_users", "manage_organizations", "manage_domains", "view_reports", "manage_system", "manage_billing", "manage_storage", "manage_roles", "manage_security", "manage_contacts", "manage_groups", "manage_licenses", "manage_quotas", "manage_mail"]'::jsonb
WHERE role_type = 'tenant_admin';

-- If tenant_admin role doesn't exist, create it
INSERT INTO public.roles (role_type, name, description, permissions, is_system_role)
VALUES (
  'tenant_admin',
  'Tenant Administrator', 
  'Administrator for tenant with full system access',
  '["manage_users", "manage_organizations", "manage_domains", "view_reports", "manage_system", "manage_billing", "manage_storage", "manage_roles", "manage_security", "manage_contacts", "manage_groups", "manage_licenses", "manage_quotas", "manage_mail"]'::jsonb,
  true
)
ON CONFLICT (role_type, organization_id) DO UPDATE SET
  permissions = EXCLUDED.permissions,
  description = EXCLUDED.description;