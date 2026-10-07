import { Router } from 'express'
import { asyncHandler } from '../../../lib/async-handler'
import { success, paginated } from '../../../lib/api-response'
import * as service from './products.service'

export const storefrontProductsRouter = Router({ mergeParams: true })

/**
 * @swagger
 * /storefront/{storeSlug}/products:
 *   get:
 *     tags: [Storefront]
 *     summary: List active products for a store (public)
 */
storefrontProductsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { categoryId, search, page, limit } = req.query as Record<string, string>
    const result = await service.getPublicProducts(String(req.params.storeSlug), {
      categoryId,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    })
    paginated(res, result.products, { page: result.page, limit: result.limit, total: result.total })
  }),
)

/**
 * @swagger
 * /storefront/{storeSlug}/products/{id}:
 *   get:
 *     tags: [Storefront]
 *     summary: Get a single product (public)
 */
storefrontProductsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await service.getPublicProductById(String(req.params.storeSlug), String(req.params.id))
    success(res, product)
  }),
)
