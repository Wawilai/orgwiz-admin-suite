-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Tenant admins can view all organizations in their tenant" ON public.organizations;
DROP POLICY IF EXISTS "Tenant admins can manage organizations in their tenant" ON public.organizations;

-- Create a security definer function to get tenant_id for current user safely
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT o.tenant_id 
  FROM public.profiles p
  JOIN public.organizations o ON p.organization_id = o.id
  WHERE p.user_id = auth.uid()
  LIMIT 1;
$function$;

-- Create proper tenant admin policies using the security definer function
CREATE POLICY "Tenant admins can view organizations in their tenant" 
ON public.organizations 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'tenant_admin') OR
  (tenant_id = public.get_current_user_tenant_id() AND public.has_role(auth.uid(), 'tenant_admin'))
);

CREATE POLICY "Tenant admins can manage organizations in their tenant"
ON public.organizations
FOR ALL
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  (public.has_role(auth.uid(), 'tenant_admin') AND tenant_id = public.get_current_user_tenant_id())
);