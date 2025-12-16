import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WarehouseInventory } from './WarehouseInventory';
import { OrderItem } from './OrderItem';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => WarehouseInventory, (inventory: WarehouseInventory) => inventory.product)
  warehouseInventories!: WarehouseInventory[];

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.product)
  orderItems!: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
