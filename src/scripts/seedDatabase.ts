import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Product } from '../models/Product';
import { Warehouse } from '../models/Warehouse';
import { WarehouseInventory } from '../models/WarehouseInventory';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Clear existing data (in correct order due to foreign keys)
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query('DELETE FROM order_items');
      await queryRunner.query('DELETE FROM orders');
      await queryRunner.query('DELETE FROM warehouse_inventory');
      await queryRunner.query('DELETE FROM products');
      await queryRunner.query('DELETE FROM warehouses');
      await queryRunner.query('DELETE FROM customers');
      console.log('🗑️  Cleared existing data');
    } finally {
      await queryRunner.release();
    }

    // Create Products
    const productRepo = AppDataSource.getRepository(Product);

    const product1 = productRepo.create({
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Laptop',
      sku: 'LAP-001',
      description: 'High-performance laptop',
      price: 1299.99,
    });

    const product2 = productRepo.create({
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Wireless Mouse',
      sku: 'MSE-001',
      description: 'Ergonomic wireless mouse',
      price: 29.99,
    });

    const product3 = productRepo.create({
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'USB-C Cable',
      sku: 'CBL-001',
      description: 'USB-C charging cable',
      price: 19.99,
    });

    await productRepo.save([product1, product2, product3]);
    console.log('✅ Created 3 products');

    // Create Warehouses
    const warehouseRepo = AppDataSource.getRepository(Warehouse);

    const warehouse1 = warehouseRepo.create({
      name: 'San Francisco Warehouse',
      address: '100 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
      // location field is nullable and we're using lat/long for distance calculations
    });

    const warehouse2 = warehouseRepo.create({
      name: 'Los Angeles Warehouse',
      address: '200 Spring St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90012',
      country: 'USA',
      latitude: 34.0522,
      longitude: -118.2437,
    });

    const warehouse3 = warehouseRepo.create({
      name: 'Seattle Warehouse',
      address: '300 Pike St',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      latitude: 47.6062,
      longitude: -122.3321,
    });

    await warehouseRepo.save([warehouse1, warehouse2, warehouse3]);
    console.log('✅ Created 3 warehouses');

    // Create Warehouse Inventory
    const inventoryRepo = AppDataSource.getRepository(WarehouseInventory);

    // San Francisco Warehouse - has all products
    const sfInventory = [
      inventoryRepo.create({
        warehouseId: warehouse1.id,
        productId: product1.id,
        quantity: 50,
      }),
      inventoryRepo.create({
        warehouseId: warehouse1.id,
        productId: product2.id,
        quantity: 100,
      }),
      inventoryRepo.create({
        warehouseId: warehouse1.id,
        productId: product3.id,
        quantity: 200,
      }),
    ];

    // Los Angeles Warehouse - has limited products
    const laInventory = [
      inventoryRepo.create({
        warehouseId: warehouse2.id,
        productId: product1.id,
        quantity: 30,
      }),
      inventoryRepo.create({
        warehouseId: warehouse2.id,
        productId: product2.id,
        quantity: 75,
      }),
    ];

    // Seattle Warehouse - has different products
    const seaInventory = [
      inventoryRepo.create({
        warehouseId: warehouse3.id,
        productId: product2.id,
        quantity: 150,
      }),
      inventoryRepo.create({
        warehouseId: warehouse3.id,
        productId: product3.id,
        quantity: 300,
      }),
    ];

    await inventoryRepo.save([...sfInventory, ...laInventory, ...seaInventory]);
    console.log('✅ Created warehouse inventory');

    console.log('\n📊 Seed Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Products:');
    console.log(`  - Laptop (${product1.id}): $1299.99`);
    console.log(`  - Wireless Mouse (${product2.id}): $29.99`);
    console.log(`  - USB-C Cable (${product3.id}): $19.99`);
    console.log('\nWarehouses:');
    console.log(`  - San Francisco (${warehouse1.id})`);
    console.log(
      `    Address: ${warehouse1.address}, ${warehouse1.city}, ${warehouse1.state} ${warehouse1.zipCode}`
    );
    console.log(`    Location: Lat ${warehouse1.latitude}, Lon ${warehouse1.longitude}`);
    console.log(`  - Los Angeles (${warehouse2.id})`);
    console.log(
      `    Address: ${warehouse2.address}, ${warehouse2.city}, ${warehouse2.state} ${warehouse2.zipCode}`
    );
    console.log(`    Location: Lat ${warehouse2.latitude}, Lon ${warehouse2.longitude}`);
    console.log(`  - Seattle (${warehouse3.id})`);
    console.log(
      `    Address: ${warehouse3.address}, ${warehouse3.city}, ${warehouse3.state} ${warehouse3.zipCode}`
    );
    console.log(`    Location: Lat ${warehouse3.latitude}, Lon ${warehouse3.longitude}`);
    console.log('\nInventory:');
    console.log('  - San Francisco: Laptop (50), Mouse (100), Cable (200)');
    console.log('  - Los Angeles: Laptop (30), Mouse (75)');
    console.log('  - Seattle: Mouse (150), Cable (300)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 Database seeded successfully!\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
