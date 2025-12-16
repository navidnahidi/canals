import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Warehouse } from './Warehouse';
import { Product } from './Product';

@Entity('warehouse_inventory')
@Index(['warehouse', 'product'], { unique: true })
export class WarehouseInventory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  warehouseId!: string;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'integer', default: 0 })
  quantity!: number;

  @ManyToOne(() => Warehouse, (warehouse: Warehouse) => warehouse.inventories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouseId' })
  warehouse!: Warehouse;

  @ManyToOne(() => Product, (product: Product) => product.warehouseInventories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
