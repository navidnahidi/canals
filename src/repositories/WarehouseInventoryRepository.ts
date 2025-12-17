import { AppDataSource } from '../config/database';
import { WarehouseInventory } from '../models/WarehouseInventory';
import { EntityManager } from 'typeorm';

export class WarehouseInventoryRepository {
  private repository = AppDataSource.getRepository(WarehouseInventory);

  /**
   * Find inventory items for given product IDs with available stock
   */
  async findByProductIds(productIds: string[]): Promise<WarehouseInventory[]> {
    return this.repository
      .createQueryBuilder('wi')
      .where('wi.productId IN (:...productIds)', { productIds })
      .andWhere('wi.quantity > 0')
      .getMany();
  }

  /**
   * Find and lock inventory items for a warehouse and products (for transaction)
   */
  async findAndLockByWarehouseAndProducts(
    warehouseId: string,
    productIds: string[],
    manager: EntityManager
  ): Promise<WarehouseInventory[]> {
    return manager
      .getRepository(WarehouseInventory)
      .createQueryBuilder('wi')
      .setLock('pessimistic_write') // FOR UPDATE lock
      .where('wi.warehouseId = :warehouseId', { warehouseId })
      .andWhere('wi.productId IN (:...productIds)', { productIds })
      .getMany();
  }

  /**
   * Update inventory quantity (within transaction)
   */
  async updateQuantity(
    inventory: WarehouseInventory,
    newQuantity: number,
    manager: EntityManager
  ): Promise<WarehouseInventory> {
    inventory.quantity = newQuantity;
    return manager.getRepository(WarehouseInventory).save(inventory);
  }
}
