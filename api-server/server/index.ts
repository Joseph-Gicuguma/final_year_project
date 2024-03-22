import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from '../lib/logger.js';
import router from '../routes/index.js';
import errorMiddleware from '../middleware/error.js';
import { DIR_UPLOADS_NAME } from '../consts/default.js';
import Admin from '../services/admin.js';
import swaggerOptions from '../swagger.js';
import swagger from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { stripeWebhook } from '../controllers/payment.js';
import boundary from '../utils/error-boundary.js';

const initializeApp = () => {
  const app: Express = express();

  app.post('/webhook', express.raw({ type: 'application/json' }), boundary(stripeWebhook));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    cors({
      origin: [process.env.CLIENT_URL, process.env.ADMIN_URL] as string[],
      credentials: true,
      methods: 'GET, POST, PUT, PATCH, DELETE',
      allowedHeaders: 'Content-Type, Authorization, Set-Cookie',
      exposedHeaders: 'X-Total-Count',
    }),
  );

  app.use(router);

  app.use(errorMiddleware);

  app.use(express.static(DIR_UPLOADS_NAME));

  const apiSpec = swaggerJSDoc(swaggerOptions);
  app.use('/docs', swagger.serve, swagger.setup(apiSpec));

  Admin.createIfNotExists().catch((e) => logger.error(e));

  app
  .listen(process.env.SERVER_PORT, () => {
    logger.info(`The server is running on port ${process.env.SERVER_PORT}`);
  })
  .on('error', (err) => logger.error(err.message));
};

export default initializeApp;
