import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

async function resolveStoreId(storeSlug: string): Promise<string> {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } })
  if (!store) throw new AppError(404, 'Store not found')
  return store.id
}

export async function getProducts(storeSlug: string, params: { search?: string; categoryId?: string; page?: number; limit?: number }) {
  const storeId = await resolveStoreId(storeSlug)
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { storeId }
  if (params.search) {
    where.title = { contains: params.search }
  }
  if (params.categoryId) {
    where.categoryId = params.categoryId
  }

  logger.info({ storeSlug, page, limit }, 'Fetching products')

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

export async function getProductById(storeSlug: string, id: string) {
  const storeId = await resolveStoreId(storeSlug)
  const product = await prisma.product.findUnique({
    where: { id, storeId },
    include: { category: true },
  })
  if (!product) throw new AppError(404, 'Product not found')
  return product
}

export async function createProduct(storeSlug: string, data: {
  categoryId: string
  title: string
  description: string
  price: number
  images: string[]
  isActive: boolean
  stock: number
}) {
  const storeId = await resolveStoreId(storeSlug)
  logger.info({ storeSlug, title: data.title }, 'Creating product')
  return prisma.product.create({
    data: { ...data, storeId },
    include: { category: { select: { id: true, title: true } } },
  })
}

export async function updateProduct(storeSlug: string, id: string, data: Record<string, unknown>) {
  const storeId = await resolveStoreId(storeSlug)
  const product = await prisma.product.findUnique({ where: { id, storeId } })
  if (!product) throw new AppError(404, 'Product not found')
  logger.info({ id }, 'Updating product')
  return prisma.product.update({
    where: { id },
    data,
    include: { category: { select: { id: true, title: true } } },
  })
}

export async function deleteProduct(storeSlug: string, id: string) {
  const storeId = await resolveStoreId(storeSlug)
  const product = await prisma.product.findUnique({ where: { id, storeId } })
  if (!product) throw new AppError(404, 'Product not found')
  const orderItems = await prisma.orderItem.count({ where: { productId: id } })
  if (orderItems > 0) {
    logger.info({ id }, 'Deactivating product with existing orders')
    return prisma.product.update({ where: { id }, data: { isActive: false } })
  }
  logger.info({ id }, 'Deleting product')
  return prisma.product.delete({ where: { id } })
}
