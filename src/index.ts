import 'reflect-metadata';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import ordersRouter from './routes/orders';
import { AppDataSource } from './config/database';

const app = new Koa();
const router = new Router();

// Enable CORS for React app on localhost:3000
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Body parser middleware for JSON requests
app.use(bodyParser());

// Health check endpoint
router.get('/api/health', async (ctx) => {
  ctx.body = {
    status: 'ok',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  };
});

// Another dummy endpoint
router.get('/api/dummy', async (ctx) => {
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

const PORT = process.env.PORT || 3001;

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📡 Dummy endpoint: http://localhost:${PORT}/api/dummy`);
    });
  })
  .catch((error: Error) => {
    console.error('❌ Error connecting to database:', error);
    process.exit(1);
  });
