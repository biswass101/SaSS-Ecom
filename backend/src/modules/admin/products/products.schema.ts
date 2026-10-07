import { z } from 'zod'

export const createProductSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  stock: z.number().int().min(0).default(0),
})

export const updateProductSchema = createProductSchema.partial()
