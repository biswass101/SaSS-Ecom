import type { Response } from 'express'

export function success<T>(res: Response, data: T, message?: string, status = 200) {
  res.status(status).json({ data, message })
}

export function paginated<T>(
  res: Response,
  data: T[],
  meta: { page: number; limit: number; total: number },
) {
  res.json({
    data,
    meta: { ...meta, totalPages: Math.ceil(meta.total / meta.limit) },
  })
}

export function fail(res: Response, message: string, status = 400) {
  res.status(status).json({ message, statusCode: status })
}
