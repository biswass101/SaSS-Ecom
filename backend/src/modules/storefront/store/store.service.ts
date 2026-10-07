import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

export async function getStoreBySlug(slug: string) {
  logger.info({ slug }, 'Fetching store by slug')
  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      owner: { select: { id: true, name: true } },
      subscription: { include: { package: { select: { name: true } } } },
    },
  })
  if (!store) throw new AppError(404, 'Store not found')
  if (store.status !== 'ACTIVE') throw new AppError(403, 'Store is not active')
  return store
}

export async function getStoreCategories(slug: string) {
  const store = await prisma.store.findUnique({ where: { slug } })
  if (!store) throw new AppError(404, 'Store not found')
  return prisma.category.findMany({
    where: { storeId: store.id },
    include: { _count: { select: { products: true } } },
    orderBy: { title: 'asc' },
  })
}

export async function getSubscriptionStatus(slug: string) {
  logger.info({ slug }, 'Fetching subscription status for store')
  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      subscription: {
        include: {
          payments: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      },
    },
  })
  if (!store) throw new AppError(404, 'Store not found')

  const subscription = store.subscription
  const latestPayment = subscription?.payments?.[0]

  return {
    storeId: store.id,
    storeStatus: store.status,
    subscriptionId: subscription?.id,
    paymentStatus: latestPayment?.status ?? 'N/A',
    isPaid: latestPayment?.status === 'VERIFIED',
  }
}
