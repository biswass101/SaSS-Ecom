import { z } from 'zod'

export const createStoreSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional(),
  packageId: z.string().min(1),
  ownerName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export const updateStoreStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
})
