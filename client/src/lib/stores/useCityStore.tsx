import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GridCell, ZoneType, BuildingType, CityResources, Position, Direction, RoadType, TrafficFlow, TransitType, IndustryType, ResourceType } from "../../types/city";
import { getLocalStorage, setLocalStorage } from "../utils";

interface CityState {
  grid: GridCell[][];
  gridSize: number;
  resources: CityResources;
  selectedTool: ZoneType | BuildingType | null;
  isSimulationRunning: boolean;
  simulationSpeed: number;
  
  // Actions
  initializeGrid: () => void;
  setSelectedTool: (tool: ZoneType | BuildingType | null) => void;
  placeZone: (x: number, z: number, zoneType: ZoneType) => boolean;
  placeBuilding: (x: number, z: number, buildingType: BuildingType) => boolean;
  updateResources: (resources: Partial<CityResources>) => void;
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  saveCity: () => void;
  loadCity: () => void;
  resetCity: () => void;
}

const GRID_SIZE = 20;

const createEmptyCell = (x: number, z: number): GridCell => ({
  position: { x, z },
  zoneType: ZoneType.EMPTY,
  developmentLevel: 0,
  hasRoad: false,
  hasPower: false,
  hasWater: false,
  happiness: 50,
  pollution: 0,
  landValue: 50,
  trafficLevel: 0,
  accessibility: 0,
  educationAccess: 0,
  healthcareAccess: 0,
  safetyLevel: 50,
  powerDistance: 999,
  powerLineConnections: [],
  roadConnections: [],
  trafficFlow: { north: 0, south: 0, east: 0, west: 0, total: 0 },
  roadType: RoadType.NONE,
  commuterOrigins: [],
  commuterDestinations: [],
  leisureDestinations: [],
  transitAccess: 0,
  transitLines: [],
  transitType: TransitType.NONE,
  transitConnections: [],
  transitRidership: 0,
  industryType: IndustryType.NONE,
  inputResources: [],
  outputResources: [],
  productionLevel: 0,
  warehouseCapacity: 0,
  currentInventory: {},
  supplyChainConnections: [],
  industrialTraffic: 0,
  cargoFlow: { north: 0, south: 0, east: 0, west: 0 },
  
  // Zoning and Land Value System
  isZoned: false,
  zonedDate: 0,
  landValueHistory: [50],
  lastLandValueUpdate: 0,
  developmentPressure: 0,
  marketDemand: 50,
  constructionCost: 100,
  propertyTax: 0,
  appreciationRate: 0,
  zoningRestrictions: [],
  
  // Crime system
  crimeScore: 20,
  policeCoverage: 0,
  crimeType: 'none' as any,
  crimeHistory: [20],
  lastCrimeUpdate: 0,
  crimeFactors: [],
  
  // Financial System
  monthlyTaxRevenue: 0,
  monthlyOperatingCost: 0,
  businessRevenue: 0,
  employmentTax: 0,
  salesTaxRevenue: 0,
  maintenanceCost: 0,
  lastFinancialUpdate: 0
});

const initialResources: CityResources = {
  budget: 50000,
  power: 0,
  powerCapacity: 0,
  water: 0,
  waterCapacity: 0,
  population: 0,
  happiness: 50,
  
  // Economic metrics
  monthlyIncome: 0,
  monthlyExpenses: 0,
  unemployment: 0,
  
  // Detailed Financial System
  taxRevenue: {
    residential: 0,
    commercial: 0,
    industrial: 0,
    property: 0,
    sales: 0,
    transit: 0,
    utilities: 0,
    fees: 0,
    total: 0
  },
  operatingExpenses: {
    infrastructure: {
      roads: 0,
      power: 0,
      water: 0,
      transit: 0,
      waste: 0,
      total: 0
    },
    services: {
      education: 0,
      healthcare: 0,
      police: 0,
      fire: 0,
      parks: 0,
      libraries: 0,
      total: 0
    },
    administration: 0,
    debt: 0,
    emergency: 0,
    total: 0
  },
  capitalExpenses: 0,
  debt: 0,
  creditRating: 'A' as any,
  interestRate: 3.5,
  cashFlow: 0,
  financialHistory: [],
  budgetAlerts: [],
  
  // City services
  education: 50,
  healthcare: 50,
  safety: 50,
  
  // Crime system
  averageCrimeScore: 20,
  totalCrimeIncidents: 0,
  crimeByType: {
    none: 0,
    petty_theft: 0,
    burglary: 0,
    vandalism: 0,
    drug_related: 0,
    violent_crime: 0,
    organized_crime: 0,
    white_collar: 0
  } as any,
  policeCoverage: 0,
  crimeReductionRate: 0,
  criminalJusticeSpending: 0,
  
  // Environmental
  pollution: 0,
  greenSpace: 0,
  
  // Infrastructure
  trafficFlow: 100,
  
  // Public Transit
  transitCoverage: 0,
  transitRidership: 0,
  transitEfficiency: 0,
  
  // Industrial System
  industrialProduction: 0,
  supplyChainEfficiency: 0,
  cargoTraffic: 0,
  externalTrade: 0,
  warehouseUtilization: 0,
  
  // Zoning and Land Value System
  averageLandValue: 50,
  totalZonedLand: 0,
  residentialDemand: 50,
  commercialDemand: 50,
  industrialDemand: 50,
  developmentRate: 0,
  propertyTaxRevenue: 0,
  landValueAppreciation: 2,
  simulationYear: 2024
};

export const useCityStore = create<CityState>()(
  subscribeWithSelector((set, get) => ({
    grid: [],
    gridSize: GRID_SIZE,
    resources: initialResources,
    selectedTool: null,
    isSimulationRunning: false,
    simulationSpeed: 1,
    
    initializeGrid: () => {
      const grid: GridCell[][] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        grid[x] = [];
        for (let z = 0; z < GRID_SIZE; z++) {
          grid[x][z] = createEmptyCell(x, z);
        }
      }
      set({ grid });
    },
    
    setSelectedTool: (tool) => set({ selectedTool: tool }),
    
    placeZone: (x, z, zoneType) => {
      const { grid, resources } = get();
      if (x < 0 || x >= GRID_SIZE || z < 0 || z >= GRID_SIZE) return false;
      
      const cell = grid[x][z];
      if (cell.zoneType !== ZoneType.EMPTY || cell.buildingType) return false;
      
      // Check if we can afford it
      const cost = zoneType === ZoneType.EMPTY ? 0 : 
        zoneType === ZoneType.RESIDENTIAL ? 100 :
        zoneType === ZoneType.COMMERCIAL ? 200 : 300;
      
      if (resources.budget < cost) return false;
      
      const newGrid = [...grid];
      newGrid[x][z] = {
        ...cell,
        zoneType,
        developmentLevel: zoneType === ZoneType.EMPTY ? 0 : 1
      };
      
      set({ 
        grid: newGrid,
        resources: {
          ...resources,
          budget: resources.budget - cost
        }
      });
      
      return true;
    },
    
    placeBuilding: (x, z, buildingType) => {
      const { grid, resources } = get();
      if (x < 0 || x >= GRID_SIZE || z < 0 || z >= GRID_SIZE) return false;
      
      const cell = grid[x][z];
      if (cell.buildingType) return false;
      
      // Get building costs from the imported costs
      const buildingCosts = {
        [BuildingType.ROAD]: 50,
        [BuildingType.POWER_PLANT]: 1000,
        [BuildingType.WATER_FACILITY]: 800,
        [BuildingType.SCHOOL]: 500,
        [BuildingType.HOSPITAL]: 800,
        [BuildingType.POLICE_STATION]: 600,
        [BuildingType.FIRE_STATION]: 600,
        [BuildingType.PARK]: 200,
        [BuildingType.LIBRARY]: 400,
        [BuildingType.UNIVERSITY]: 1200,
        [BuildingType.WASTE_FACILITY]: 700,
        [BuildingType.BUS_STOP]: 100,
        [BuildingType.SUBWAY_STATION]: 2000,
        [BuildingType.CITY_HALL]: 1500,
        [BuildingType.STADIUM]: 3000,
        [BuildingType.POWER_LINE]: 25,
        [BuildingType.POWER_SUBSTATION]: 300,
        [BuildingType.HIGHWAY]: 150,
        [BuildingType.BRIDGE]: 500,
        [BuildingType.TRAFFIC_LIGHT]: 75,
        [BuildingType.TRAIN_STATION]: 3500,
        [BuildingType.SUBWAY_TRACK]: 200,
        [BuildingType.TRAIN_TRACK]: 300,
        [BuildingType.TRANSIT_HUB]: 5000,
        [BuildingType.MONORAIL_STATION]: 2500,
        [BuildingType.MONORAIL_TRACK]: 400,
        [BuildingType.CARGO_TERMINAL]: 4000,
        [BuildingType.WAREHOUSE]: 1500,
        [BuildingType.FACTORY]: 2500,
        [BuildingType.MINING_FACILITY]: 3000,
        [BuildingType.OIL_REFINERY]: 8000,
        [BuildingType.STEEL_MILL]: 6000,
        [BuildingType.CHEMICAL_PLANT]: 7000,
        [BuildingType.FOOD_PROCESSING]: 3500,
        [BuildingType.ELECTRONICS_FACTORY]: 5000,
        [BuildingType.SHIPPING_DOCK]: 6000,
        [BuildingType.FREIGHT_RAIL_TERMINAL]: 5500,
        [BuildingType.HIGHWAY_CONNECTION]: 2000,
        [BuildingType.RAIL_CONNECTION]: 3000
      };
      
      const cost = buildingCosts[buildingType] || 500;
      
      if (resources.budget < cost) return false;
      
      const newGrid = [...grid];
      newGrid[x][z] = {
        ...cell,
        buildingType,
        hasRoad: buildingType === BuildingType.ROAD || cell.hasRoad
      };
      
      // Update capacities
      let newResources = { ...resources, budget: resources.budget - cost };
      if (buildingType === BuildingType.POWER_PLANT) {
        newResources.powerCapacity += 50;
      }
      if (buildingType === BuildingType.WATER_FACILITY) {
        newResources.waterCapacity += 40;
      }
      
      set({ 
        grid: newGrid,
        resources: newResources
      });
      
      return true;
    },
    
    updateResources: (updates) => {
      const { resources } = get();
      set({ resources: { ...resources, ...updates } });
    },
    
    toggleSimulation: () => {
      const { isSimulationRunning } = get();
      set({ isSimulationRunning: !isSimulationRunning });
    },
    
    setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
    
    saveCity: () => {
      const { grid, resources } = get();
      setLocalStorage('citySimulation', { grid, resources });
    },
    
    loadCity: () => {
      const savedData = getLocalStorage('citySimulation');
      if (savedData && savedData.grid && savedData.resources) {
        set({ 
          grid: savedData.grid, 
          resources: savedData.resources 
        });
        return true;
      }
      return false;
    },
    
    resetCity: () => {
      get().initializeGrid();
      set({ resources: initialResources });
    }
  }))
);
