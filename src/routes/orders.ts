import Router from '@koa/router';
import { createOrder } from '../controllers/orderController';

const router = new Router();

router.post('/api/orders', createOrder);

export default router;
