import { AppDataSource } from '../config/database';
import { Warehouse } from '../models/Warehouse';

export class WarehouseRepository {
  private repository = AppDataSource.getRepository(Warehouse);

  /**
   * Find warehouses by IDs that have coordinates
   */
  async findByIdsWithCoordinates(warehouseIds: string[]): Promise<Warehouse[]> {
    return this.repository
      .createQueryBuilder('warehouse')
      .where('warehouse.id IN (:...warehouseIds)', { warehouseIds })
      .andWhere('warehouse.latitude IS NOT NULL')
      .andWhere('warehouse.longitude IS NOT NULL')
      .getMany();
  }

  /**
   * Find a warehouse by ID
   */
  async findById(id: string): Promise<Warehouse | null> {
    return this.repository.findOne({ where: { id } });
  }
}
