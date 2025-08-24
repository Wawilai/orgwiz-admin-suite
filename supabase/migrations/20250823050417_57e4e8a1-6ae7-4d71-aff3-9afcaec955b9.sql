-- Add RLS policy for tenant admins to view all organizations within their tenant
CREATE POLICY "Tenant admins can view all organizations in their tenant" 
ON public.organizations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p
    JOIN public.organizations o ON p.organization_id = o.id
    WHERE p.user_id = auth.uid()
      AND o.tenant_id = organizations.tenant_id
      AND public.has_role(auth.uid(), 'tenant_admin')
  )
  OR public.has_role(auth.uid(), 'tenant_admin')
);

-- Add RLS policy for tenant admins to manage organizations in their tenant  
CREATE POLICY "Tenant admins can manage organizations in their tenant"
ON public.organizations
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p
    JOIN public.organizations o ON p.organization_id = o.id
    WHERE p.user_id = auth.uid()
      AND o.tenant_id = organizations.tenant_id
      AND public.has_role(auth.uid(), 'tenant_admin')
  )
  OR public.has_role(auth.uid(), 'tenant_admin')
);