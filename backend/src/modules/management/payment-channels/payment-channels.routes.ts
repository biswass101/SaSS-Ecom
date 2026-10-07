import { Router } from 'express'
import { requireAuth, requireRole } from '../../../middlewares/auth'
import { validate } from '../../../middlewares/validate'
import { asyncHandler } from '../../../lib/async-handler'
import { success } from '../../../lib/api-response'
import { createPaymentChannelSchema, updatePaymentChannelSchema } from './payment-channels.schema'
import * as service from './payment-channels.service'

export const paymentChannelsRouter = Router()

paymentChannelsRouter.use(requireAuth, requireRole('SUPER_ADMIN'))

/**
 * @swagger
 * /management/payment-channels:
 *   get:
 *     tags: [Management - Payment Channels]
 *     summary: List all payment channels
 *     security:
 *       - bearerAuth: []
 */
paymentChannelsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const channels = await service.getAllPaymentChannels()
    success(res, channels)
  }),
)

/**
 * @swagger
 * /management/payment-channels:
 *   post:
 *     tags: [Management - Payment Channels]
 *     summary: Create a payment channel
 *     security:
 *       - bearerAuth: []
 */
paymentChannelsRouter.post(
  '/',
  validate(createPaymentChannelSchema),
  asyncHandler(async (req, res) => {
    const channel = await service.createPaymentChannel(req.body)
    success(res, channel, 'Payment channel created', 201)
  }),
)

/**
 * @swagger
 * /management/payment-channels/{id}:
 *   patch:
 *     tags: [Management - Payment Channels]
 *     summary: Update a payment channel
 *     security:
 *       - bearerAuth: []
 */
paymentChannelsRouter.patch(
  '/:id',
  validate(updatePaymentChannelSchema),
  asyncHandler(async (req, res) => {
    const channel = await service.updatePaymentChannel(String(req.params.id), req.body)
    success(res, channel, 'Payment channel updated')
  }),
)

/**
 * @swagger
 * /management/payment-channels/{id}:
 *   delete:
 *     tags: [Management - Payment Channels]
 *     summary: Delete a payment channel
 *     security:
 *       - bearerAuth: []
 */
paymentChannelsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await service.deletePaymentChannel(String(req.params.id))
    success(res, null, 'Payment channel deleted')
  }),
)
