import { Router } from 'express'
import { validate } from '../../../middlewares/validate'
import { asyncHandler } from '../../../lib/async-handler'
import { success } from '../../../lib/api-response'
import { checkoutSchema, submitPaymentSchema } from './checkout.schema'
import * as service from './checkout.service'

export const checkoutRouter = Router({ mergeParams: true })

/**
 * @swagger
 * /storefront/{storeSlug}/checkout:
 *   post:
 *     tags: [Storefront - Checkout]
 *     summary: Place an order (public)
 */
checkoutRouter.post(
  '/',
  validate(checkoutSchema),
  asyncHandler(async (req, res) => {
    const order = await service.placeOrder(String(req.params.storeSlug), req.body)
    success(res, order, 'Order placed successfully', 201)
  }),
)

/**
 * @swagger
 * /public/payment-channels:
 *   get:
 *     tags: [Public]
 *     summary: Get active payment channels (public)
 */

/**
 * @swagger
 * /public/packages:
 *   get:
 *     tags: [Public]
 *     summary: Get active packages (public)
 */

/**
 * @swagger
 * /public/payments:
 *   post:
 *     tags: [Public]
 *     summary: Submit a manual payment for verification
 */
export const publicRouter = Router()

publicRouter.get(
  '/payment-channels',
  asyncHandler(async (_req, res) => {
    const channels = await service.getPaymentChannels()
    success(res, channels)
  }),
)

publicRouter.get(
  '/packages',
  asyncHandler(async (_req, res) => {
    const packages = await service.getPackages()
    success(res, packages)
  }),
)

publicRouter.post(
  '/payments',
  validate(submitPaymentSchema),
  asyncHandler(async (req, res) => {
    const payment = await service.submitPayment(req.body)
    success(res, payment, 'Payment submitted for verification', 201)
  }),
)
