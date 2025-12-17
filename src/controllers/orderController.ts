import { Context } from 'koa';
import { CreateOrderRequest } from '../types/order';
import { OrderService } from '../services/orderService';
import { createOrderRequestSchema } from '../validators/orderValidator';

// Get distance unit from environment variable, default to km
const distanceUnit = (process.env.DISTANCE_UNIT as 'km' | 'miles') || 'km';
const orderService = new OrderService(distanceUnit);

export const createOrder = async (ctx: Context): Promise<void> => {
  try {
    // Validate input using Zod
    const validationResult = createOrderRequestSchema.safeParse(ctx.request.body);

    if (!validationResult.success) {
      ctx.status = 400;
      ctx.body = {
        error: 'Validation failed',
        message: 'Invalid request data',
        details: validationResult.error.errors.map(
          (err: { path: (string | number)[]; message: string }) => ({
            path: err.path.join('.'),
            message: err.message,
          })
        ),
      };
      return;
    }

    const orderData: CreateOrderRequest = validationResult.data;

    // Create order using service (handles all business logic, transactions, and locking)
    const order = await orderService.createOrder(orderData);

    // Format response
    ctx.status = 201;
    ctx.body = {
      message: 'Order created successfully',
      order: {
        id: order.id,
        customer: {
          id: order.customerId,
          name: order.customerName,
          email: order.customerEmail,
        },
        shippingAddress: {
          street: order.shippingStreet,
          city: order.shippingCity,
          state: order.shippingState,
          zipCode: order.shippingZipCode,
          country: order.shippingCountry,
        },
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          productName: item.productName,
          productSku: item.productSku,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
        })),
        warehouseId: order.warehouseId,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        transactionId: order.transactionId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    };
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (
        error.message.includes('No warehouse found') ||
        error.message.includes('Insufficient inventory') ||
        error.message.includes('not found')
      ) {
        ctx.status = 400;
        ctx.body = {
          error: 'Order creation failed',
          message: error.message,
        };
        return;
      }

      if (error.message.includes('Payment processing failed')) {
        ctx.status = 402; // Payment Required
        ctx.body = {
          error: 'Payment failed',
          message: error.message,
        };
        return;
      }
    }

    ctx.status = 500;
    ctx.body = {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
