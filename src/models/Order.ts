import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Customer } from './Customer';
import { Warehouse } from './Warehouse';
import { OrderItem } from './OrderItem';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
}

@Entity('orders')
@Index(['customerId'])
@Index(['warehouseId'])
@Index(['status'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  customerId?: string;

  // Denormalized customer info for historical record
  @Column({ type: 'varchar', length: 255 })
  customerName!: string;

  @Column({ type: 'varchar', length: 255 })
  customerEmail!: string;

  // Shipping address
  @Column({ type: 'varchar', length: 255 })
  shippingStreet!: string;

  @Column({ type: 'varchar', length: 100 })
  shippingCity!: string;

  @Column({ type: 'varchar', length: 50 })
  shippingState!: string;

  @Column({ type: 'varchar', length: 20 })
  shippingZipCode!: string;

  @Column({ type: 'varchar', length: 100 })
  shippingCountry!: string;

  // Shipping address coordinates (for distance calculation)
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  shippingLatitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  shippingLongitude?: number;

  @Column({ type: 'uuid', nullable: true })
  warehouseId?: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transactionId?: string;

  @ManyToOne(() => Customer, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customerId' })
  customer?: Customer;

  @ManyToOne(() => Warehouse, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse?: Warehouse;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order, { cascade: true })
  items!: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
