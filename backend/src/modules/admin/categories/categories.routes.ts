import { Router } from 'express'
import { requireAuth, requireRole, requireStoreAccess } from '../../../middlewares/auth'
import { validate } from '../../../middlewares/validate'
import { asyncHandler } from '../../../lib/async-handler'
import { success } from '../../../lib/api-response'
import { createCategorySchema, updateCategorySchema } from './categories.schema'
import * as service from './categories.service'

export const categoriesRouter = Router({ mergeParams: true })

categoriesRouter.use(requireAuth, requireRole('STORE_ADMIN', 'SUPER_ADMIN'), requireStoreAccess)

/**
 * @swagger
 * /stores/{storeSlug}/admin/categories:
 *   get:
 *     tags: [Admin - Categories]
 *     summary: List categories for a store
 *     security:
 *       - bearerAuth: []
 */
categoriesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await service.getCategories(String(req.params.storeSlug))
    success(res, categories)
  }),
)

/**
 * @swagger
 * /stores/{storeSlug}/admin/categories:
 *   post:
 *     tags: [Admin - Categories]
 *     summary: Create a category
 *     security:
 *       - bearerAuth: []
 */
categoriesRouter.post(
  '/',
  validate(createCategorySchema),
  asyncHandler(async (req, res) => {
    const category = await service.createCategory(String(req.params.storeSlug), req.body.title)
    success(res, category, 'Category created', 201)
  }),
)

/**
 * @swagger
 * /stores/{storeSlug}/admin/categories/{id}:
 *   patch:
 *     tags: [Admin - Categories]
 *     summary: Update a category
 *     security:
 *       - bearerAuth: []
 */
categoriesRouter.patch(
  '/:id',
  validate(updateCategorySchema),
  asyncHandler(async (req, res) => {
    const category = await service.updateCategory(String(req.params.storeSlug), String(req.params.id), req.body)
    success(res, category, 'Category updated')
  }),
)

/**
 * @swagger
 * /stores/{storeSlug}/admin/categories/{id}:
 *   delete:
 *     tags: [Admin - Categories]
 *     summary: Delete a category
 *     security:
 *       - bearerAuth: []
 */
categoriesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await service.deleteCategory(String(req.params.storeSlug), String(req.params.id))
    success(res, null, 'Category deleted')
  }),
)
