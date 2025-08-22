import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredModule?: string;
  requiredRoles?: string[];
  requiredPermission?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredModule,
  requiredRoles,
  requiredPermission,
  fallback
}: ProtectedRouteProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { permissions, loading: permLoading, canAccessModule, hasAnyRole, hasPermission } = usePermissions();

  // Show loading while checking authentication and permissions
  if (authLoading || permLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If no specific requirements, just show the children
  if (!requiredModule && !requiredRoles && !requiredPermission) {
    return <>{children}</>;
  }

  // Check module access
  if (requiredModule && !canAccessModule(requiredModule)) {
    return fallback || (
      <div className="container mx-auto p-6">
        <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            คุณไม่มีสิทธิ์เข้าถึงโมดูลนี้ กรุณาติดต่อผู้ดูแลระบบ
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check required roles (only if we have role data)
  if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return fallback || (
      <div className="container mx-auto p-6">
        <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            คุณไม่มีบทบาทที่จำเป็นสำหรับการเข้าถึงหน้านี้
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check specific permission (only if we have permission data)
  if (requiredPermission && !hasPermission(requiredPermission as any)) {
    return fallback || (
      <div className="container mx-auto p-6">
        <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            คุณไม่มีสิทธิ์ที่จำเป็นสำหรับการดำเนินการนี้
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;