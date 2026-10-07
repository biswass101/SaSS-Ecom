import { z } from 'zod'

export const createCategorySchema = z.object({
  title: z.string().min(1),
})

export const updateCategorySchema = createCategorySchema.partial()
