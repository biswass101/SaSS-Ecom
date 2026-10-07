import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

export async function getAllPackages() {
  logger.info('Fetching all packages')
  return prisma.package.findMany({ orderBy: { price: 'asc' } })
}

export async function getPackageById(id: string) {
  const pkg = await prisma.package.findUnique({ where: { id } })
  if (!pkg) throw new AppError(404, 'Package not found')
  return pkg
}

export async function createPackage(data: {
  name: string
  description: string
  price: number
  billingCycle: string
  maxProducts: number
  maxOrders: number
  features: string[]
  isActive: boolean
}) {
  logger.info({ name: data.name }, 'Creating package')
  return prisma.package.create({ data })
}

export async function updatePackage(id: string, data: Record<string, unknown>) {
  await getPackageById(id)
  logger.info({ id }, 'Updating package')
  return prisma.package.update({ where: { id }, data })
}

export async function deletePackage(id: string) {
  await getPackageById(id)
  const activeSubscriptions = await prisma.subscription.count({ where: { packageId: id } })
  if (activeSubscriptions > 0) throw new AppError(400, 'Cannot delete package with existing subscriptions')
  logger.info({ id }, 'Deleting package')
  return prisma.package.delete({ where: { id } })
}
