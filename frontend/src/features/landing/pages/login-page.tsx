import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Logo } from '@/components/shared/logo'
import { LoginForm } from '@/features/auth/components/login-form'
import { useAuthStore } from '@/stores/auth-store'

export default function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const store = useAuthStore((s) => s.store)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'SUPER_ADMIN') {
        navigate('/management', { replace: true })
      } else if (user.role === 'STORE_ADMIN') {
        if (store?.slug) {
          navigate(`/${store.slug}/admin`, { replace: true })
        } else {
          navigate('/create-store', { replace: true })
        }
      }
    }
  }, [isAuthenticated, user, store, navigate])

  if (isAuthenticated) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-16">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-xl border bg-card p-8 shadow-soft">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold">
              Sign in to your account
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Super admin, management, or store admin
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-lg border border-dashed bg-muted/50 p-4">
            <p className="text-center text-xs font-medium text-muted-foreground">
              Super Admin Credentials
            </p>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Email: <span className="font-mono text-foreground">admin@storestack.com</span>
            </p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Password: <span className="font-mono text-foreground">password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
