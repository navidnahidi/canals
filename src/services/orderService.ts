import { EntityManager } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Order, OrderStatus } from '../models/Order';
import { CreateOrderRequest } from '../types/order';
import { PaymentService } from './paymentService';
import { WarehouseService } from './warehouseService';
import { GeocodingService } from './geocodingService';
import { ProductRepository } from '../repositories/ProductRepository';
import { WarehouseInventoryRepository } from '../repositories/WarehouseInventoryRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { OrderRepository } from '../repositories/OrderRepository';

export class OrderService {
  private paymentService: PaymentService;
  private warehouseService: WarehouseService;
  private geocodingService: GeocodingService;
  private productRepo: ProductRepository;
  private warehouseInventoryRepo: WarehouseInventoryRepository;
  private customerRepo: CustomerRepository;
  private orderRepo: OrderRepository;

  constructor(distanceUnit: 'km' | 'miles' = 'km') {
    this.paymentService = new PaymentService();
    this.warehouseService = new WarehouseService(distanceUnit);
    this.geocodingService = new GeocodingService();
    this.productRepo = new ProductRepository();
    this.warehouseInventoryRepo = new WarehouseInventoryRepository();
    this.customerRepo = new CustomerRepository();
    this.orderRepo = new OrderRepository();
  }

  /**
   * Create an order with transaction and inventory locking
   */
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    // Step 1: Geocode shipping address
    const geocodeResult = await this.geocodingService.geocodeAddress(orderData.shippingAddress);

    // Step 2: Get product details and validate they exist
    const productIds = orderData.items.map((item) => item.productId);
    const quantities = orderData.items.map((item) => item.quantity);

    // Step 3: Find the best warehouse (closest with all products)
    const warehouse = await this.warehouseService.findBestWarehouse(
      productIds,
      quantities,
      geocodeResult.coordinates
    );

    if (!warehouse) {
      throw new Error('No warehouse found with all requested products in sufficient quantities');
    }

    // Step 4: Get products and calculate total amount
    const products = await this.productRepo.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new Error('One or more products not found');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = 0;

    for (const item of orderData.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      totalAmount += Number(product.price) * item.quantity;
    }

    // Step 5: Process payment
    const paymentResult = await this.paymentService.processPayment({
      creditCardNumber: orderData.creditCardNumber,
      amount: totalAmount,
      description: `Order for ${orderData.customer.name}`,
    });

    if (!paymentResult.success) {
      throw new Error(paymentResult.error || 'Payment processing failed');
    }

    // Step 6: Create order in transaction with inventory locking
    return await AppDataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      // Lock and check inventory availability
      const inventoryItems = await this.warehouseInventoryRepo.findAndLockByWarehouseAndProducts(
        warehouse.id,
        productIds,
        transactionalEntityManager
      );

      // Verify inventory is still sufficient (double-check after lock)
      const inventoryMap = new Map(inventoryItems.map((inv) => [inv.productId, inv]));

      for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        const requiredQuantity = quantities[i];
        const inventory = inventoryMap.get(productId);

        if (!inventory || inventory.quantity < requiredQuantity) {
          throw new Error(
            `Insufficient inventory for product ${productId} in warehouse ${warehouse.id}`
          );
        }
      }

      // Update inventory (decrement quantities)
      for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        const requiredQuantity = quantities[i];
        const inventory = inventoryMap.get(productId)!;

        await this.warehouseInventoryRepo.updateQuantity(
          inventory,
          inventory.quantity - requiredQuantity,
          transactionalEntityManager
        );
      }

      // Get or create customer
      let customer = orderData.customer.id
        ? await this.customerRepo.findById(orderData.customer.id, transactionalEntityManager)
        : null;

      if (!customer && orderData.customer.email) {
        // Try to find by email
        customer = await this.customerRepo.findByEmail(
          orderData.customer.email,
          transactionalEntityManager
        );
      }

      if (!customer) {
        // Create new customer
        customer = await this.customerRepo.create(
          {
            name: orderData.customer.name,
            email: orderData.customer.email,
          },
          transactionalEntityManager
        );
      }

      // Create order
      const savedOrder = await this.orderRepo.create(
        {
          customerId: customer.id,
          customerName: orderData.customer.name,
          customerEmail: orderData.customer.email,
          shippingStreet: orderData.shippingAddress.street,
          shippingCity: orderData.shippingAddress.city,
          shippingState: orderData.shippingAddress.state,
          shippingZipCode: orderData.shippingAddress.zipCode,
          shippingCountry: orderData.shippingAddress.country,
          shippingLatitude: geocodeResult.coordinates.latitude,
          shippingLongitude: geocodeResult.coordinates.longitude,
          warehouseId: warehouse.id,
          status: OrderStatus.PROCESSING,
          totalAmount,
          transactionId: paymentResult.transactionId,
        },
        transactionalEntityManager
      );

      // Create order items
      const orderItemsData = orderData.items.map((item) => {
        const product = productMap.get(item.productId)!;
        const unitPrice = Number(product.price);
        const totalPrice = unitPrice * item.quantity;

        return {
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          productName: product.name,
          productSku: product.sku,
          unitPrice,
          totalPrice,
        };
      });

      const orderItems = await this.orderRepo.createOrderItems(
        orderItemsData,
        transactionalEntityManager
      );

      savedOrder.items = orderItems;

      return savedOrder;
    });
  }
}
