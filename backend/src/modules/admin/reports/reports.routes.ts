import { Router } from 'express'
import { requireAuth, requireRole, requireStoreAccess } from '../../../middlewares/auth'
import { asyncHandler } from '../../../lib/async-handler'
import { success } from '../../../lib/api-response'
import * as service from './reports.service'

export const reportsRouter = Router({ mergeParams: true })

reportsRouter.use(requireAuth, requireRole('STORE_ADMIN', 'SUPER_ADMIN'), requireStoreAccess)

/**
 * @swagger
 * /stores/{storeSlug}/admin/reports/sales:
 *   get:
 *     tags: [Admin - Reports]
 *     summary: Get sales report for a store
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *         description: "YYYY-MM format (defaults to current month)"
 */
reportsRouter.get(
  '/sales',
  asyncHandler(async (req, res) => {
    const report = await service.getSalesReport(
      String(req.params.storeSlug),
      req.query.period as string | undefined,
    )
    success(res, report)
  }),
)
