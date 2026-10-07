import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
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

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'A record with this value already exists', statusCode: 409 })
      return
    }
    if (error.code === 'P2003') {
      res.status(400).json({ message: 'Cannot complete this action due to related records', statusCode: 400 })
      return
    }
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Record not found', statusCode: 404 })
      return
    }
  }

  logger.error(error)
  res.status(500).json({ message: 'Internal server error', statusCode: 500 })
}
