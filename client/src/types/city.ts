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
  FIRE_STATION = 'fire_station',

  // New buildings for enhanced simulation
  PARK = 'park',
  LIBRARY = 'library',
  UNIVERSITY = 'university',
  WASTE_FACILITY = 'waste_facility',
  BUS_STOP = 'bus_stop',
  SUBWAY_STATION = 'subway_station',
  CITY_HALL = 'city_hall',
  STADIUM = 'stadium',

  // Power infrastructure
  POWER_LINE = 'power_line',
  POWER_SUBSTATION = 'power_substation',

  // Transportation infrastructure
  HIGHWAY = 'highway',
  BRIDGE = 'bridge',
  TRAFFIC_LIGHT = 'traffic_light',

  // Public Transit System
  TRAIN_STATION = 'train_station',
  SUBWAY_TRACK = 'subway_track',
  TRAIN_TRACK = 'train_track',
  TRANSIT_HUB = 'transit_hub',
  MONORAIL_STATION = 'monorail_station',
  MONORAIL_TRACK = 'monorail_track',

  // Industrial & Shipping System
  CARGO_TERMINAL = 'cargo_terminal',
  WAREHOUSE = 'warehouse',
  FACTORY = 'factory',
  MINING_FACILITY = 'mining_facility',
  OIL_REFINERY = 'oil_refinery',
  STEEL_MILL = 'steel_mill',
  CHEMICAL_PLANT = 'chemical_plant',
  FOOD_PROCESSING = 'food_processing',
  ELECTRONICS_FACTORY = 'electronics_factory',
  SHIPPING_DOCK = 'shipping_dock',
  FREIGHT_RAIL_TERMINAL = 'freight_rail_terminal',
  HIGHWAY_CONNECTION = 'highway_connection',
  RAIL_CONNECTION = 'rail_connection'
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

  // Economic data
  jobs?: number; // Jobs provided (commercial/industrial)
  workers?: number; // Workers needed (all zones)
  landValue: number; // Property value

  // Traffic & accessibility
  trafficLevel: number; // 0-100 traffic congestion
  accessibility: number; // 0-100 how well connected

  // Services coverage
  educationAccess: number; // 0-100
  healthcareAccess: number; // 0-100
  safetyLevel: number; // 0-100

  // Crime system
  crimeScore: number; // 0-100 (higher = more crime)
  policeCoverage: number; // 0-100 police presence
  crimeType: CrimeType; // Dominant crime type in this area
  crimeHistory: number[]; // Historical crime data
  lastCrimeUpdate: number; // Last time crime was calculated
  crimeFactors: CrimeFactor[]; // What's contributing to crime

  // Power system
  powerDistance: number; // Distance to nearest power source
  powerLineConnections: Direction[]; // Which directions have power lines

  // Transportation system
  roadConnections: Direction[]; // Which directions have roads
  trafficFlow: TrafficFlow; // Traffic flowing through this cell
  roadType: RoadType; // Type of road infrastructure

  // Commuting data
  commuterOrigins: Position[]; // Where people commute from
  commuterDestinations: Position[]; // Where people commute to
  leisureDestinations: Position[]; // Where people go for leisure

  // Transit system
  transitAccess: number; // 0-100 access to public transit
  transitLines: string[]; // IDs of transit lines serving this cell
  transitType: TransitType; // Type of transit infrastructure
  transitConnections: Direction[]; // Which directions have transit tracks
  transitRidership: number; // Number of daily riders from this cell

  // Industrial system
  industryType: IndustryType; // Type of industrial activity
  inputResources: ResourceType[]; // Resources this building consumes
  outputResources: ResourceType[]; // Resources this building produces
  productionLevel: number; // 0-100 current production efficiency
  warehouseCapacity: number; // Storage capacity
  currentInventory: Record<ResourceType, number>; // Current stored resources
  supplyChainConnections: SupplyChain[]; // Supply chains from/to this cell
  industrialTraffic: number; // Industrial vehicles per day
  cargoFlow: Record<Direction, number>; // Cargo flow in each direction

  // Zoning and Land Value System
  isZoned: boolean; // Whether this cell has been zoned
  zonedDate: number; // When this cell was zoned (simulation time)
  landValueHistory: number[]; // Historical land values for trend analysis
  lastLandValueUpdate: number; // Last time land value was calculated
  developmentPressure: number; // 0-100 pressure to develop/upgrade
  marketDemand: number; // 0-100 demand for this zone type in this location
  constructionCost: number; // Cost to build/upgrade on this land
  propertyTax: number; // Annual property tax based on land value
  appreciationRate: number; // Annual land value appreciation rate
  zoningRestrictions: ZoningRestriction[]; // Special zoning rules

  // Financial System
  monthlyTaxRevenue: number; // Monthly tax revenue from this cell
  monthlyOperatingCost: number; // Monthly cost to maintain this cell
  businessRevenue: number; // Revenue generated by businesses (commercial/industrial)
  employmentTax: number; // Tax revenue from jobs in this cell
  salesTaxRevenue: number; // Sales tax from commercial activity
  maintenanceCost: number; // Infrastructure maintenance cost
  lastFinancialUpdate: number; // Last time finances were calculated
}

export interface ZoningRestriction {
  type: 'height_limit' | 'density_limit' | 'use_restriction' | 'environmental';
  value: number;
  description: string;
}

export enum LandValueFactor {
  LOCATION = 'location',
  INFRASTRUCTURE = 'infrastructure',
  SERVICES = 'services',
  ENVIRONMENT = 'environment',
  MARKET_DEMAND = 'market_demand',
  ZONING = 'zoning'
}

export enum CrimeType {
  NONE = 'none',
  PETTY_THEFT = 'petty_theft',
  BURGLARY = 'burglary',
  VANDALISM = 'vandalism',
  DRUG_RELATED = 'drug_related',
  VIOLENT_CRIME = 'violent_crime',
  ORGANIZED_CRIME = 'organized_crime',
  WHITE_COLLAR = 'white_collar'
}

export interface CrimeFactor {
  type: 'poverty' | 'unemployment' | 'density' | 'pollution' | 'lack_of_services' | 'industrial' | 'commercial' | 'education';
  impact: number; // -100 to +100 (negative reduces crime, positive increases)
  description: string;
}

export enum CreditRating {
  AAA = 'AAA',
  AA = 'AA',
  A = 'A',
  BBB = 'BBB',
  BB = 'BB',
  B = 'B',
  CCC = 'CCC',
  CC = 'CC',
  C = 'C',
  D = 'D'
}

export interface TaxRevenue {
  residential: number; // Income tax from residents
  commercial: number; // Business tax from commercial zones
  industrial: number; // Corporate tax from industrial zones
  property: number; // Property tax based on land values
  sales: number; // Sales tax from commercial activity
  transit: number; // Revenue from public transit fares
  utilities: number; // Revenue from city-owned utilities
  fees: number; // Various city fees and permits
  total: number; // Total tax revenue
}

export interface OperatingExpenses {
  infrastructure: InfrastructureExpenses; // Infrastructure maintenance
  services: ServiceExpenses; // City services
  administration: number; // City administration costs
  debt: number; // Debt service payments
  emergency: number; // Emergency fund allocation
  total: number; // Total operating expenses
}

export interface InfrastructureExpenses {
  roads: number; // Road maintenance
  power: number; // Power grid maintenance
  water: number; // Water system maintenance
  transit: number; // Public transit operations
  waste: number; // Waste management
  total: number; // Total infrastructure expenses
}

export interface ServiceExpenses {
  education: number; // Schools and universities
  healthcare: number; // Hospitals and clinics
  police: number; // Police stations and law enforcement
  fire: number; // Fire stations and emergency services
  parks: number; // Parks and recreation
  libraries: number; // Libraries and cultural services
  total: number; // Total service expenses
}

export interface FinancialRecord {
  month: number;
  year: number;
  income: number;
  expenses: number;
  cashFlow: number;
  budget: number;
  debt: number;
  population: number;
}

export enum BudgetAlertType {
  LOW_FUNDS = 'low_funds',
  DEFICIT = 'deficit',
  HIGH_DEBT = 'high_debt',
  CREDIT_DOWNGRADE = 'credit_downgrade',
  INFRASTRUCTURE_DECAY = 'infrastructure_decay',
  SERVICE_UNDERFUNDING = 'service_underfunding'
}

export interface BudgetAlert {
  type: BudgetAlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendation: string;
  cost: number; // Cost to resolve the issue
}

export enum Direction {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west'
}

export enum RoadType {
  NONE = 'none',
  LOCAL_ROAD = 'local_road',
  HIGHWAY = 'highway',
  BRIDGE = 'bridge'
}

export enum TransitType {
  NONE = 'none',
  BUS = 'bus',
  SUBWAY = 'subway',
  TRAIN = 'train',
  MONORAIL = 'monorail'
}

export interface TransitLine {
  id: string;
  type: TransitType;
  stations: Position[];
  tracks: Position[];
  capacity: number;
  frequency: number; // minutes between services
  ridership: number; // current passengers
}

export interface TransitNetwork {
  lines: TransitLine[];
  totalRidership: number;
  coverage: number; // percentage of city covered
  efficiency: number; // 0-100 system efficiency
}

export enum IndustryType {
  NONE = 'none',
  RAW_MATERIALS = 'raw_materials',
  MANUFACTURING = 'manufacturing',
  PROCESSING = 'processing',
  ASSEMBLY = 'assembly',
  LOGISTICS = 'logistics'
}

export enum ResourceType {
  RAW_MATERIALS = 'raw_materials',
  STEEL = 'steel',
  OIL = 'oil',
  CHEMICALS = 'chemicals',
  ELECTRONICS = 'electronics',
  FOOD = 'food',
  MANUFACTURED_GOODS = 'manufactured_goods'
}

export interface SupplyChain {
  id: string;
  from: Position;
  to: Position;
  resourceType: ResourceType;
  volume: number; // units per day
  transportMode: 'road' | 'rail' | 'both';
  efficiency: number; // 0-100
}

export interface IndustrialBuilding {
  position: Position;
  type: BuildingType;
  industryType: IndustryType;
  inputResources: ResourceType[];
  outputResources: ResourceType[];
  productionCapacity: number;
  currentProduction: number;
  supplyChains: SupplyChain[];
  warehouseCapacity: number;
  currentInventory: Record<ResourceType, number>;
}

export interface ExternalConnection {
  position: Position;
  type: 'highway' | 'rail';
  direction: Direction;
  capacity: number;
  currentTraffic: number;
  importExport: Record<ResourceType, number>;
}

export interface TrafficFlow {
  north: number; // 0-100 traffic intensity going north
  south: number; // 0-100 traffic intensity going south
  east: number; // 0-100 traffic intensity going east
  west: number; // 0-100 traffic intensity going west
  total: number; // Total traffic through this cell
}

export interface CityResources {
  budget: number;
  power: number;
  powerCapacity: number;
  water: number;
  waterCapacity: number;
  population: number;
  happiness: number; // Average city happiness

  // Economic metrics
  monthlyIncome: number;
  monthlyExpenses: number;
  unemployment: number; // Percentage

  // Detailed Financial System
  taxRevenue: TaxRevenue; // Breakdown of all tax income
  operatingExpenses: OperatingExpenses; // Breakdown of all expenses
  capitalExpenses: number; // One-time construction costs
  debt: number; // City debt from borrowing
  creditRating: CreditRating; // City's credit rating
  interestRate: number; // Interest rate on debt
  cashFlow: number; // Monthly cash flow (income - expenses)
  financialHistory: FinancialRecord[]; // Historical financial data
  budgetAlerts: BudgetAlert[]; // Financial warnings and alerts

  // City services
  education: number; // 0-100 education level
  healthcare: number; // 0-100 healthcare coverage
  safety: number; // 0-100 safety level

  // Crime system
  averageCrimeScore: number; // 0-100 city-wide average crime
  totalCrimeIncidents: number; // Total crime incidents per month
  crimeByType: Record<CrimeType, number>; // Crime incidents by type
  policeCoverage: number; // 0-100 percentage of city with police coverage
  crimeReductionRate: number; // Monthly crime reduction/increase rate
  criminalJusticeSpending: number; // Monthly spending on police/justice

  // Environmental
  pollution: number; // 0-100 overall pollution
  greenSpace: number; // Percentage of green space

  // Infrastructure
  trafficFlow: number; // 0-100 traffic efficiency

  // Public Transit
  transitCoverage: number; // 0-100 percentage of city with transit access
  transitRidership: number; // Total daily transit riders
  transitEfficiency: number; // 0-100 transit system efficiency

  // Industrial System
  industrialProduction: number; // Total industrial output
  supplyChainEfficiency: number; // 0-100 supply chain efficiency
  cargoTraffic: number; // Daily cargo vehicles
  externalTrade: number; // Trade with neighboring cities
  warehouseUtilization: number; // 0-100 warehouse capacity usage

  // Zoning and Land Value System
  averageLandValue: number; // City-wide average land value
  totalZonedLand: number; // Total zoned parcels
  residentialDemand: number; // 0-100 demand for residential zoning
  commercialDemand: number; // 0-100 demand for commercial zoning
  industrialDemand: number; // 0-100 demand for industrial zoning
  developmentRate: number; // Rate of new construction per year
  propertyTaxRevenue: number; // Annual property tax income
  landValueAppreciation: number; // Annual land value growth rate
  simulationYear: number; // Current simulation year for annual updates
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
  [BuildingType.FIRE_STATION]: { budget: 600, power: 2, water: 1 },

  // New buildings
  [BuildingType.PARK]: { budget: 200, water: 1 },
  [BuildingType.LIBRARY]: { budget: 400, power: 2, water: 1 },
  [BuildingType.UNIVERSITY]: { budget: 1200, power: 4, water: 2 },
  [BuildingType.WASTE_FACILITY]: { budget: 700, power: 3, water: 1 },
  [BuildingType.BUS_STOP]: { budget: 100, power: 1 },
  [BuildingType.SUBWAY_STATION]: { budget: 2000, power: 5, water: 1 },
  [BuildingType.CITY_HALL]: { budget: 1500, power: 3, water: 2 },
  [BuildingType.STADIUM]: { budget: 3000, power: 8, water: 4 },

  // Power infrastructure
  [BuildingType.POWER_LINE]: { budget: 25 },
  [BuildingType.POWER_SUBSTATION]: { budget: 300, power: 2 },

  // Transportation infrastructure
  [BuildingType.HIGHWAY]: { budget: 150 },
  [BuildingType.BRIDGE]: { budget: 500 },
  [BuildingType.TRAFFIC_LIGHT]: { budget: 75, power: 1 },

  // Public Transit System
  [BuildingType.TRAIN_STATION]: { budget: 3500, power: 8, water: 3 },
  [BuildingType.SUBWAY_TRACK]: { budget: 200, power: 2 },
  [BuildingType.TRAIN_TRACK]: { budget: 300, power: 1 },
  [BuildingType.TRANSIT_HUB]: { budget: 5000, power: 12, water: 4 },
  [BuildingType.MONORAIL_STATION]: { budget: 2500, power: 6, water: 2 },
  [BuildingType.MONORAIL_TRACK]: { budget: 400, power: 3 },

  // Industrial & Shipping System
  [BuildingType.CARGO_TERMINAL]: { budget: 4000, power: 10, water: 2 },
  [BuildingType.WAREHOUSE]: { budget: 1500, power: 4, water: 1 },
  [BuildingType.FACTORY]: { budget: 2500, power: 8, water: 3 },
  [BuildingType.MINING_FACILITY]: { budget: 3000, power: 12, water: 2 },
  [BuildingType.OIL_REFINERY]: { budget: 8000, power: 20, water: 8 },
  [BuildingType.STEEL_MILL]: { budget: 6000, power: 18, water: 6 },
  [BuildingType.CHEMICAL_PLANT]: { budget: 7000, power: 16, water: 10 },
  [BuildingType.FOOD_PROCESSING]: { budget: 3500, power: 8, water: 12 },
  [BuildingType.ELECTRONICS_FACTORY]: { budget: 5000, power: 15, water: 4 },
  [BuildingType.SHIPPING_DOCK]: { budget: 6000, power: 12, water: 4 },
  [BuildingType.FREIGHT_RAIL_TERMINAL]: { budget: 5500, power: 14, water: 3 },
  [BuildingType.HIGHWAY_CONNECTION]: { budget: 2000, power: 2 },
  [BuildingType.RAIL_CONNECTION]: { budget: 3000, power: 4 }
};
