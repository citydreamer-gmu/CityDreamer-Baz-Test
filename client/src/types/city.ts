export interface Position {
  x: number;
  z: number;
}

export enum ZoneType {
  EMPTY = 'empty',
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial'
}

export enum BuildingType {
  ROAD = 'road',
  POWER_PLANT = 'power_plant',
  WATER_FACILITY = 'water_facility',
  SCHOOL = 'school',
  HOSPITAL = 'hospital',
  POLICE_STATION = 'police_station',
  FIRE_STATION = 'fire_station'
}

export interface GridCell {
  position: Position;
  zoneType: ZoneType;
  buildingType?: BuildingType;
  population?: number;
  developmentLevel: number; // 0-3
  hasRoad: boolean;
  hasPower: boolean;
  hasWater: boolean;
  happiness: number; // 0-100
  pollution: number; // 0-100
}

export interface CityResources {
  budget: number;
  power: number;
  powerCapacity: number;
  water: number;
  waterCapacity: number;
  population: number;
  happiness: number; // Average city happiness
}

export interface BuildingCost {
  budget: number;
  power?: number;
  water?: number;
}

export const ZONE_COSTS: Record<ZoneType, BuildingCost> = {
  [ZoneType.EMPTY]: { budget: 0 },
  [ZoneType.RESIDENTIAL]: { budget: 100, power: 1, water: 1 },
  [ZoneType.COMMERCIAL]: { budget: 200, power: 2, water: 1 },
  [ZoneType.INDUSTRIAL]: { budget: 300, power: 3, water: 2 }
};

export const BUILDING_COSTS: Record<BuildingType, BuildingCost> = {
  [BuildingType.ROAD]: { budget: 50 },
  [BuildingType.POWER_PLANT]: { budget: 1000 },
  [BuildingType.WATER_FACILITY]: { budget: 800 },
  [BuildingType.SCHOOL]: { budget: 500, power: 2, water: 1 },
  [BuildingType.HOSPITAL]: { budget: 800, power: 3, water: 2 },
  [BuildingType.POLICE_STATION]: { budget: 600, power: 2, water: 1 },
  [BuildingType.FIRE_STATION]: { budget: 600, power: 2, water: 1 }
};
