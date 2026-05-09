export enum DamageLevel {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum VehicleType {
  AMBULANCE = 'AMBULANCE',
  TRUCK = 'TRUCK',
  DRONE = 'DRONE'
}

export interface DamageReport {
  id: string;
  lat: number;
  lng: number;
  level: DamageLevel;
  type: 'STRUCTURAL' | 'INFRASTRUCTURE' | 'FLOODING' | 'FIRE';
  description: string;
  timestamp: Date;
  confidence: number;
}

export interface RouteInfo {
  id: string;
  origin: { lat: number; lng: number; name: string };
  dest: { lat: number; lng: number; name: string };
  path: { lat: number; lng: number }[];
  vehicleType: VehicleType;
  eta: string;
  distance: string;
  status: 'ACTIVE' | 'COMPLETED' | 'BLOCKED';
  safetyScore: number;
  fuelLevel: number;
  terrainType: 'PAVED' | 'DEBRIS' | 'OFF-ROAD' | 'WATER';
}

export interface RiskZone {
  id: string;
  points: { lat: number; lng: number }[];
  intensity: number; // 0 to 1
  label: string;
}

export interface RouteObstruction {
  id: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  cause: string;
}
