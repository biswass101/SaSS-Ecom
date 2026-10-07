import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma'
import { signToken } from '../../lib/jwt'
import { AppError } from '../../middlewares/error-handler'
import { logger } from '../../lib/logger'
import type { UserRole } from '@prisma/client'

function formatUser(user: { id: string; email: string; name: string; role: UserRole; createdAt: Date; updatedAt: Date }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}

export async function loginUser(email: string, password: string) {
  logger.info({ email }, 'Login attempt')
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new AppError(401, 'Invalid email or password')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new AppError(401, 'Invalid email or password')

  const token = signToken({ sub: user.id, email: user.email, role: user.role })
  logger.info({ userId: user.id, role: user.role }, 'Login successful')
  return { token, user: formatUser(user) }
}

export async function registerUser(name: string, email: string, password: string) {
  logger.info({ email }, 'Registration attempt')
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) throw new AppError(409, 'Email already registered')

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'STORE_ADMIN' },
  })

  const token = signToken({ sub: user.id, email: user.email, role: user.role })
  logger.info({ userId: user.id }, 'Registration successful')
  return { token, user: formatUser(user) }
}

export async function storeLogin(storeSlug: string, email: string, password: string) {
  logger.info({ storeSlug, email }, 'Store login attempt')
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } })
  if (!store) throw new AppError(404, 'Store not found')

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new AppError(401, 'Invalid email or password')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new AppError(401, 'Invalid email or password')

  if (user.role !== 'SUPER_ADMIN' && store.ownerId !== user.id) {
    throw new AppError(403, 'You do not have access to this store')
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role, storeId: store.id })
  logger.info({ userId: user.id, storeSlug }, 'Store login successful')
  return { token, user: formatUser(user), store: { id: store.id, slug: store.slug, name: store.name } }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new AppError(404, 'User not found')
  return formatUser(user)
}
