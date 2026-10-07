import { Router } from 'express'
import { validate } from '../../middlewares/validate'
import { requireAuth } from '../../middlewares/auth'
import { loginLimiter, authLimiter } from '../../middlewares/rate-limit'
import { asyncHandler } from '../../lib/async-handler'
import { success } from '../../lib/api-response'
import { loginSchema, registerSchema, storeLoginSchema } from './auth.schema'
import { createStoreSchema } from '../management/stores/stores.schema'
import * as storeService from '../management/stores/stores.service'
import * as authService from './auth.service'
import type { JwtPayload } from '../../lib/jwt'

export const authRouter = Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
authRouter.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.loginUser(req.body.email, req.body.password)
    success(res, result, 'Login successful')
  }),
)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new store admin account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Registration successful
 */
authRouter.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.registerUser(req.body.name, req.body.email, req.body.password)
    success(res, result, 'Registration successful', 201)
  }),
)

/**
 * @swagger
 * /auth/store-login:
 *   post:
 *     tags: [Auth]
 *     summary: Login to a specific store as admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeSlug: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Store login successful
 */
authRouter.post(
  '/store-login',
  loginLimiter,
  validate(storeLoginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.storeLogin(req.body.storeSlug, req.body.email, req.body.password)
    success(res, result, 'Store login successful')
  }),
)

authRouter.post(
  '/create-store',
  authLimiter,
  validate(createStoreSchema),
  asyncHandler(async (req, res) => {
    const result = await storeService.createStore(req.body)
    success(res, result, 'Store created successfully', 201)
  }),
)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 */
authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = req.user as JwtPayload
    const result = await authService.getMe(user.sub)
    success(res, result)
  }),
)
