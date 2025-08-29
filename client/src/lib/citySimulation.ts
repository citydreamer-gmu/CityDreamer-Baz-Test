import { GridCell, ZoneType, BuildingType, CityResources } from "../types/city";

export class CitySimulation {
  static updateCity(grid: GridCell[][], resources: CityResources): { grid: GridCell[][], resources: CityResources } {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const newResources = { ...resources };
    
    // Update infrastructure connectivity
    this.updateInfrastructure(newGrid);
    
    // Calculate population and development
    this.updatePopulation(newGrid, newResources);
    
    // Calculate happiness
    this.updateHappiness(newGrid);
    
    // Update resources
    this.updateResourceConsumption(newGrid, newResources);
    
    // Generate income
    this.generateIncome(newGrid, newResources);
    
    return { grid: newGrid, resources: newResources };
  }
  
  private static updateInfrastructure(grid: GridCell[][]) {
    // Reset infrastructure flags
    grid.forEach(row => {
      row.forEach(cell => {
        cell.hasRoad = cell.buildingType === BuildingType.ROAD;
        cell.hasPower = false;
        cell.hasWater = false;
      });
    });
    
    // Propagate roads
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        if (cell.buildingType === BuildingType.ROAD) {
          this.propagateRoad(grid, x, z, 3);
        }
      });
    });
    
    // Propagate power from power plants
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        if (cell.buildingType === BuildingType.POWER_PLANT) {
          this.propagatePower(grid, x, z, 5);
        }
      });
    });
    
    // Propagate water from water facilities
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        if (cell.buildingType === BuildingType.WATER_FACILITY) {
          this.propagateWater(grid, x, z, 4);
        }
      });
    });
  }
  
  private static propagateRoad(grid: GridCell[][], startX: number, startZ: number, range: number) {
    for (let x = Math.max(0, startX - range); x <= Math.min(grid.length - 1, startX + range); x++) {
      for (let z = Math.max(0, startZ - range); z <= Math.min(grid[0].length - 1, startZ + range); z++) {
        const distance = Math.abs(x - startX) + Math.abs(z - startZ);
        if (distance <= range) {
          grid[x][z].hasRoad = true;
        }
      }
    }
  }
  
  private static propagatePower(grid: GridCell[][], startX: number, startZ: number, range: number) {
    for (let x = Math.max(0, startX - range); x <= Math.min(grid.length - 1, startX + range); x++) {
      for (let z = Math.max(0, startZ - range); z <= Math.min(grid[0].length - 1, startZ + range); z++) {
        const distance = Math.abs(x - startX) + Math.abs(z - startZ);
        if (distance <= range) {
          grid[x][z].hasPower = true;
        }
      }
    }
  }
  
  private static propagateWater(grid: GridCell[][], startX: number, startZ: number, range: number) {
    for (let x = Math.max(0, startX - range); x <= Math.min(grid.length - 1, startX + range); x++) {
      for (let z = Math.max(0, startZ - range); z <= Math.min(grid[0].length - 1, startZ + range); z++) {
        const distance = Math.abs(x - startX) + Math.abs(z - startZ);
        if (distance <= range) {
          grid[x][z].hasWater = true;
        }
      }
    }
  }
  
  private static updatePopulation(grid: GridCell[][], resources: CityResources) {
    let totalPopulation = 0;
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.zoneType === ZoneType.RESIDENTIAL) {
          // Growth based on infrastructure and happiness
          const growthFactor = (cell.hasRoad ? 0.3 : 0) + 
                             (cell.hasPower ? 0.3 : 0) + 
                             (cell.hasWater ? 0.3 : 0) + 
                             (cell.happiness / 1000);
          
          if (cell.developmentLevel < 3 && Math.random() < growthFactor) {
            cell.developmentLevel = Math.min(3, cell.developmentLevel + 0.1);
          }
          
          cell.population = Math.floor(cell.developmentLevel * 10);
          totalPopulation += cell.population;
        } else if (cell.zoneType === ZoneType.COMMERCIAL) {
          // Commercial zones need residential nearby
          const nearbyResidential = this.countNearbyZones(grid, cell.position.x, cell.position.z, ZoneType.RESIDENTIAL, 3);
          if (nearbyResidential > 0 && cell.hasRoad && Math.random() < 0.1) {
            cell.developmentLevel = Math.min(3, cell.developmentLevel + 0.05);
          }
        } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
          // Industrial zones develop based on commercial demand
          const nearbyCommercial = this.countNearbyZones(grid, cell.position.x, cell.position.z, ZoneType.COMMERCIAL, 4);
          if (nearbyCommercial > 0 && cell.hasRoad && Math.random() < 0.08) {
            cell.developmentLevel = Math.min(3, cell.developmentLevel + 0.03);
          }
          // Industrial zones create pollution
          cell.pollution = Math.min(100, cell.developmentLevel * 20);
        }
      });
    });
    
    resources.population = totalPopulation;
  }
  
  private static updateHappiness(grid: GridCell[][]) {
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.zoneType !== ZoneType.EMPTY) {
          let happiness = 50; // Base happiness
          
          // Infrastructure bonuses
          if (cell.hasRoad) happiness += 10;
          if (cell.hasPower) happiness += 15;
          if (cell.hasWater) happiness += 15;
          
          // Service proximity bonuses
          const nearbySchools = this.countNearbyBuildings(grid, cell.position.x, cell.position.z, BuildingType.SCHOOL, 5);
          const nearbyHospitals = this.countNearbyBuildings(grid, cell.position.x, cell.position.z, BuildingType.HOSPITAL, 6);
          const nearbyPolice = this.countNearbyBuildings(grid, cell.position.x, cell.position.z, BuildingType.POLICE_STATION, 7);
          
          happiness += Math.min(15, nearbySchools * 5);
          happiness += Math.min(10, nearbyHospitals * 5);
          happiness += Math.min(10, nearbyPolice * 3);
          
          // Pollution penalty
          const nearbyPollution = this.calculateNearbyPollution(grid, cell.position.x, cell.position.z, 4);
          happiness -= nearbyPollution;
          
          cell.happiness = Math.max(0, Math.min(100, happiness));
        }
      });
    });
  }
  
  private static updateResourceConsumption(grid: GridCell[][], resources: CityResources) {
    let powerUsed = 0;
    let waterUsed = 0;
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.zoneType === ZoneType.RESIDENTIAL) {
          powerUsed += cell.developmentLevel;
          waterUsed += cell.developmentLevel;
        } else if (cell.zoneType === ZoneType.COMMERCIAL) {
          powerUsed += cell.developmentLevel * 2;
          waterUsed += cell.developmentLevel;
        } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
          powerUsed += cell.developmentLevel * 3;
          waterUsed += cell.developmentLevel * 2;
        }
        
        if (cell.buildingType && cell.buildingType !== BuildingType.ROAD) {
          powerUsed += 2;
          waterUsed += 1;
        }
      });
    });
    
    resources.power = Math.max(0, resources.powerCapacity - powerUsed);
    resources.water = Math.max(0, resources.waterCapacity - waterUsed);
  }
  
  private static generateIncome(grid: GridCell[][], resources: CityResources) {
    let income = 0;
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.zoneType === ZoneType.RESIDENTIAL && cell.population) {
          income += cell.population * 5; // Tax per person
        } else if (cell.zoneType === ZoneType.COMMERCIAL) {
          income += cell.developmentLevel * 20; // Business tax
        } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
          income += cell.developmentLevel * 30; // Industrial tax
        }
      });
    });
    
    resources.budget += income;
    
    // Calculate average happiness
    let totalHappiness = 0;
    let cellsWithHappiness = 0;
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.zoneType !== ZoneType.EMPTY) {
          totalHappiness += cell.happiness;
          cellsWithHappiness++;
        }
      });
    });
    
    resources.happiness = cellsWithHappiness > 0 ? totalHappiness / cellsWithHappiness : 50;
  }
  
  private static countNearbyZones(grid: GridCell[][], x: number, z: number, zoneType: ZoneType, range: number): number {
    let count = 0;
    for (let dx = -range; dx <= range; dx++) {
      for (let dz = -range; dz <= range; dz++) {
        const nx = x + dx;
        const nz = z + dz;
        if (nx >= 0 && nx < grid.length && nz >= 0 && nz < grid[0].length) {
          if (grid[nx][nz].zoneType === zoneType) {
            count++;
          }
        }
      }
    }
    return count;
  }
  
  private static countNearbyBuildings(grid: GridCell[][], x: number, z: number, buildingType: BuildingType, range: number): number {
    let count = 0;
    for (let dx = -range; dx <= range; dx++) {
      for (let dz = -range; dz <= range; dz++) {
        const nx = x + dx;
        const nz = z + dz;
        if (nx >= 0 && nx < grid.length && nz >= 0 && nz < grid[0].length) {
          if (grid[nx][nz].buildingType === buildingType) {
            count++;
          }
        }
      }
    }
    return count;
  }
  
  private static calculateNearbyPollution(grid: GridCell[][], x: number, z: number, range: number): number {
    let pollution = 0;
    for (let dx = -range; dx <= range; dx++) {
      for (let dz = -range; dz <= range; dz++) {
        const nx = x + dx;
        const nz = z + dz;
        if (nx >= 0 && nx < grid.length && nz >= 0 && nz < grid[0].length) {
          const distance = Math.abs(dx) + Math.abs(dz);
          pollution += grid[nx][nz].pollution / (distance + 1);
        }
      }
    }
    return Math.min(50, pollution / 10);
  }
}
