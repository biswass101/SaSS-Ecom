import { Router } from 'express'
import { asyncHandler } from '../../../lib/async-handler'
import { success } from '../../../lib/api-response'
import * as service from './store.service'

export const storefrontStoreRouter = Router({ mergeParams: true })

/**
 * @swagger
 * /storefront/{storeSlug}:
 *   get:
 *     tags: [Storefront]
 *     summary: Get store info by slug (public)
 */
storefrontStoreRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const store = await service.getStoreBySlug(String(req.params.storeSlug))
    success(res, store)
  }),
)

/**
 * @swagger
 * /storefront/{storeSlug}/categories:
 *   get:
 *     tags: [Storefront]
 *     summary: Get store categories (public)
 */
storefrontStoreRouter.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const categories = await service.getStoreCategories(String(req.params.storeSlug))
    success(res, categories)
  }),
)

/**
 * @swagger
 * /storefront/{storeSlug}/subscription-status:
 *   get:
 *     tags: [Storefront]
 *     summary: Get subscription and payment status for store
 */
storefrontStoreRouter.get(
  '/info',
  asyncHandler(async (req, res) => {
    const store = await service.getStoreInfo(String(req.params.storeSlug))
    success(res, store)
  }),
)

storefrontStoreRouter.get(
  '/subscription-status',
  asyncHandler(async (req, res) => {
    const status = await service.getSubscriptionStatus(String(req.params.storeSlug))
    success(res, status)
  }),
)
