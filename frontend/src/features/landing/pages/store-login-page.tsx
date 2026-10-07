import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Store } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth-store'
import { authService, storefrontService } from '@/lib/api-services'
import { useState } from 'react'

const storeLoginSchema = z.object({
  storeSlug: z
    .string()
    .min(1, 'Store slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens',
    ),
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type StoreLoginValues = z.infer<typeof storeLoginSchema>

export default function StoreLoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<StoreLoginValues>({
    resolver: zodResolver(storeLoginSchema),
    defaultValues: {
      storeSlug: '',
      email: '',
      password: '',
    },
  })

  const { register, handleSubmit, formState: { errors } } = form

  async function onSubmit(data: StoreLoginValues) {
    setIsSubmitting(true)
    try {
      const result = await authService.storeLogin(data)
      const store = result.store ? { id: result.store.id, slug: result.store.slug, name: result.store.name } : null
      login(result.token, result.user, store)
      toast.success('Welcome back!')
      try {
        const status = await storefrontService.getSubscriptionStatus(data.storeSlug)
        if (!status.isPaid) {
          navigate(`/payment?subscriptionId=${status.subscriptionId}`)
          toast.info('Please complete your payment to access the dashboard')
          return
        }
      } catch { /* proceed to dashboard if check fails */ }
      navigate(`/${data.storeSlug}/admin`)
    } catch {
      toast.error('Unable to sign in', { description: 'Check your store slug, email, and password.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-16">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-xl border bg-card p-8 shadow-soft">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary">
              <Store className="size-6 text-primary-foreground" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold">
              Store Admin Login
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to manage your store
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="storeSlug">Store Slug</Label>
              <Input
                id="storeSlug"
                placeholder="my-store"
                className="mt-1.5"
                {...register('storeSlug')}
                aria-invalid={!!errors.storeSlug}
              />
              {errors.storeSlug && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.storeSlug.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1.5"
                autoComplete="email"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1.5"
                autoComplete="current-password"
                {...register('password')}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-2 text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have a store?{' '}
              <Link
                to="/create-store"
                className="font-medium text-primary hover:underline"
              >
                Create a store
              </Link>
            </p>
            <p className="text-muted-foreground">
              Super admin?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Super admin login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
