export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customer: {
    id?: string;
    name: string;
    email: string;
  };
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  creditCardNumber: string;
}

export interface Order {
  id: string;
  customer: {
    id?: string;
    name: string;
    email: string;
  };
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  warehouseId?: string;
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
