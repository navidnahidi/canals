import { DataSource } from 'typeorm';
import { config } from './env';
import { Customer } from '../models/Customer';
import { Product } from '../models/Product';
import { Warehouse } from '../models/Warehouse';
import { WarehouseInventory } from '../models/WarehouseInventory';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [Customer, Product, Warehouse, WarehouseInventory, Order, OrderItem],
  synchronize: false, // Use migrations instead of auto-sync
  logging: config.isDevelopment,
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  subscribers: ['src/subscribers/**/*.ts'],
});
