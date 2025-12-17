import { AppDataSource } from '../config/database';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { EntityManager } from 'typeorm';

export class OrderRepository {
  private repository = AppDataSource.getRepository(Order);

  /**
   * Create a new order (within transaction)
   */
  async create(orderData: Partial<Order>, manager: EntityManager): Promise<Order> {
    const order = manager.getRepository(Order).create(orderData);
    return manager.getRepository(Order).save(order);
  }

  /**
   * Create order items (within transaction)
   */
  async createOrderItems(
    orderItemsData: Partial<OrderItem>[],
    manager: EntityManager
  ): Promise<OrderItem[]> {
    const orderItems = orderItemsData.map((data) => manager.getRepository(OrderItem).create(data));
    return manager.getRepository(OrderItem).save(orderItems);
  }

  /**
   * Find an order by ID
   */
  async findById(id: string): Promise<Order | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['items', 'customer', 'warehouse'],
    });
  }
}
