import { ShippingAddress } from '../types/order';
import { Coordinates, GeocodeResult } from '../types/geocoding';

/**
 * Mock geocoding service to convert addresses to latitude/longitude
 * In production, this would call a 3rd party API like Google Maps Geocoding API
 */
export class GeocodingService {
  /**
   * Converts a shipping address to latitude/longitude coordinates
   * @param address - The shipping address to geocode
   * @returns Promise with coordinates and formatted address
   */
  async geocodeAddress(address: ShippingAddress): Promise<GeocodeResult> {
    // Mock implementation - returns deterministic coordinates based on address
    // In production, this would make an HTTP request to a geocoding API

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Mock: Generate deterministic coordinates based on city/state
    // This ensures the same address always returns the same coordinates
    const coordinates = this.generateMockCoordinates(address);

    return {
      coordinates,
      formattedAddress: `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`,
    };
  }

  /**
   * Generates mock coordinates based on address
   * In production, this would be replaced with actual API call
   */
  private generateMockCoordinates(address: ShippingAddress): Coordinates {
    // Simple hash function to generate consistent coordinates
    const hash = this.simpleHash(`${address.city}-${address.state}-${address.zipCode}`);

    // Map hash to reasonable US coordinates (roughly)
    // Latitude: -90 to 90, Longitude: -180 to 180
    // For US: Latitude ~25-50, Longitude ~-125 to -65
    const latitude = 37.7749 + (hash % 2000) / 1000 - 10; // San Francisco area ±10 degrees
    const longitude = -122.4194 + (hash % 3000) / 1000 - 15; // San Francisco area ±15 degrees

    return {
      latitude: Math.round(latitude * 10000) / 10000, // Round to 4 decimal places
      longitude: Math.round(longitude * 10000) / 10000,
    };
  }

  /**
   * Simple hash function for deterministic coordinate generation
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
