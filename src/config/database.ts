import { DataSource } from 'typeorm';
import { Customer } from '../models/Customer';
import { Product } from '../models/Product';
import { Warehouse } from '../models/Warehouse';
import { WarehouseInventory } from '../models/WarehouseInventory';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USER || 'canals',
  password: process.env.DB_PASSWORD || 'canals',
  database: process.env.DB_NAME || 'canals',
  entities: [Customer, Product, Warehouse, WarehouseInventory, Order, OrderItem],
  synchronize: false, // Use migrations instead of auto-sync
  logging: process.env.NODE_ENV === 'development',
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  subscribers: ['src/subscribers/**/*.ts'],
});
