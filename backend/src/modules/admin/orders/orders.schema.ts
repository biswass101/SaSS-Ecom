import { z } from 'zod'

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})

export const updateOrderPaymentStatusSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
})
