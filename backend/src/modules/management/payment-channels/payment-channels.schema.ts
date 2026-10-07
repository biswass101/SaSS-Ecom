import { z } from 'zod'

export const createPaymentChannelSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  accountNumber: z.string().min(1),
  instructions: z.string().min(1),
  isActive: z.boolean().default(true),
})

export const updatePaymentChannelSchema = createPaymentChannelSchema.partial()
