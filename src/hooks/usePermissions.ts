import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserPermissions {
  isSuperAdmin: boolean;
  isTenantAdmin: boolean;
  isOrgAdmin: boolean;
  isDomainAdmin: boolean;
  isSystemSecurity: boolean;
  userRoles: string[];
  canManageUsers: boolean;
  canManageOrganizations: boolean;
  canManageDomains: boolean;
  canViewReports: boolean;
  canManageSystem: boolean;
  canManageBilling: boolean;
  canManageStorage: boolean;
}

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions>({
    isSuperAdmin: false,
    isTenantAdmin: false,
    isOrgAdmin: false,
    isDomainAdmin: false,
    isSystemSecurity: false,
    userRoles: [],
    canManageUsers: false,
    canManageOrganizations: false,
    canManageDomains: false,
    canViewReports: false,
    canManageSystem: false,
    canManageBilling: false,
    canManageStorage: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkUserPermissions();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const checkUserPermissions = async () => {
    try {
      if (!user?.id) return;

      // Check different admin roles
      const [
        superAdminResult,
        tenantAdminResult,
        orgAdminResult,
        domainAdminResult,
        systemSecurityResult,
        userRolesResult
      ] = await Promise.all([
        supabase.rpc('is_super_admin', { _user_id: user.id }),
        supabase.rpc('has_role', { _user_id: user.id, _role_type: 'tenant_admin' }),
        supabase.rpc('has_role', { _user_id: user.id, _role_type: 'org_admin' }),
        supabase.rpc('has_role', { _user_id: user.id, _role_type: 'domain_admin' }),
        supabase.rpc('has_role', { _user_id: user.id, _role_type: 'system_security' }),
        supabase
          .from('user_roles')
          .select(`
            roles (name, role_type, permissions)
          `)
          .eq('user_id', user.id)
          .eq('is_active', true)
      ]);

      const isSuperAdmin = superAdminResult.data || false;
      const isTenantAdmin = tenantAdminResult.data || false;
      const isOrgAdmin = orgAdminResult.data || false;
      const isDomainAdmin = domainAdminResult.data || false;
      const isSystemSecurity = systemSecurityResult.data || false;

      const userRoles = userRolesResult.data?.map(ur => ur.roles?.name).filter(Boolean) || [];
      const allPermissions = userRolesResult.data?.flatMap(ur => ur.roles?.permissions || []) || [];

      setPermissions({
        isSuperAdmin,
        isTenantAdmin,
        isOrgAdmin,
        isDomainAdmin,
        isSystemSecurity,
        userRoles,
        canManageUsers: isSuperAdmin || isTenantAdmin || isOrgAdmin || allPermissions.includes('manage_users'),
        canManageOrganizations: isSuperAdmin || isTenantAdmin || allPermissions.includes('manage_organizations'),
        canManageDomains: isSuperAdmin || isTenantAdmin || isDomainAdmin || allPermissions.includes('manage_domains'),
        canViewReports: isSuperAdmin || isTenantAdmin || isOrgAdmin || allPermissions.includes('view_reports'),
        canManageSystem: isSuperAdmin || isSystemSecurity || allPermissions.includes('manage_system'),
        canManageBilling: isSuperAdmin || isTenantAdmin || isOrgAdmin || allPermissions.includes('manage_billing'),
        canManageStorage: isSuperAdmin || isTenantAdmin || isOrgAdmin || allPermissions.includes('manage_storage'),
      });
    } catch (error) {
      console.error('Error checking user permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (permissions.isSuperAdmin) return true;
    return permissions[permission] as boolean;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (permissions.isSuperAdmin) return true;
    return roles.some(role => permissions.userRoles.includes(role));
  };

  const canAccessModule = (module: string): boolean => {
    if (permissions.isSuperAdmin) return true;

    switch (module) {
      case 'users':
        return permissions.canManageUsers;
      case 'organizations':
        return permissions.canManageOrganizations;
      case 'domains':
        return permissions.canManageDomains;
      case 'reports':
        return permissions.canViewReports;
      case 'system':
        return permissions.canManageSystem;
      case 'billing':
        return permissions.canManageBilling;
      case 'storage':
        return permissions.canManageStorage;
      case 'roles':
        return permissions.isSuperAdmin || permissions.isTenantAdmin || permissions.isOrgAdmin;
      case 'security':
        return permissions.isSuperAdmin || permissions.isSystemSecurity;
      default:
        return false;
    }
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyRole,
    canAccessModule,
    refresh: checkUserPermissions
  };
};

export default usePermissions;