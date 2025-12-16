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
import { Order } from './Order';
import { Product } from './Product';

@Entity('order_items')
@Index(['orderId'])
@Index(['productId'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  orderId!: string;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'integer' })
  quantity!: number;

  // Denormalized product info for historical record
  @Column({ type: 'varchar', length: 255 })
  productName!: string;

  @Column({ type: 'varchar', length: 100 })
  productSku!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;

  @ManyToOne(() => Order, (order: Order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
