import React from 'react';
import { useAuth, UserRole } from './AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requirePermission?: string;
}

export function RoleGuard({ allowedRoles, children, fallback, requirePermission }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return fallback || (
      <Alert className="border-destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>Please log in to access this content.</AlertDescription>
      </Alert>
    );
  }

  // Check role access
  const hasRoleAccess = allowedRoles.includes(user.role);
  
  // Check specific permission if required
  const hasPermission = !requirePermission || 
    user.permissions?.includes('all') || 
    user.permissions?.includes(requirePermission);

  if (!hasRoleAccess || !hasPermission) {
    return fallback || (
      <Alert className="border-destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this content.
          {requirePermission && ` Missing permission: ${requirePermission}`}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

// Higher-order component for route protection
export function withRoleGuard<T extends object>(
  Component: React.ComponentType<T>,
  allowedRoles: UserRole[],
  requirePermission?: string
) {
  return function GuardedComponent(props: T) {
    return (
      <RoleGuard allowedRoles={allowedRoles} requirePermission={requirePermission}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}

// Utility hook to check permissions
export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions?.includes('all') || user.permissions?.includes(permission) || false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    permissions: user?.permissions || [],
    role: user?.role,
  };
}