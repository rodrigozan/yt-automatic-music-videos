import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'YT Automatic Music Videos API',
      version: '1.0.0',
      description: 'An API to YT Automatic Music Videos Project',
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      }
    },

  },
  apis: ['./src/router.ts', './src/routeS/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  app.use('/api-docs', ...(swaggerUi.serve as any), swaggerUi.setup(specs) as any);
};