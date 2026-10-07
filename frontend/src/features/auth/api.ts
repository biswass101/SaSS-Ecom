import { api, USE_MOCKS } from '@/lib/api'
import { delay } from '@/lib/utils'
import { mockUsers } from '@/mocks/data'
import type { ApiResponse, User } from '@/types'
import type { LoginFormValues, RegisterFormValues } from './schemas'

interface AuthResponse {
  token: string
  user: User
}

export const authApi = {
  login: async (data: LoginFormValues): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      await delay(500)
      const user =
        data.email === 'admin@storestack.com'
          ? mockUsers[0]
          : mockUsers[1]
      return { token: 'mock-jwt-token-' + user.id, user }
    }
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return (res as unknown as ApiResponse<AuthResponse>).data
  },

  register: async (
    data: Omit<RegisterFormValues, 'confirmPassword'>,
  ): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      await delay(500)
      const user: User = {
        id: 'usr_new',
        email: data.email,
        name: data.name,
        role: 'STORE_ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return { token: 'mock-jwt-token-new', user }
    }
    const res = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data,
    )
    return (res as unknown as ApiResponse<AuthResponse>).data
  },

  me: async (): Promise<User> => {
    if (USE_MOCKS) {
      await delay(200)
      return mockUsers[1]
    }
    const res = await api.get<ApiResponse<User>>('/auth/me')
    return (res as unknown as ApiResponse<User>).data
  },
}
