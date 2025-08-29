import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GridCell, ZoneType, BuildingType, CityResources, Position } from "../../types/city";
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
  pollution: 0
});

const initialResources: CityResources = {
  budget: 10000,
  power: 0,
  powerCapacity: 0,
  water: 0,
  waterCapacity: 0,
  population: 0,
  happiness: 50
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
      
      // Check costs
      const cost = buildingType === BuildingType.ROAD ? 50 :
        buildingType === BuildingType.POWER_PLANT ? 1000 :
        buildingType === BuildingType.WATER_FACILITY ? 800 : 600;
      
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
