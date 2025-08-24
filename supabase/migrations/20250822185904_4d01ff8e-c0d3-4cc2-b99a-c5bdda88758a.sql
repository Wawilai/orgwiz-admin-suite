-- ===============================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_data_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_data_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ===============================
-- HELPER FUNCTIONS FOR RLS
-- ===============================

-- Function to get current user's organization ID (SECURITY DEFINER to avoid infinite recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_organization_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT organization_id 
  FROM public.profiles 
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- Function to check if user has specific role (SECURITY DEFINER to avoid infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role_type public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = _user_id
      AND r.role_type = _role_type
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  );
$$;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'super_admin');
$$;

-- Function to check if user is organization admin for specific org
CREATE OR REPLACE FUNCTION public.is_organization_admin(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.user_roles ur ON p.user_id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE p.user_id = _user_id
      AND p.organization_id = _org_id
      AND r.role_type IN ('super_admin', 'organization_admin')
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  );
$$;

-- Fix function search paths
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.get_full_email_address(TEXT, UUID) SET search_path = public;

-- ===============================
-- ORGANIZATIONS RLS POLICIES
-- ===============================

-- Super admins can see all organizations
CREATE POLICY "Super admins can view all organizations" ON public.organizations
  FOR SELECT USING (public.is_super_admin());

-- Organization admins and users can see their own organization
CREATE POLICY "Users can view their organization" ON public.organizations
  FOR SELECT USING (
    id = public.get_current_user_organization_id()
  );

-- Super admins can insert/update/delete organizations
CREATE POLICY "Super admins can manage organizations" ON public.organizations
  FOR ALL USING (public.is_super_admin());

-- Organization admins can update their organization
CREATE POLICY "Organization admins can update their organization" ON public.organizations
  FOR UPDATE USING (
    id = public.get_current_user_organization_id() AND 
    public.is_organization_admin(auth.uid(), id)
  );

-- ===============================
-- PROFILES RLS POLICIES
-- ===============================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

-- Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_super_admin());

-- Organization admins can view profiles in their organization
CREATE POLICY "Organization admins can view organization profiles" ON public.profiles
  FOR SELECT USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Super admins can manage all profiles
CREATE POLICY "Super admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage profiles in their organization
CREATE POLICY "Organization admins can manage organization profiles" ON public.profiles
  FOR ALL USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- ===============================
-- ORGANIZATION UNITS RLS POLICIES
-- ===============================

-- Users can view units in their organization
CREATE POLICY "Users can view organization units" ON public.organization_units
  FOR SELECT USING (
    organization_id = public.get_current_user_organization_id()
  );

-- Super admins can manage all organization units
CREATE POLICY "Super admins can manage all organization units" ON public.organization_units
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage units in their organization
CREATE POLICY "Organization admins can manage organization units" ON public.organization_units
  FOR ALL USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- ===============================
-- ROLES RLS POLICIES
-- ===============================

-- Users can view roles in their organization
CREATE POLICY "Users can view organization roles" ON public.roles
  FOR SELECT USING (
    organization_id = public.get_current_user_organization_id() OR
    organization_id IS NULL -- System roles
  );

-- Super admins can manage all roles
CREATE POLICY "Super admins can manage all roles" ON public.roles
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage non-system roles in their organization
CREATE POLICY "Organization admins can manage organization roles" ON public.roles
  FOR ALL USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id) AND
    is_system_role = false
  );

-- ===============================
-- USER ROLES RLS POLICIES
-- ===============================

-- Users can view their own role assignments
CREATE POLICY "Users can view own role assignments" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

-- Super admins can view all role assignments
CREATE POLICY "Super admins can view all role assignments" ON public.user_roles
  FOR SELECT USING (public.is_super_admin());

-- Organization admins can view role assignments in their organization
CREATE POLICY "Organization admins can view organization role assignments" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = user_roles.user_id 
        AND p.organization_id = public.get_current_user_organization_id()
    ) AND public.is_organization_admin(auth.uid(), public.get_current_user_organization_id())
  );

-- Super admins can manage all role assignments
CREATE POLICY "Super admins can manage all role assignments" ON public.user_roles
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage role assignments in their organization
CREATE POLICY "Organization admins can manage organization role assignments" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = user_roles.user_id 
        AND p.organization_id = public.get_current_user_organization_id()
    ) AND public.is_organization_admin(auth.uid(), public.get_current_user_organization_id())
  );

-- ===============================
-- DOMAINS RLS POLICIES
-- ===============================

-- Users can view domains in their organization
CREATE POLICY "Users can view organization domains" ON public.domains
  FOR SELECT USING (
    organization_id = public.get_current_user_organization_id()
  );

-- Super admins can manage all domains
CREATE POLICY "Super admins can manage all domains" ON public.domains
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage domains in their organization
CREATE POLICY "Organization admins can manage organization domains" ON public.domains
  FOR ALL USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- ===============================
-- MAILBOXES RLS POLICIES
-- ===============================

-- Users can view their own mailboxes
CREATE POLICY "Users can view own mailboxes" ON public.mailboxes
  FOR SELECT USING (user_id = auth.uid());

-- Super admins can view all mailboxes
CREATE POLICY "Super admins can view all mailboxes" ON public.mailboxes
  FOR SELECT USING (public.is_super_admin());

-- Organization admins can view mailboxes for domains in their organization
CREATE POLICY "Organization admins can view organization mailboxes" ON public.mailboxes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.domains d 
      WHERE d.id = mailboxes.domain_id 
        AND d.organization_id = public.get_current_user_organization_id()
    ) AND public.is_organization_admin(auth.uid(), public.get_current_user_organization_id())
  );

-- Super admins can manage all mailboxes
CREATE POLICY "Super admins can manage all mailboxes" ON public.mailboxes
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage mailboxes for domains in their organization
CREATE POLICY "Organization admins can manage organization mailboxes" ON public.mailboxes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.domains d 
      WHERE d.id = mailboxes.domain_id 
        AND d.organization_id = public.get_current_user_organization_id()
    ) AND public.is_organization_admin(auth.uid(), public.get_current_user_organization_id())
  );

-- ===============================
-- LICENSES RLS POLICIES
-- ===============================

-- Users can view licenses for their organization
CREATE POLICY "Users can view organization licenses" ON public.licenses
  FOR SELECT USING (
    organization_id = public.get_current_user_organization_id()
  );

-- Super admins can manage all licenses
CREATE POLICY "Super admins can manage all licenses" ON public.licenses
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage licenses for their organization
CREATE POLICY "Organization admins can manage organization licenses" ON public.licenses
  FOR ALL USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- ===============================
-- LICENSE ASSIGNMENTS RLS POLICIES
-- ===============================

-- Users can view their own license assignments
CREATE POLICY "Users can view own license assignments" ON public.license_assignments
  FOR SELECT USING (user_id = auth.uid());

-- Super admins can view all license assignments
CREATE POLICY "Super admins can view all license assignments" ON public.license_assignments
  FOR SELECT USING (public.is_super_admin());

-- Organization admins can view license assignments for their organization
CREATE POLICY "Organization admins can view organization license assignments" ON public.license_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.licenses l 
      WHERE l.id = license_assignments.license_id 
        AND l.organization_id = public.get_current_user_organization_id()
    ) AND public.is_organization_admin(auth.uid(), public.get_current_user_organization_id())
  );

-- Super admins can manage all license assignments
CREATE POLICY "Super admins can manage all license assignments" ON public.license_assignments
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage license assignments for their organization
CREATE POLICY "Organization admins can manage organization license assignments" ON public.license_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.licenses l 
      WHERE l.id = license_assignments.license_id 
        AND l.organization_id = public.get_current_user_organization_id()
    ) AND public.is_organization_admin(auth.uid(), public.get_current_user_organization_id())
  );

-- ===============================
-- LICENSE USAGE LOGS RLS POLICIES
-- ===============================

-- Users can view their own usage logs
CREATE POLICY "Users can view own license usage logs" ON public.license_usage_logs
  FOR SELECT USING (user_id = auth.uid());

-- Super admins can view all usage logs
CREATE POLICY "Super admins can view all license usage logs" ON public.license_usage_logs
  FOR SELECT USING (public.is_super_admin());

-- Organization admins can view usage logs for their organization's licenses
CREATE POLICY "Organization admins can view organization license usage logs" ON public.license_usage_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.licenses l 
      WHERE l.id = license_usage_logs.license_id 
        AND l.organization_id = public.get_current_user_organization_id()
    ) AND public.is_organization_admin(auth.uid(), public.get_current_user_organization_id())
  );

-- Super admins can manage all usage logs
CREATE POLICY "Super admins can manage all license usage logs" ON public.license_usage_logs
  FOR ALL USING (public.is_super_admin());

-- Users can insert their own usage logs
CREATE POLICY "Users can create own license usage logs" ON public.license_usage_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ===============================
-- CONTACTS RLS POLICIES
-- ===============================

-- Users can view contacts in their organization
CREATE POLICY "Users can view organization contacts" ON public.contacts
  FOR SELECT USING (
    organization_id = public.get_current_user_organization_id()
  );

-- Users can create contacts in their organization
CREATE POLICY "Users can create organization contacts" ON public.contacts
  FOR INSERT WITH CHECK (
    organization_id = public.get_current_user_organization_id() AND
    created_by = auth.uid()
  );

-- Users can update contacts they created
CREATE POLICY "Users can update own contacts" ON public.contacts
  FOR UPDATE USING (created_by = auth.uid());

-- Users can delete contacts they created
CREATE POLICY "Users can delete own contacts" ON public.contacts
  FOR DELETE USING (created_by = auth.uid());

-- Super admins can manage all contacts
CREATE POLICY "Super admins can manage all contacts" ON public.contacts
  FOR ALL USING (public.is_super_admin());

-- ===============================
-- SECURITY POLICIES RLS POLICIES
-- ===============================

-- Organization admins can view security policies for their organization
CREATE POLICY "Organization admins can view organization security policies" ON public.security_policies
  FOR SELECT USING (
    (organization_id = public.get_current_user_organization_id() OR organization_id IS NULL) AND
    public.is_organization_admin(auth.uid(), COALESCE(organization_id, public.get_current_user_organization_id()))
  );

-- Super admins can manage all security policies
CREATE POLICY "Super admins can manage all security policies" ON public.security_policies
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage security policies for their organization
CREATE POLICY "Organization admins can manage organization security policies" ON public.security_policies
  FOR ALL USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- ===============================
-- STORAGE QUOTAS RLS POLICIES
-- ===============================

-- Users can view their own quotas
CREATE POLICY "Users can view own storage quotas" ON public.storage_quotas
  FOR SELECT USING (user_id = auth.uid());

-- Users can view organization-level quotas
CREATE POLICY "Users can view organization storage quotas" ON public.storage_quotas
  FOR SELECT USING (
    organization_id = public.get_current_user_organization_id() AND user_id IS NULL
  );

-- Super admins can manage all storage quotas
CREATE POLICY "Super admins can manage all storage quotas" ON public.storage_quotas
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage quotas for their organization
CREATE POLICY "Organization admins can manage organization storage quotas" ON public.storage_quotas
  FOR ALL USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- ===============================
-- BILLING ACCOUNTS RLS POLICIES
-- ===============================

-- Organization admins can view billing for their organization
CREATE POLICY "Organization admins can view organization billing" ON public.billing_accounts
  FOR SELECT USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- Super admins can manage all billing accounts
CREATE POLICY "Super admins can manage all billing accounts" ON public.billing_accounts
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage billing for their organization
CREATE POLICY "Organization admins can manage organization billing" ON public.billing_accounts
  FOR ALL USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- ===============================
-- MASTER DATA RLS POLICIES
-- ===============================

-- Users can view master data types
CREATE POLICY "Users can view master data types" ON public.master_data_types
  FOR SELECT TO authenticated USING (true);

-- Super admins can manage master data types
CREATE POLICY "Super admins can manage master data types" ON public.master_data_types
  FOR ALL USING (public.is_super_admin());

-- Users can view master data items for their organization or global items
CREATE POLICY "Users can view master data items" ON public.master_data_items
  FOR SELECT USING (
    organization_id = public.get_current_user_organization_id() OR 
    organization_id IS NULL
  );

-- Super admins can manage all master data items
CREATE POLICY "Super admins can manage all master data items" ON public.master_data_items
  FOR ALL USING (public.is_super_admin());

-- Organization admins can manage master data items for their organization
CREATE POLICY "Organization admins can manage organization master data items" ON public.master_data_items
  FOR ALL USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- ===============================
-- ACTIVITY LOGS RLS POLICIES
-- ===============================

-- Organization admins can view activity logs for their organization
CREATE POLICY "Organization admins can view organization activity logs" ON public.activity_logs
  FOR SELECT USING (
    organization_id = public.get_current_user_organization_id() AND
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- Super admins can view all activity logs
CREATE POLICY "Super admins can view all activity logs" ON public.activity_logs
  FOR SELECT USING (public.is_super_admin());

-- System can insert activity logs
CREATE POLICY "System can insert activity logs" ON public.activity_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- Super admins can manage all activity logs
CREATE POLICY "Super admins can manage all activity logs" ON public.activity_logs
  FOR ALL USING (public.is_super_admin());