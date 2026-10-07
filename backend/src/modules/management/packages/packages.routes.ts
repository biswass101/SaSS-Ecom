import { Router } from 'express'
import { requireAuth } from '../../../middlewares/auth'
import { requireRole } from '../../../middlewares/auth'
import { validate } from '../../../middlewares/validate'
import { asyncHandler } from '../../../lib/async-handler'
import { success } from '../../../lib/api-response'
import { createPackageSchema, updatePackageSchema } from './packages.schema'
import * as service from './packages.service'

export const packagesRouter = Router()

packagesRouter.use(requireAuth, requireRole('SUPER_ADMIN'))

/**
 * @swagger
 * /management/packages:
 *   get:
 *     tags: [Management - Packages]
 *     summary: List all packages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of packages
 */
packagesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const packages = await service.getAllPackages()
    success(res, packages)
  }),
)

/**
 * @swagger
 * /management/packages/{id}:
 *   get:
 *     tags: [Management - Packages]
 *     summary: Get package by ID
 *     security:
 *       - bearerAuth: []
 */
packagesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const pkg = await service.getPackageById(String(req.params.id))
    success(res, pkg)
  }),
)

/**
 * @swagger
 * /management/packages:
 *   post:
 *     tags: [Management - Packages]
 *     summary: Create a new package
 *     security:
 *       - bearerAuth: []
 */
packagesRouter.post(
  '/',
  validate(createPackageSchema),
  asyncHandler(async (req, res) => {
    const pkg = await service.createPackage(req.body)
    success(res, pkg, 'Package created', 201)
  }),
)

/**
 * @swagger
 * /management/packages/{id}:
 *   patch:
 *     tags: [Management - Packages]
 *     summary: Update a package
 *     security:
 *       - bearerAuth: []
 */
packagesRouter.patch(
  '/:id',
  validate(updatePackageSchema),
  asyncHandler(async (req, res) => {
    const pkg = await service.updatePackage(String(req.params.id), req.body)
    success(res, pkg, 'Package updated')
  }),
)

/**
 * @swagger
 * /management/packages/{id}:
 *   delete:
 *     tags: [Management - Packages]
 *     summary: Delete a package
 *     security:
 *       - bearerAuth: []
 */
packagesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await service.deletePackage(String(req.params.id))
    success(res, null, 'Package deleted')
  }),
)
