import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'
import { signToken } from '../../../lib/jwt'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

export async function getAllStores() {
  logger.info('Fetching all stores')
  return prisma.store.findMany({
    include: {
      owner: { select: { id: true, name: true, email: true } },
      subscription: { include: { package: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getStoreById(id: string) {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      subscription: { include: { package: true } },
    },
  })
  if (!store) throw new AppError(404, 'Store not found')
  return store
}

export async function createStore(data: {
  name: string
  slug: string
  description?: string
  packageId: string
  ownerName: string
  email: string
  password: string
}) {
  logger.info({ slug: data.slug }, 'Creating new store')

  const existingSlug = await prisma.store.findUnique({ where: { slug: data.slug } })
  if (existingSlug) throw new AppError(409, 'Store slug already taken')

  const pkg = await prisma.package.findUnique({ where: { id: data.packageId } })
  if (!pkg) throw new AppError(404, 'Package not found')

  let user = await prisma.user.findUnique({ where: { email: data.email } })
  if (!user) {
    const hash = await bcrypt.hash(data.password, 10)
    user = await prisma.user.create({
      data: { name: data.ownerName, email: data.email, passwordHash: hash, role: 'STORE_ADMIN' },
    })
  }

  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + (pkg.billingCycle === 'yearly' ? 12 : 1))

  const store = await prisma.store.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      ownerId: user.id,
      subscription: {
        create: {
          packageId: pkg.id,
          endDate,
        },
      },
    },
    include: {
      owner: { select: { id: true, name: true, email: true, role: true } },
      subscription: { include: { package: true } },
    },
  })

  const token = signToken({ sub: user.id, email: user.email, role: user.role, storeId: store.id })
  logger.info({ storeId: store.id, userId: user.id }, 'Store created successfully')

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    store,
  }
}

export async function updateStoreStatus(id: string, status: string) {
  await getStoreById(id)
  logger.info({ id, status }, 'Updating store status')
  return prisma.store.update({ where: { id }, data: { status: status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' } })
}
