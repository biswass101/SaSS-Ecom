import { Router } from 'express'
import { requireAuth, requireRole } from '../../../middlewares/auth'
import { validate } from '../../../middlewares/validate'
import { asyncHandler } from '../../../lib/async-handler'
import { success } from '../../../lib/api-response'
import { createStoreSchema, updateStoreStatusSchema } from './stores.schema'
import * as service from './stores.service'

export const storesRouter = Router()

/**
 * @swagger
 * /management/stores:
 *   get:
 *     tags: [Management - Stores]
 *     summary: List all stores
 *     security:
 *       - bearerAuth: []
 */
storesRouter.get(
  '/',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  asyncHandler(async (_req, res) => {
    const stores = await service.getAllStores()
    success(res, stores)
  }),
)

/**
 * @swagger
 * /management/stores:
 *   post:
 *     tags: [Management - Stores]
 *     summary: Create a new store (also creates owner user & subscription)
 */
storesRouter.post(
  '/',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  validate(createStoreSchema),
  asyncHandler(async (req, res) => {
    const result = await service.createStore(req.body)
    success(res, result, 'Store created successfully', 201)
  }),
)

/**
 * @swagger
 * /management/stores/{id}:
 *   get:
 *     tags: [Management - Stores]
 *     summary: Get store details
 *     security:
 *       - bearerAuth: []
 */
storesRouter.get(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const store = await service.getStoreById(String(req.params.id))
    success(res, store)
  }),
)

/**
 * @swagger
 * /management/stores/{id}/status:
 *   patch:
 *     tags: [Management - Stores]
 *     summary: Update store status (ACTIVE/INACTIVE/SUSPENDED)
 *     security:
 *       - bearerAuth: []
 */
storesRouter.patch(
  '/:id/status',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  validate(updateStoreStatusSchema),
  asyncHandler(async (req, res) => {
    const store = await service.updateStoreStatus(String(req.params.id), req.body.status)
    success(res, store, 'Store status updated')
  }),
)
