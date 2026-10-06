import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env'
import { passport } from './config/passport'
import { swaggerSpec } from './config/swagger'
import { errorHandler } from './middlewares/error-handler'
import { authRouter } from './modules/auth/auth.routes'
import { healthRouter } from './modules/health/health.routes'
import { logger } from './lib/logger'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN }))
app.use(express.json())
app.use(pinoHttp({ logger }))
app.use(passport.initialize())

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(errorHandler)
