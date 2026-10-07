import axios from 'axios'
import type { ApiError } from '@/types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-storage')
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { state?: { token?: string } }
      const token = parsed.state?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // ignore parse errors
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const path = window.location.pathname
        if (path !== '/login' && path !== '/create-store' && path !== '/payment') {
          localStorage.removeItem('auth-storage')
          window.location.href = '/login'
        }
      }
      const apiError: ApiError = {
        message:
          (error.response?.data as { message?: string })?.message ??
          error.message,
        statusCode: error.response?.status ?? 500,
        errors: (error.response?.data as { errors?: Record<string, string[]> })
          ?.errors,
      }
      return Promise.reject(apiError)
    }
    return Promise.reject(error)
  },
)

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
