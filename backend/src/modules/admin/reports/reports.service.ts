import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

async function resolveStoreId(storeSlug: string): Promise<string> {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } })
  if (!store) throw new AppError(404, 'Store not found')
  return store.id
}

export async function getSalesReport(storeSlug: string, period?: string) {
  const storeId = await resolveStoreId(storeSlug)
  logger.info({ storeSlug, period }, 'Generating sales report')

  const now = new Date()
  const year = period ? parseInt(period.split('-')[0]) : now.getFullYear()
  const month = period ? parseInt(period.split('-')[1]) - 1 : now.getMonth()
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0, 23, 59, 59)

  const orders = await prisma.order.findMany({
    where: {
      storeId,
      createdAt: { gte: startDate, lte: endDate },
      status: { not: 'CANCELLED' },
    },
    include: { items: true },
  })

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const productMap = new Map<string, { productId: string; title: string; quantity: number; revenue: number }>()
  for (const order of orders) {
    for (const item of order.items) {
      const existing = productMap.get(item.productId) ?? { productId: item.productId, title: item.productTitle, quantity: 0, revenue: 0 }
      existing.quantity += item.quantity
      existing.revenue += item.total
      productMap.set(item.productId, existing)
    }
  }
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const dailyMap = new Map<string, { date: string; revenue: number; orders: number }>()
  for (const order of orders) {
    const dateKey = order.createdAt.toISOString().slice(0, 10)
    const existing = dailyMap.get(dateKey) ?? { date: dateKey, revenue: 0, orders: 0 }
    existing.revenue += order.total
    existing.orders += 1
    dailyMap.set(dateKey, existing)
  }
  const dailyRevenue = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date))

  const periodStr = `${year}-${String(month + 1).padStart(2, '0')}`

  return {
    period: periodStr,
    totalOrders,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    topProducts,
    dailyRevenue,
  }
}
