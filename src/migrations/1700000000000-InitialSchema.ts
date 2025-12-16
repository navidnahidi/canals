import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable PostGIS extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "postgis"`);

    // Check if tables already exist
    const customersTable = await queryRunner.getTable('customers');
    const productsTable = await queryRunner.getTable('products');
    const warehousesTable = await queryRunner.getTable('warehouses');
    const warehouseInventoryTable = await queryRunner.getTable('warehouse_inventory');
    const ordersTable = await queryRunner.getTable('orders');
    const orderItemsTable = await queryRunner.getTable('order_items');

    // Create customers table
    if (!customersTable) {
      await queryRunner.createTable(
        new Table({
          name: 'customers',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
              isUnique: true,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
        true
      );
    }

    // Create products table
    if (!productsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'products',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'sku',
              type: 'varchar',
              length: '100',
              isUnique: true,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'price',
              type: 'decimal',
              precision: 10,
              scale: 2,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
        true
      );
    }

    // Create warehouses table
    if (!warehousesTable) {
      await queryRunner.createTable(
        new Table({
          name: 'warehouses',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'address',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'city',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'state',
              type: 'varchar',
              length: '50',
            },
            {
              name: 'zipCode',
              type: 'varchar',
              length: '20',
            },
            {
              name: 'country',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'location',
              type: 'geography',
              isNullable: true,
              spatialFeatureType: 'Point',
              srid: 4326,
            },
            {
              name: 'latitude',
              type: 'decimal',
              precision: 10,
              scale: 7,
              isNullable: true,
            },
            {
              name: 'longitude',
              type: 'decimal',
              precision: 10,
              scale: 7,
              isNullable: true,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
        true
      );
    }

    // Create warehouse_inventory table
    if (!warehouseInventoryTable) {
      await queryRunner.createTable(
        new Table({
          name: 'warehouse_inventory',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'warehouseId',
              type: 'uuid',
            },
            {
              name: 'productId',
              type: 'uuid',
            },
            {
              name: 'quantity',
              type: 'integer',
              default: 0,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
        true
      );

      // Create unique constraint on warehouse_inventory
      const existingUniqueIndex = await queryRunner.getTable('warehouse_inventory');
      if (existingUniqueIndex) {
        const hasUniqueIndex = existingUniqueIndex.indices.find(
          (idx) =>
            idx.columnNames.length === 2 &&
            idx.columnNames.includes('warehouseId') &&
            idx.columnNames.includes('productId')
        );
        if (!hasUniqueIndex) {
          await queryRunner.createIndex(
            'warehouse_inventory',
            new TableIndex({
              name: 'IDX_warehouse_inventory_unique',
              columnNames: ['warehouseId', 'productId'],
              isUnique: true,
            })
          );
        }
      }
    }

    // Create orders table
    if (!ordersTable) {
      await queryRunner.createTable(
        new Table({
          name: 'orders',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'customerId',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'customerName',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'customerEmail',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'shippingStreet',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'shippingCity',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'shippingState',
              type: 'varchar',
              length: '50',
            },
            {
              name: 'shippingZipCode',
              type: 'varchar',
              length: '20',
            },
            {
              name: 'shippingCountry',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'shippingLatitude',
              type: 'decimal',
              precision: 10,
              scale: 7,
              isNullable: true,
            },
            {
              name: 'shippingLongitude',
              type: 'decimal',
              precision: 10,
              scale: 7,
              isNullable: true,
            },
            {
              name: 'warehouseId',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['pending', 'processing', 'fulfilled', 'cancelled'],
              default: "'pending'",
            },
            {
              name: 'totalAmount',
              type: 'decimal',
              precision: 10,
              scale: 2,
            },
            {
              name: 'transactionId',
              type: 'varchar',
              length: '100',
              isNullable: true,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
        true
      );
    }

    // Create order_items table
    if (!orderItemsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'order_items',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'orderId',
              type: 'uuid',
            },
            {
              name: 'productId',
              type: 'uuid',
            },
            {
              name: 'quantity',
              type: 'integer',
            },
            {
              name: 'productName',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'productSku',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'unitPrice',
              type: 'decimal',
              precision: 10,
              scale: 2,
            },
            {
              name: 'totalPrice',
              type: 'decimal',
              precision: 10,
              scale: 2,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
        true
      );
    }

    // Create indexes (only if they don't exist)
    const currentWarehouseInventoryTable = await queryRunner.getTable('warehouse_inventory');
    if (currentWarehouseInventoryTable) {
      const existingIndices = currentWarehouseInventoryTable.indices.map((idx) => idx.name);

      if (!existingIndices.includes('IDX_warehouse_inventory_warehouse')) {
        await queryRunner.createIndex(
          'warehouse_inventory',
          new TableIndex({
            name: 'IDX_warehouse_inventory_warehouse',
            columnNames: ['warehouseId'],
          })
        );
      }

      if (!existingIndices.includes('IDX_warehouse_inventory_product')) {
        await queryRunner.createIndex(
          'warehouse_inventory',
          new TableIndex({
            name: 'IDX_warehouse_inventory_product',
            columnNames: ['productId'],
          })
        );
      }
    }

    const currentOrdersTable = await queryRunner.getTable('orders');
    if (currentOrdersTable) {
      const existingIndices = currentOrdersTable.indices.map((idx) => idx.name);

      if (!existingIndices.includes('IDX_orders_customer')) {
        await queryRunner.createIndex(
          'orders',
          new TableIndex({
            name: 'IDX_orders_customer',
            columnNames: ['customerId'],
          })
        );
      }

      if (!existingIndices.includes('IDX_orders_warehouse')) {
        await queryRunner.createIndex(
          'orders',
          new TableIndex({
            name: 'IDX_orders_warehouse',
            columnNames: ['warehouseId'],
          })
        );
      }

      if (!existingIndices.includes('IDX_orders_status')) {
        await queryRunner.createIndex(
          'orders',
          new TableIndex({
            name: 'IDX_orders_status',
            columnNames: ['status'],
          })
        );
      }
    }

    const currentOrderItemsTable = await queryRunner.getTable('order_items');
    if (currentOrderItemsTable) {
      const existingIndices = currentOrderItemsTable.indices.map((idx) => idx.name);

      if (!existingIndices.includes('IDX_order_items_order')) {
        await queryRunner.createIndex(
          'order_items',
          new TableIndex({
            name: 'IDX_order_items_order',
            columnNames: ['orderId'],
          })
        );
      }

      if (!existingIndices.includes('IDX_order_items_product')) {
        await queryRunner.createIndex(
          'order_items',
          new TableIndex({
            name: 'IDX_order_items_product',
            columnNames: ['productId'],
          })
        );
      }
    }

    // Create foreign keys (only if they don't exist)
    const warehouseInventoryTableForFk = await queryRunner.getTable('warehouse_inventory');
    const existingWarehouseInventoryFks = warehouseInventoryTableForFk?.foreignKeys || [];

    if (!existingWarehouseInventoryFks.find((fk) => fk.columnNames.includes('warehouseId'))) {
      await queryRunner.createForeignKey(
        'warehouse_inventory',
        new TableForeignKey({
          columnNames: ['warehouseId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'warehouses',
          onDelete: 'CASCADE',
        })
      );
    }

    if (!existingWarehouseInventoryFks.find((fk) => fk.columnNames.includes('productId'))) {
      await queryRunner.createForeignKey(
        'warehouse_inventory',
        new TableForeignKey({
          columnNames: ['productId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'CASCADE',
        })
      );
    }

    const ordersTableForFk = await queryRunner.getTable('orders');
    const existingOrdersFks = ordersTableForFk?.foreignKeys || [];

    if (!existingOrdersFks.find((fk) => fk.columnNames.includes('customerId'))) {
      await queryRunner.createForeignKey(
        'orders',
        new TableForeignKey({
          columnNames: ['customerId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'customers',
          onDelete: 'SET NULL',
        })
      );
    }

    if (!existingOrdersFks.find((fk) => fk.columnNames.includes('warehouseId'))) {
      await queryRunner.createForeignKey(
        'orders',
        new TableForeignKey({
          columnNames: ['warehouseId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'warehouses',
          onDelete: 'SET NULL',
        })
      );
    }

    const orderItemsTableForFk = await queryRunner.getTable('order_items');
    const existingOrderItemsFks = orderItemsTableForFk?.foreignKeys || [];

    if (!existingOrderItemsFks.find((fk) => fk.columnNames.includes('orderId'))) {
      await queryRunner.createForeignKey(
        'order_items',
        new TableForeignKey({
          columnNames: ['orderId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'orders',
          onDelete: 'CASCADE',
        })
      );
    }

    if (!existingOrderItemsFks.find((fk) => fk.columnNames.includes('productId'))) {
      await queryRunner.createForeignKey(
        'order_items',
        new TableForeignKey({
          columnNames: ['productId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'CASCADE',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const orderItemsTable = await queryRunner.getTable('order_items');
    if (orderItemsTable) {
      const foreignKeys = orderItemsTable.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('order_items', fk);
      }
    }

    const ordersTable = await queryRunner.getTable('orders');
    if (ordersTable) {
      const foreignKeys = ordersTable.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('orders', fk);
      }
    }

    const warehouseInventoryTable = await queryRunner.getTable('warehouse_inventory');
    if (warehouseInventoryTable) {
      const foreignKeys = warehouseInventoryTable.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('warehouse_inventory', fk);
      }
    }

    // Drop tables
    await queryRunner.dropTable('order_items', true);
    await queryRunner.dropTable('orders', true);
    await queryRunner.dropTable('warehouse_inventory', true);
    await queryRunner.dropTable('warehouses', true);
    await queryRunner.dropTable('products', true);
    await queryRunner.dropTable('customers', true);
  }
}
