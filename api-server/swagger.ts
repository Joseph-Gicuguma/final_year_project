export default {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'TheReservo API',
      description: 'Documentation of theReservo API',
    },
    servers: [{ url: 'http://localhost:7700' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./docs/**/*.yaml'],
};
