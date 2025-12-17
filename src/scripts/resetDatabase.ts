import 'reflect-metadata';
import { AppDataSource } from '../config/database';

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');

    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Drop all tables in correct order (reverse of dependencies)
      await queryRunner.query('DROP TABLE IF EXISTS order_items CASCADE');
      await queryRunner.query('DROP TABLE IF EXISTS orders CASCADE');
      await queryRunner.query('DROP TABLE IF EXISTS warehouse_inventory CASCADE');
      await queryRunner.query('DROP TABLE IF EXISTS products CASCADE');
      await queryRunner.query('DROP TABLE IF EXISTS warehouses CASCADE');
      await queryRunner.query('DROP TABLE IF EXISTS customers CASCADE');

      console.log('🗑️  Dropped all tables');
    } finally {
      await queryRunner.release();
    }

    await AppDataSource.destroy();
    console.log('✅ Database reset complete! Now run: npm run migration:run');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
