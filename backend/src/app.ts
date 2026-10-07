import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import path from 'path'
import pinoHttp from 'pino-http'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env'
import { passport } from './config/passport'
import { swaggerSpec } from './config/swagger'
import { errorHandler } from './middlewares/error-handler'
import { logger } from './lib/logger'

import { healthRouter } from './modules/health/health.routes'
import { authRouter } from './modules/auth/auth.routes'

import { packagesRouter } from './modules/management/packages/packages.routes'
import { subscriptionsRouter } from './modules/management/subscriptions/subscriptions.routes'
import { storesRouter } from './modules/management/stores/stores.routes'
import { paymentChannelsRouter } from './modules/management/payment-channels/payment-channels.routes'

import { categoriesRouter } from './modules/admin/categories/categories.routes'
import { productsRouter } from './modules/admin/products/products.routes'
import { ordersRouter } from './modules/admin/orders/orders.routes'
import { reportsRouter } from './modules/admin/reports/reports.routes'

import { storefrontStoreRouter } from './modules/storefront/store/store.routes'
import { storefrontProductsRouter } from './modules/storefront/products/products.routes'
import { checkoutRouter, publicRouter } from './modules/storefront/checkout/checkout.routes'

export const app = express()

app.use(helmet())
const configuredOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
const devOrigins = env.NODE_ENV === 'production' ? [] : [
	'http://localhost:5173',
	'http://localhost:5174',
	'http://localhost:5175',
	'http://127.0.0.1:5173',
	'http://127.0.0.1:5174',
	'http://127.0.0.1:5175',
]
const allowedOrigins = new Set([...configuredOrigins, ...devOrigins])

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.has(origin)) {
			callback(null, true)
			return
		}
		callback(new Error('CORS origin is not allowed'))
	},
}))
app.use(express.json())
app.use(pinoHttp({ logger }))
app.use(passport.initialize())

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)

app.use('/api/management/packages', packagesRouter)
app.use('/api/management/subscriptions', subscriptionsRouter)
app.use('/api/management/stores', storesRouter)
app.use('/api/management/payment-channels', paymentChannelsRouter)

app.use('/api/stores/:storeSlug/admin/categories', categoriesRouter)
app.use('/api/stores/:storeSlug/admin/products', productsRouter)
app.use('/api/stores/:storeSlug/admin/orders', ordersRouter)
app.use('/api/stores/:storeSlug/admin/reports', reportsRouter)

app.use('/api/storefront/:storeSlug', storefrontStoreRouter)
app.use('/api/storefront/:storeSlug/products', storefrontProductsRouter)
app.use('/api/storefront/:storeSlug/checkout', checkoutRouter)
app.use('/api/public', publicRouter)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorHandler)
