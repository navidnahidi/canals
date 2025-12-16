export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodeResult {
  coordinates: Coordinates;
  formattedAddress: string;
}
