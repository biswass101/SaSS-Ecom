import { Router } from 'express'
import { requireAuth, requireRole } from '../../../middlewares/auth'
import { validate } from '../../../middlewares/validate'
import { asyncHandler } from '../../../lib/async-handler'
import { success } from '../../../lib/api-response'
import { updateSubscriptionSchema, verifyPaymentSchema } from './subscriptions.schema'
import * as service from './subscriptions.service'

export const subscriptionsRouter = Router()

subscriptionsRouter.use(requireAuth, requireRole('SUPER_ADMIN'))

/**
 * @swagger
 * /management/subscriptions:
 *   get:
 *     tags: [Management - Subscriptions]
 *     summary: List all subscriptions
 *     security:
 *       - bearerAuth: []
 */
subscriptionsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const subs = await service.getAllSubscriptions()
    success(res, subs)
  }),
)

/**
 * @swagger
 * /management/subscriptions/{id}:
 *   get:
 *     tags: [Management - Subscriptions]
 *     summary: Get subscription details
 *     security:
 *       - bearerAuth: []
 */
subscriptionsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const sub = await service.getSubscriptionById(String(req.params.id))
    success(res, sub)
  }),
)

/**
 * @swagger
 * /management/subscriptions/{id}:
 *   patch:
 *     tags: [Management - Subscriptions]
 *     summary: Update subscription status
 *     security:
 *       - bearerAuth: []
 */
subscriptionsRouter.patch(
  '/:id',
  validate(updateSubscriptionSchema),
  asyncHandler(async (req, res) => {
    const sub = await service.updateSubscription(String(req.params.id), req.body)
    success(res, sub, 'Subscription updated')
  }),
)

/**
 * @swagger
 * /management/subscriptions/payments/{paymentId}/verify:
 *   post:
 *     tags: [Management - Subscriptions]
 *     summary: Verify or reject a payment
 *     security:
 *       - bearerAuth: []
 */
subscriptionsRouter.post(
  '/payments/:paymentId/verify',
  validate(verifyPaymentSchema),
  asyncHandler(async (req, res) => {
    const action = req.body.action as 'VERIFIED' | 'REJECTED'
    const payment = await service.verifyPayment(String(req.params.paymentId), action)
    success(res, payment, `Payment ${action.toLowerCase()}`)
  }),
)
