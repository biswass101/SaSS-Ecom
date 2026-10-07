import { Link } from 'react-router'
import { Logo } from '@/components/shared/logo'
import { LoginForm } from '@/features/auth/components/login-form'

export default function LoginPage() {
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
              Super admin &amp; management portal
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-lg border border-dashed bg-muted/50 p-4">
            <p className="text-center text-xs font-medium text-muted-foreground">
              Demo credentials
            </p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              <span className="font-mono">admin@storestack.com</span>{' '}
              <span className="text-muted-foreground/60">(super admin)</span>
            </p>
          </div>

          {/* Store admin link */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Store admin?{' '}
            <Link
              to="/store-login"
              className="font-medium text-primary hover:underline"
            >
              Sign in to your store
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
