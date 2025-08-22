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
      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Set default permissions first
      setPermissions({
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

      // Try to check admin roles with fallback
      let isSuperAdmin = false;
      let isTenantAdmin = false;
      let isOrgAdmin = false;
      let isDomainAdmin = false;
      let isSystemSecurity = false;
      let userRoles: string[] = [];
      let allPermissions: string[] = [];

      try {
        // Check if SQL functions exist by trying to call them
        const superAdminResult = await supabase.rpc('is_super_admin', { _user_id: user.id });
        isSuperAdmin = superAdminResult.data || false;
      } catch (error) {
        console.warn('is_super_admin function not available, using default permissions');
      }

      try {
        const userRolesResult = await supabase
          .from('user_roles')
          .select(`
            roles (name, role_type, permissions)
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);
        
        if (userRolesResult.data) {
          userRoles = userRolesResult.data.map(ur => ur.roles?.name).filter(Boolean) || [];
          // Handle permissions properly - convert Json[] to string[]
          allPermissions = userRolesResult.data.flatMap(ur => {
            const rolePermissions = ur.roles?.permissions;
            if (Array.isArray(rolePermissions)) {
              return rolePermissions.map(p => String(p)).filter(Boolean);
            }
            return [];
          }) || [];
        }
      } catch (error) {
        console.warn('Unable to fetch user roles, using default permissions');
      }

      setPermissions({
        isSuperAdmin,
        isTenantAdmin,
        isOrgAdmin,
        isDomainAdmin,
        isSystemSecurity,
        userRoles,
        canManageUsers: isSuperAdmin || allPermissions.includes('manage_users'),
        canManageOrganizations: isSuperAdmin || allPermissions.includes('manage_organizations'),
        canManageDomains: isSuperAdmin || allPermissions.includes('manage_domains'),
        canViewReports: isSuperAdmin || allPermissions.includes('view_reports'),
        canManageSystem: isSuperAdmin || allPermissions.includes('manage_system'),
        canManageBilling: isSuperAdmin || allPermissions.includes('manage_billing'),
        canManageStorage: isSuperAdmin || allPermissions.includes('manage_storage'),
      });
    } catch (error) {
      console.error('Error checking user permissions:', error);
      // Set safe default permissions
      setPermissions({
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
    // Always allow access if we can't determine permissions (safe fallback)
    if (loading) return true;
    
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
        return true; // Default to allowing access for unknown modules
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