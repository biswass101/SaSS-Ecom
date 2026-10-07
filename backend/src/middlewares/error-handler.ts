import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { logger } from '../lib/logger'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
    })
    return
  }

  if (error instanceof ZodError) {
    const flat = error.flatten()
    res.status(400).json({
      message: 'Validation failed',
      statusCode: 400,
      errors: flat.fieldErrors,
    })
    return
  }

  logger.error(error)
  res.status(500).json({ message: 'Internal server error', statusCode: 500 })
}
