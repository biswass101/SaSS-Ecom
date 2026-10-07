import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { authApi } from '../api'
import { storefrontService } from '@/lib/api-services'
import type { LoginFormValues, RegisterFormValues } from '../schemas'

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: async (res: any) => {
      // Handle both regular login and store login responses
      const store = res.store ? { id: res.store.id, slug: res.store.slug, name: res.store.name } : null
      login(res.token, res.user, store)
      toast.success('Welcome back!')

      // Role-based routing
      if (res.user.role === 'SUPER_ADMIN') {
        navigate('/management')
      } else if (res.user.role === 'STORE_ADMIN' && store?.slug) {
        try {
          // Check if payment has been verified
          const status = await storefrontService.getSubscriptionStatus(store.slug)
          if (!status.isPaid) {
            // Payment not verified - redirect to payment page
            navigate(`/payment?subscriptionId=${status.subscriptionId}`)
            toast.info('Please complete your payment to access the dashboard')
          } else {
            // Payment verified - go to dashboard
            navigate(`/${store.slug}/admin`)
          }
        } catch (error) {
          // If status check fails, still go to dashboard (will show inactive message if needed)
          console.error('Failed to check payment status:', error)
          navigate(`/${store.slug}/admin`)
        }
      } else {
        navigate('/')
      }
    },
  })
}

export function useRegister() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterFormValues) => {
      const { confirmPassword: _, ...rest } = data
      return authApi.register(rest)
    },
    onSuccess: (res) => {
      login(res.token, res.user)
      toast.success('Account created successfully!')
      navigate('/create-store')
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return () => {
    logout()
    navigate('/')
    toast.success('Logged out')
  }
}
