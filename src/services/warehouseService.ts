import { Warehouse } from '../models/Warehouse';
import { Coordinates } from '../types/geocoding';
import { WarehouseInventoryRepository } from '../repositories/WarehouseInventoryRepository';
import { WarehouseRepository } from '../repositories/WarehouseRepository';

export type DistanceUnit = 'km' | 'miles';

export interface WarehouseWithDistance {
  warehouse: Warehouse;
  distance: number;
  unit: DistanceUnit;
}

/**
 * Service for warehouse operations
 */
export class WarehouseService {
  private distanceUnit: DistanceUnit;
  private warehouseInventoryRepo: WarehouseInventoryRepository;
  private warehouseRepo: WarehouseRepository;

  constructor(distanceUnit: DistanceUnit = 'km') {
    this.distanceUnit = distanceUnit;
    this.warehouseInventoryRepo = new WarehouseInventoryRepository();
    this.warehouseRepo = new WarehouseRepository();
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param lat1 - Latitude of first point
   * @param lon1 - Longitude of first point
   * @param lat2 - Latitude of second point
   * @param lon2 - Longitude of second point
   * @param unit - Unit of measurement ('km' or 'miles')
   * @returns Distance in the specified unit
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: DistanceUnit = this.distanceUnit
  ): number {
    // Earth's radius
    const R = unit === 'miles' ? 3959 : 6371; // miles or kilometers

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Get the current distance unit being used
   */
  getDistanceUnit(): DistanceUnit {
    return this.distanceUnit;
  }

  /**
   * Set the distance unit
   */
  setDistanceUnit(unit: DistanceUnit): void {
    this.distanceUnit = unit;
  }

  /**
   * Find warehouses that have all the requested products in stock
   * @param productIds - Array of product IDs to check
   * @param quantities - Array of quantities needed (same order as productIds)
   * @returns Array of warehouse IDs that have all products in sufficient quantities
   */
  async findWarehousesWithAllProducts(
    productIds: string[],
    quantities: number[]
  ): Promise<string[]> {
    // Find all warehouses that have inventory for the requested products
    const inventories = await this.warehouseInventoryRepo.findByProductIds(productIds);

    // Group by warehouse and check if each has all products with sufficient quantity
    const warehouseProductMap = new Map<string, Map<string, number>>();

    for (const inv of inventories) {
      if (!warehouseProductMap.has(inv.warehouseId)) {
        warehouseProductMap.set(inv.warehouseId, new Map());
      }
      warehouseProductMap.get(inv.warehouseId)!.set(inv.productId, inv.quantity);
    }

    // Check which warehouses have all products in sufficient quantities
    const validWarehouseIds: string[] = [];

    for (const [warehouseId, productMap] of warehouseProductMap.entries()) {
      let hasAllProducts = true;

      for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        const requiredQuantity = quantities[i];
        const availableQuantity = productMap.get(productId) || 0;

        if (availableQuantity < requiredQuantity) {
          hasAllProducts = false;
          break;
        }
      }

      if (hasAllProducts) {
        validWarehouseIds.push(warehouseId);
      }
    }

    return validWarehouseIds;
  }

  /**
   * Find the closest warehouse to the shipping coordinates
   * @param warehouseIds - Array of warehouse IDs to consider
   * @param shippingCoordinates - Shipping address coordinates
   * @returns The closest warehouse, or null if no warehouses found
   */
  async findClosestWarehouse(
    warehouseIds: string[],
    shippingCoordinates: Coordinates
  ): Promise<Warehouse | null> {
    if (warehouseIds.length === 0) {
      return null;
    }

    const warehouses = await this.warehouseRepo.findByIdsWithCoordinates(warehouseIds);

    if (warehouses.length === 0) {
      return null;
    }

    // Calculate distances and find closest
    let closestWarehouse: Warehouse | null = null;
    let minDistance = Infinity;

    for (const warehouse of warehouses) {
      if (warehouse.latitude && warehouse.longitude) {
        const distance = this.calculateDistance(
          shippingCoordinates.latitude,
          shippingCoordinates.longitude,
          Number(warehouse.latitude),
          Number(warehouse.longitude)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestWarehouse = warehouse;
        }
      }
    }

    return closestWarehouse;
  }

  /**
   * Find the best warehouse (closest with all products)
   * @param productIds - Array of product IDs
   * @param quantities - Array of quantities needed
   * @param shippingCoordinates - Shipping address coordinates
   * @returns The closest warehouse with all products, or null
   */
  async findBestWarehouse(
    productIds: string[],
    quantities: number[],
    shippingCoordinates: Coordinates
  ): Promise<Warehouse | null> {
    const validWarehouseIds = await this.findWarehousesWithAllProducts(productIds, quantities);

    if (validWarehouseIds.length === 0) {
      return null;
    }

    return this.findClosestWarehouse(validWarehouseIds, shippingCoordinates);
  }
}
