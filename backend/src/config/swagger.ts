import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'SaaS E-commerce API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:4000/api' }],
  },
  apis: ['./src/modules/**/*.routes.ts'],
})
