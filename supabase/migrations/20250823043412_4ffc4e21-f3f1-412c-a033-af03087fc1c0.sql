-- First, check if tenant_admin role exists and update it
UPDATE public.roles 
SET permissions = '["manage_users", "manage_organizations", "manage_domains", "view_reports", "manage_system", "manage_billing", "manage_storage", "manage_roles", "manage_security", "manage_contacts", "manage_groups", "manage_licenses", "manage_quotas", "manage_mail"]'::jsonb,
    description = 'Administrator for tenant with full system access'
WHERE role_type = 'tenant_admin' AND organization_id IS NULL;

-- If no rows were updated, insert new tenant_admin role
INSERT INTO public.roles (role_type, name, description, permissions, is_system_role, organization_id)
SELECT 
  'tenant_admin',
  'Tenant Administrator', 
  'Administrator for tenant with full system access',
  '["manage_users", "manage_organizations", "manage_domains", "view_reports", "manage_system", "manage_billing", "manage_storage", "manage_roles", "manage_security", "manage_contacts", "manage_groups", "manage_licenses", "manage_quotas", "manage_mail"]'::jsonb,
  true,
  null
WHERE NOT EXISTS (SELECT 1 FROM public.roles WHERE role_type = 'tenant_admin' AND organization_id IS NULL);