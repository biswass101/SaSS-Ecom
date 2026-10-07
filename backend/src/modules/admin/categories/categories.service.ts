import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

async function resolveStoreId(storeSlug: string): Promise<string> {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } })
  if (!store) throw new AppError(404, 'Store not found')
  return store.id
}

export async function getCategories(storeSlug: string) {
  const storeId = await resolveStoreId(storeSlug)
  logger.info({ storeSlug }, 'Fetching categories')
  const categories = await prisma.category.findMany({
    where: { storeId },
    include: { _count: { select: { products: true } } },
    orderBy: { title: 'asc' },
  })
  return categories.map((c) => ({
    ...c,
    productCount: c._count.products,
    _count: undefined,
  }))
}

export async function createCategory(storeSlug: string, title: string) {
  const storeId = await resolveStoreId(storeSlug)
  logger.info({ storeSlug, title }, 'Creating category')
  return prisma.category.create({ data: { storeId, title } })
}

export async function updateCategory(storeSlug: string, id: string, data: { title?: string }) {
  const storeId = await resolveStoreId(storeSlug)
  const cat = await prisma.category.findUnique({ where: { id, storeId } })
  if (!cat) throw new AppError(404, 'Category not found')
  logger.info({ id }, 'Updating category')
  return prisma.category.update({ where: { id }, data })
}

export async function deleteCategory(storeSlug: string, id: string) {
  const storeId = await resolveStoreId(storeSlug)
  const cat = await prisma.category.findUnique({ where: { id, storeId }, include: { _count: { select: { products: true } } } })
  if (!cat) throw new AppError(404, 'Category not found')
  if (cat._count.products > 0) throw new AppError(400, 'Cannot delete category with products')
  logger.info({ id }, 'Deleting category')
  return prisma.category.delete({ where: { id } })
}
