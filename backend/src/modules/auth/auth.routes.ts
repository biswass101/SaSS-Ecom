import { Router } from 'express'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const authRouter = Router()

authRouter.post('/login', (request, response) => {
  const result = loginSchema.safeParse(request.body)
  if (!result.success) {
    response.status(400).json({ message: 'Invalid credentials payload', issues: result.error.flatten() })
    return
  }

  response.status(501).json({ message: 'Authentication service is ready for implementation' })
})
