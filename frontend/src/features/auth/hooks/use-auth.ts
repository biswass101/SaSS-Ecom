import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { authApi } from '../api'
import type { LoginFormValues, RegisterFormValues } from '../schemas'

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: (res) => {
      login(res.token, res.user)
      toast.success('Welcome back!')
      if (res.user.role === 'SUPER_ADMIN') {
        navigate('/management')
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
