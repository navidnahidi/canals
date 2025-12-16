import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';

const app = new Koa();
const router = new Router();

// Enable CORS for React app on localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Dummy endpoint
router.get('/api/health', async (ctx) => {
  ctx.body = {
    status: 'ok',
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  };
});

// Another dummy endpoint
router.get('/api/dummy', async (ctx) => {
  ctx.body = {
    message: 'This is a dummy endpoint',
    data: {
      id: 1,
      name: 'Dummy Data',
      items: ['item1', 'item2', 'item3']
    }
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📡 Dummy endpoint: http://localhost:${PORT}/api/dummy`);
});

