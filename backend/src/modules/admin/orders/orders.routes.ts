import { Router } from 'express'
import { requireAuth, requireRole, requireStoreAccess } from '../../../middlewares/auth'
import { validate } from '../../../middlewares/validate'
import { asyncHandler } from '../../../lib/async-handler'
import { success, paginated } from '../../../lib/api-response'
import { updateOrderStatusSchema, updateOrderPaymentStatusSchema } from './orders.schema'
import * as service from './orders.service'

export const ordersRouter = Router({ mergeParams: true })

ordersRouter.use(requireAuth, requireRole('STORE_ADMIN', 'SUPER_ADMIN'), requireStoreAccess)

/**
 * @swagger
 * /stores/{storeSlug}/admin/orders:
 *   get:
 *     tags: [Admin - Orders]
 *     summary: List orders for a store
 *     security:
 *       - bearerAuth: []
 */
ordersRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status, search, page, limit } = req.query as Record<string, string>
    const result = await service.getOrders(String(req.params.storeSlug), {
      status,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    })
    paginated(res, result.orders, { page: result.page, limit: result.limit, total: result.total })
  }),
)

/**
 * @swagger
 * /stores/{storeSlug}/admin/orders/{id}:
 *   get:
 *     tags: [Admin - Orders]
 *     summary: Get order details with items
 *     security:
 *       - bearerAuth: []
 */
ordersRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const order = await service.getOrderById(String(req.params.storeSlug), String(req.params.id))
    success(res, order)
  }),
)

/**
 * @swagger
 * /stores/{storeSlug}/admin/orders/{id}/status:
 *   patch:
 *     tags: [Admin - Orders]
 *     summary: Update order status
 *     security:
 *       - bearerAuth: []
 */
ordersRouter.patch(
  '/:id/status',
  validate(updateOrderStatusSchema),
  asyncHandler(async (req, res) => {
    const order = await service.updateOrderStatus(String(req.params.storeSlug), String(req.params.id), req.body.status)
    success(res, order, 'Order status updated')
  }),
)

/**
 * @swagger
 * /stores/{storeSlug}/admin/orders/{id}/payment-status:
 *   patch:
 *     tags: [Admin - Orders]
 *     summary: Update order payment status
 *     security:
 *       - bearerAuth: []
 */
ordersRouter.patch(
  '/:id/payment-status',
  validate(updateOrderPaymentStatusSchema),
  asyncHandler(async (req, res) => {
    const order = await service.updateOrderPaymentStatus(String(req.params.storeSlug), String(req.params.id), req.body.paymentStatus)
    success(res, order, 'Payment status updated')
  }),
)
