import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/types'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        const apiError = error as unknown as ApiError
        toast.error(apiError.message ?? 'Something went wrong')
      },
    },
  },
})
