import { Context } from 'koa';
import { CreateOrderRequest, Order } from '../types/order';

export const createOrder = async (ctx: Context): Promise<void> => {
  try {
    const orderData: CreateOrderRequest = ctx.request.body as CreateOrderRequest;

    // Validate required fields
    if (
      !orderData.customer ||
      !orderData.shippingAddress ||
      !orderData.items ||
      !orderData.creditCardNumber
    ) {
      ctx.status = 400;
      ctx.body = {
        error: 'Missing required fields',
        message: 'Order must include customer, shippingAddress, items, and creditCardNumber',
      };
      return;
    }

    // Validate items array
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      ctx.status = 400;
      ctx.body = {
        error: 'Invalid items',
        message: 'Order must include at least one item',
      };
      return;
    }

    // Validate each item
    for (const item of orderData.items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        ctx.status = 400;
        ctx.body = {
          error: 'Invalid item',
          message: 'Each item must have a productId and a quantity greater than 0',
        };
        return;
      }
    }

    // TODO: Implement order creation logic:
    // 1. Geocode shipping address to get lat/long
    // 2. Find warehouse with all products
    // 3. Select closest warehouse
    // 4. Process payment
    // 5. Create order in database
    // 6. Update inventory

    // Stub response
    const order: Order = {
      id: `order-${Date.now()}`,
      customer: orderData.customer,
      shippingAddress: orderData.shippingAddress,
      items: orderData.items,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    ctx.status = 201;
    ctx.body = {
      message: 'Order created successfully',
      order,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
