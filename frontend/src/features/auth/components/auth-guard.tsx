import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/auth-store'
import type { UserRole } from '@/types'

interface AuthGuardProps {
  allowedRoles?: UserRole[]
}

export function AuthGuard({ allowedRoles }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
