import type { Request, Response, NextFunction } from 'express'
import { passport } from '../config/passport'
import { AppError } from './error-handler'
import type { JwtPayload } from '../lib/jwt'
import { prisma } from '../lib/prisma'

declare global {
  namespace Express {
    interface User extends JwtPayload {}
  }
}

export const requireAuth = passport.authenticate('jwt', { session: false })

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload | undefined
    if (!user || !roles.includes(user.role)) {
      next(new AppError(403, 'Insufficient permissions'))
      return
    }
    next()
  }
}

export function requireStoreAccess(req: Request, _res: Response, next: NextFunction) {
  const user = req.user as JwtPayload | undefined
  const storeSlug = req.params.storeSlug ? String(req.params.storeSlug) : undefined
  if (!user) {
    next(new AppError(401, 'Authentication required'))
    return
  }
  if (user.role === 'SUPER_ADMIN') {
    next()
    return
  }
  if (!storeSlug) {
    next(new AppError(400, 'Store slug required'))
    return
  }
  if (!user.storeId) {
    next(new AppError(403, 'Store access is not available for this account'))
    return
  }

  prisma.store.findUnique({ where: { slug: storeSlug }, select: { id: true } })
    .then((store) => {
      if (!store || store.id !== user.storeId) {
        next(new AppError(403, 'You do not have access to this store'))
        return
      }
      next()
    })
    .catch(next)
}
