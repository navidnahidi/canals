import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WarehouseInventory } from './WarehouseInventory';
import { Order } from './Order';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  address!: string;

  @Column({ type: 'varchar', length: 100 })
  city!: string;

  @Column({ type: 'varchar', length: 50 })
  state!: string;

  @Column({ type: 'varchar', length: 20 })
  zipCode!: string;

  @Column({ type: 'varchar', length: 100 })
  country!: string;

  // Using PostGIS geography type for location
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location!: string; // Stored as 'POINT(longitude latitude)'

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude!: number;

  @OneToMany(() => WarehouseInventory, (inventory: WarehouseInventory) => inventory.warehouse)
  inventories!: WarehouseInventory[];

  @OneToMany(() => Order, (order: Order) => order.warehouse)
  orders!: Order[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
