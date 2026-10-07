import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

export async function getPublicProducts(storeSlug: string, params: { categoryId?: string; search?: string; page?: number; limit?: number }) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } })
  if (!store) throw new AppError(404, 'Store not found')

  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { storeId: store.id, isActive: true }
  if (params.categoryId) where.categoryId = params.categoryId
  if (params.search) where.title = { contains: params.search }

  logger.info({ storeSlug, page, limit }, 'Fetching public products')

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return { products, total, page, limit }
}

export async function getPublicProductById(storeSlug: string, id: string) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } })
  if (!store) throw new AppError(404, 'Store not found')
  const product = await prisma.product.findUnique({
    where: { id, storeId: store.id },
    include: { category: true },
  })
  if (!product) throw new AppError(404, 'Product not found')
  if (!product.isActive) throw new AppError(404, 'Product not found')
  return product
}
