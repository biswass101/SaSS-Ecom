import type { ErrorRequestHandler } from 'express'
import { logger } from '../lib/logger'

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  logger.error(error)
  response.status(500).json({ message: 'Internal server error' })
}
