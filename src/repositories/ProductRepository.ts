import { AppDataSource } from '../config/database';
import { Product } from '../models/Product';

export class ProductRepository {
  private repository = AppDataSource.getRepository(Product);

  /**
   * Find products by IDs
   */
  async findByIds(productIds: string[]): Promise<Product[]> {
    return this.repository
      .createQueryBuilder('product')
      .where('product.id IN (:...productIds)', { productIds })
      .getMany();
  }

  /**
   * Find a product by ID
   */
  async findById(id: string): Promise<Product | null> {
    return this.repository.findOne({ where: { id } });
  }
}
