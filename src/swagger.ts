import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
import { Application } from 'express'; 

dotenv.config()

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My Express API',
    version: '1.0.0',
    description: 'API documentation for the Express backend',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`, // Change this to your actual server URL
      description: 'Local Server',
    },
  ],
}

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Scan route files in the "routes" folder for Swagger comments
}

const swaggerSpec = swaggerJSDoc(options)

const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

export default setupSwagger