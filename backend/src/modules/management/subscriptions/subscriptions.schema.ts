import { z } from 'zod'

export const updateSubscriptionSchema = z.object({
  status: z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED']).optional(),
  packageId: z.string().optional(),
})
