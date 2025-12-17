import 'reflect-metadata';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import ordersRouter from './routes/orders';
import { AppDataSource } from './config/database';
import { config, validateEnv } from './config/env';

// Validate environment variables
validateEnv();

const app = new Koa();
const router = new Router();

// Enable CORS
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Body parser middleware for JSON requests
app.use(bodyParser());

// Health check endpoint
router.get(`${config.apiPrefix}/health`, async (ctx) => {
  ctx.body = {
    status: 'ok',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  };
});

// Another dummy endpoint
router.get(`${config.apiPrefix}/dummy`, async (ctx) => {
  ctx.body = {
    message: 'This is a dummy endpoint',
    data: {
      id: 1,
      name: 'Dummy Data',
      items: ['item1', 'item2', 'item3'],
    },
  };
});

// Mount routes
app.use(router.routes());
app.use(router.allowedMethods());
app.use(ordersRouter.routes());
app.use(ordersRouter.allowedMethods());

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully');

    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📡 Health check: http://localhost:${config.port}${config.apiPrefix}/health`);
      console.log(`📡 Dummy endpoint: http://localhost:${config.port}${config.apiPrefix}/dummy`);
    });
  })
  .catch((error: Error) => {
    console.error('❌ Error connecting to database:', error);
    process.exit(1);
  });
