import { z } from 'zod'

export const createPackageSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  billingCycle: z.enum(['monthly', 'yearly']),
  maxProducts: z.number().int(),
  maxOrders: z.number().int(),
  features: z.array(z.string()),
  isActive: z.boolean().default(true),
})

export const updatePackageSchema = createPackageSchema.partial()
