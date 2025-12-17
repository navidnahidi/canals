import { z } from 'zod';

export const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const customerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email address'),
});

export const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const createOrderRequestSchema = z.object({
  customer: customerSchema,
  shippingAddress: shippingAddressSchema,
  items: z.array(orderItemSchema).min(1, 'Order must include at least one item'),
  creditCardNumber: z
    .string()
    .min(13, 'Credit card number must be at least 13 digits')
    .max(19, 'Credit card number must be at most 19 digits')
    .regex(/^\d+$/, 'Credit card number must contain only digits'),
});

export type CreateOrderRequestInput = z.infer<typeof createOrderRequestSchema>;
