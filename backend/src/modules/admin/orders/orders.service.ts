import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

async function resolveStoreId(storeSlug: string): Promise<string> {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } })
  if (!store) throw new AppError(404, 'Store not found')
  return store.id
}

export async function getOrders(storeSlug: string, params: { status?: string; search?: string; page?: number; limit?: number }) {
  const storeId = await resolveStoreId(storeSlug)
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { storeId }
  if (params.status) {
    where.status = params.status
  }
  if (params.search) {
    where.OR = [
      { orderNumber: { contains: params.search } },
      { customerName: { contains: params.search } },
      { customerEmail: { contains: params.search } },
    ]
  }

  logger.info({ storeSlug, page, limit }, 'Fetching orders')

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  return { orders, total, page, limit }
}

export async function getOrderById(storeSlug: string, id: string) {
  const storeId = await resolveStoreId(storeSlug)
  const order = await prisma.order.findUnique({
    where: { id, storeId },
    include: { items: true },
  })
  if (!order) throw new AppError(404, 'Order not found')
  return order
}

export async function updateOrderStatus(storeSlug: string, id: string, status: string) {
  const storeId = await resolveStoreId(storeSlug)
  const order = await prisma.order.findUnique({ where: { id, storeId } })
  if (!order) throw new AppError(404, 'Order not found')
  logger.info({ id, status }, 'Updating order status')
  return prisma.order.update({
    where: { id },
    data: { status: status as 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' },
    include: { items: true },
  })
}

export async function updateOrderPaymentStatus(storeSlug: string, id: string, paymentStatus: string) {
  const storeId = await resolveStoreId(storeSlug)
  const order = await prisma.order.findUnique({ where: { id, storeId } })
  if (!order) throw new AppError(404, 'Order not found')
  logger.info({ id, paymentStatus }, 'Updating order payment status')
  return prisma.order.update({
    where: { id },
    data: { paymentStatus: paymentStatus as 'PENDING' | 'COMPLETED' | 'FAILED' },
    include: { items: true },
  })
}
