import { Router } from 'express'
import { requireAuth, requireRole, requireStoreAccess } from '../../../middlewares/auth'
import { validate } from '../../../middlewares/validate'
import { asyncHandler } from '../../../lib/async-handler'
import { success, paginated } from '../../../lib/api-response'
import { createProductSchema, updateProductSchema } from './products.schema'
import * as service from './products.service'

export const productsRouter = Router({ mergeParams: true })

productsRouter.use(requireAuth, requireRole('STORE_ADMIN', 'SUPER_ADMIN'), requireStoreAccess)

/**
 * @swagger
 * /stores/{storeSlug}/admin/products:
 *   get:
 *     tags: [Admin - Products]
 *     summary: List products for a store
 *     security:
 *       - bearerAuth: []
 */
productsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search, categoryId, page, limit } = req.query as Record<string, string>
    const result = await service.getProducts(String(req.params.storeSlug), {
      search,
      categoryId,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    })
    paginated(res, result.products, { page: result.page, limit: result.limit, total: result.total })
  }),
)

/**
 * @swagger
 * /stores/{storeSlug}/admin/products/{id}:
 *   get:
 *     tags: [Admin - Products]
 *     summary: Get product details
 *     security:
 *       - bearerAuth: []
 */
productsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await service.getProductById(String(req.params.storeSlug), String(req.params.id))
    success(res, product)
  }),
)

/**
 * @swagger
 * /stores/{storeSlug}/admin/products:
 *   post:
 *     tags: [Admin - Products]
 *     summary: Create a product
 *     security:
 *       - bearerAuth: []
 */
productsRouter.post(
  '/',
  validate(createProductSchema),
  asyncHandler(async (req, res) => {
    const product = await service.createProduct(String(req.params.storeSlug), req.body)
    success(res, product, 'Product created', 201)
  }),
)

/**
 * @swagger
 * /stores/{storeSlug}/admin/products/{id}:
 *   patch:
 *     tags: [Admin - Products]
 *     summary: Update a product
 *     security:
 *       - bearerAuth: []
 */
productsRouter.patch(
  '/:id',
  validate(updateProductSchema),
  asyncHandler(async (req, res) => {
    const product = await service.updateProduct(String(req.params.storeSlug), String(req.params.id), req.body)
    success(res, product, 'Product updated')
  }),
)

/**
 * @swagger
 * /stores/{storeSlug}/admin/products/{id}:
 *   delete:
 *     tags: [Admin - Products]
 *     summary: Delete a product
 *     security:
 *       - bearerAuth: []
 */
productsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await service.deleteProduct(String(req.params.storeSlug), String(req.params.id))
    success(res, null, 'Product deleted')
  }),
)
