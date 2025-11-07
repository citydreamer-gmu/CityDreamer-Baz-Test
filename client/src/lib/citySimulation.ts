import { GridCell, ZoneType, BuildingType, CityResources, Position, Direction, RoadType, TrafficFlow, TransitType, TransitLine, TransitNetwork, IndustryType, ResourceType, SupplyChain, IndustrialBuilding, ExternalConnection, CrimeType, CrimeFactor, TaxRevenue, OperatingExpenses, InfrastructureExpenses, ServiceExpenses, FinancialRecord, BudgetAlert, BudgetAlertType, CreditRating } from "../types/city";

export class CitySimulation {
  static updateCity(grid: GridCell[][], resources: CityResources): { grid: GridCell[][], resources: CityResources } {
    const newGrid = grid.map(row => row.map(cell => ({ 
      ...cell,
      // Initialize new properties if they don't exist
      landValue: cell.landValue || 50,
      trafficLevel: cell.trafficLevel || 0,
      accessibility: cell.accessibility || 0,
      educationAccess: cell.educationAccess || 0,
      healthcareAccess: cell.healthcareAccess || 0,
      safetyLevel: cell.safetyLevel || 50,
      crimeScore: cell.crimeScore || 20,
      policeCoverage: cell.policeCoverage || 0,
      crimeType: cell.crimeType || CrimeType.NONE,
      crimeHistory: cell.crimeHistory || [20],
      lastCrimeUpdate: cell.lastCrimeUpdate || 0,
      crimeFactors: cell.crimeFactors || [],
      powerDistance: cell.powerDistance || 999,
      powerLineConnections: cell.powerLineConnections || [],
      roadConnections: cell.roadConnections || [],
      trafficFlow: cell.trafficFlow || { north: 0, south: 0, east: 0, west: 0, total: 0 },
      roadType: cell.roadType || 'none',
      commuterOrigins: cell.commuterOrigins || [],
      commuterDestinations: cell.commuterDestinations || [],
      leisureDestinations: cell.leisureDestinations || [],
      transitAccess: cell.transitAccess || 0,
      transitLines: cell.transitLines || [],
      transitType: cell.transitType || 'none',
      transitConnections: cell.transitConnections || [],
      transitRidership: cell.transitRidership || 0,
      industryType: cell.industryType || IndustryType.NONE,
      inputResources: cell.inputResources || [],
      outputResources: cell.outputResources || [],
      productionLevel: cell.productionLevel || 0,
      warehouseCapacity: cell.warehouseCapacity || 0,
      currentInventory: cell.currentInventory || {},
      supplyChainConnections: cell.supplyChainConnections || [],
      industrialTraffic: cell.industrialTraffic || 0,
      cargoFlow: cell.cargoFlow || { north: 0, south: 0, east: 0, west: 0 },
      isZoned: cell.isZoned || (cell.zoneType !== ZoneType.EMPTY),
      zonedDate: cell.zonedDate || 0,
      landValueHistory: cell.landValueHistory || [50],
      lastLandValueUpdate: cell.lastLandValueUpdate || 0,
      developmentPressure: cell.developmentPressure || 0,
      marketDemand: cell.marketDemand || 50,
      constructionCost: cell.constructionCost || 100,
      propertyTax: cell.propertyTax || 0,
      appreciationRate: cell.appreciationRate || 0,
      monthlyTaxRevenue: cell.monthlyTaxRevenue || 0,
      monthlyOperatingCost: cell.monthlyOperatingCost || 0,
      businessRevenue: cell.businessRevenue || 0,
      employmentTax: cell.employmentTax || 0,
      salesTaxRevenue: cell.salesTaxRevenue || 0,
      maintenanceCost: cell.maintenanceCost || 0,
      lastFinancialUpdate: cell.lastFinancialUpdate || 0,
      zoningRestrictions: cell.zoningRestrictions || []
    })));
    const newResources = { 
      ...resources,
      // Initialize new resource properties
      monthlyIncome: resources.monthlyIncome || 0,
      monthlyExpenses: resources.monthlyExpenses || 0,
      unemployment: resources.unemployment || 0,
      education: resources.education || 50,
      healthcare: resources.healthcare || 50,
      safety: resources.safety || 50,
      averageCrimeScore: resources.averageCrimeScore || 20,
      totalCrimeIncidents: resources.totalCrimeIncidents || 0,
      crimeByType: resources.crimeByType || {
        none: 0,
        petty_theft: 0,
        burglary: 0,
        vandalism: 0,
        drug_related: 0,
        violent_crime: 0,
        organized_crime: 0,
        white_collar: 0
      },
      policeCoverage: resources.policeCoverage || 0,
      crimeReductionRate: resources.crimeReductionRate || 0,
      criminalJusticeSpending: resources.criminalJusticeSpending || 0,
      taxRevenue: resources.taxRevenue || {
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
      operatingExpenses: resources.operatingExpenses || {
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
      capitalExpenses: resources.capitalExpenses || 0,
      debt: resources.debt || 0,
      creditRating: resources.creditRating || 'A',
      interestRate: resources.interestRate || 3.5,
      cashFlow: resources.cashFlow || 0,
      financialHistory: resources.financialHistory || [],
      budgetAlerts: resources.budgetAlerts || [],
      pollution: resources.pollution || 0,
      greenSpace: resources.greenSpace || 0,
      trafficFlow: resources.trafficFlow || 100,
      transitCoverage: resources.transitCoverage || 0,
      transitRidership: resources.transitRidership || 0,
      transitEfficiency: resources.transitEfficiency || 0,
      industrialProduction: resources.industrialProduction || 0,
      supplyChainEfficiency: resources.supplyChainEfficiency || 0,
      cargoTraffic: resources.cargoTraffic || 0,
      externalTrade: resources.externalTrade || 0,
      warehouseUtilization: resources.warehouseUtilization || 0,
      averageLandValue: resources.averageLandValue || 50,
      totalZonedLand: resources.totalZonedLand || 0,
      residentialDemand: resources.residentialDemand || 50,
      commercialDemand: resources.commercialDemand || 50,
      industrialDemand: resources.industrialDemand || 50,
      developmentRate: resources.developmentRate || 0,
      propertyTaxRevenue: resources.propertyTaxRevenue || 0,
      landValueAppreciation: resources.landValueAppreciation || 2,
      simulationYear: resources.simulationYear || 2024
    };
    
    // Update power grid system
    this.updatePowerGrid(newGrid);
    
    // Update road network and connections
    this.updateRoadNetwork(newGrid);
    
    // Update transit network
    this.updateTransitNetwork(newGrid, newResources);
    
    // Update industrial system and supply chains
    this.updateIndustrialSystem(newGrid, newResources);
    
    // Calculate commuting patterns (now includes transit)
    this.calculateCommutingPatterns(newGrid);
    
    // Calculate traffic flow based on commuting and leisure (reduced by transit)
    this.calculateTrafficFlow(newGrid);
    
    // Calculate industrial cargo traffic
    this.calculateCargoTraffic(newGrid);
    
    // Update infrastructure connectivity (legacy)
    this.updateInfrastructure(newGrid);
    
    // Calculate traffic and accessibility
    this.updateTrafficAndAccessibility(newGrid, newResources);
    
    // Update service coverage
    this.updateServiceCoverage(newGrid, newResources);
    
    // Update crime system
    this.updateCrimeSystem(newGrid, newResources);
    
    // Calculate land values
    this.updateLandValues(newGrid);
    
    // Calculate population and development
    this.updatePopulation(newGrid, newResources);
    
    // Update employment and economy
    this.updateEconomy(newGrid, newResources);
    
    // Calculate happiness
    this.updateHappiness(newGrid);
    
    // Update resources
    this.updateResourceConsumption(newGrid, newResources);
    
    // Update comprehensive financial system
    this.updateFinancialSystem(newGrid, newResources);
    
    // Update city-wide metrics
    this.updateCityMetrics(newGrid, newResources);
    
    // Calculate city-wide demand for zoning
    this.calculateCityWideDemand(newGrid, newResources);
    
    // Update zoning and land values (annual calculation)
    this.updateZoningAndLandValues(newGrid, newResources);
    
    // Process development based on land values
    this.processDevelopment(newGrid, newResources);
    
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
          totalPopulation += cell.population || 0;
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
          
          // Service access bonuses
          happiness += cell.educationAccess * 0.2;
          happiness += cell.healthcareAccess * 0.15;
          happiness += cell.safetyLevel * 0.1;
          
          // Land value bonus (higher land value = better area)
          happiness += (cell.landValue - 50) * 0.1;
          
          // Traffic penalty
          happiness -= cell.trafficLevel * 0.2;
          
          // Pollution penalty
          happiness -= cell.pollution * 0.3;
          
          // Green space bonus
          const nearbyParks = this.countNearbyBuildings(grid, cell.position.x, cell.position.z, BuildingType.PARK, 3);
          happiness += Math.min(15, nearbyParks * 8);
          
          // Entertainment bonus
          const nearbyStadiums = this.countNearbyBuildings(grid, cell.position.x, cell.position.z, BuildingType.STADIUM, 8);
          happiness += Math.min(10, nearbyStadiums * 10);
          
          // Accessibility bonus
          happiness += cell.accessibility * 0.1;
          
          // Transit access bonus
          happiness += cell.transitAccess * 0.15;
          
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

  private static updateTrafficAndAccessibility(grid: GridCell[][], resources: CityResources) {
    // Calculate road network efficiency
    let totalRoads = 0;
    let connectedRoads = 0;
    
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        if (cell.buildingType === BuildingType.ROAD) {
          totalRoads++;
          // Check if road is connected to other roads
          const connectedSides = this.getConnectedRoads(grid, x, z);
          if (connectedSides > 1) connectedRoads++;
        }
        
        // Calculate accessibility for each cell
        const nearbyRoads = this.countNearbyBuildings(grid, x, z, BuildingType.ROAD, 2);
        const nearbyTransit = this.countNearbyBuildings(grid, x, z, BuildingType.BUS_STOP, 3) +
                             this.countNearbyBuildings(grid, x, z, BuildingType.SUBWAY_STATION, 5) * 2;
        
        cell.accessibility = Math.min(100, (nearbyRoads * 20) + (nearbyTransit * 15));
        
        // Calculate traffic level based on development and accessibility
        if (cell.zoneType !== ZoneType.EMPTY) {
          const trafficGenerated = cell.developmentLevel * 10;
          const trafficCapacity = cell.accessibility;
          cell.trafficLevel = Math.min(100, Math.max(0, trafficGenerated - trafficCapacity));
        }
      });
    });
    
    resources.trafficFlow = totalRoads > 0 ? (connectedRoads / totalRoads) * 100 : 100;
  }

  private static getConnectedRoads(grid: GridCell[][], x: number, z: number): number {
    let connections = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    directions.forEach(([dx, dz]) => {
      const nx = x + dx;
      const nz = z + dz;
      if (nx >= 0 && nx < grid.length && nz >= 0 && nz < grid[0].length) {
        if (grid[nx][nz].buildingType === BuildingType.ROAD) {
          connections++;
        }
      }
    });
    
    return connections;
  }

  private static updateServiceCoverage(grid: GridCell[][], resources: CityResources) {
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        // Education access
        const nearbySchools = this.countNearbyBuildings(grid, x, z, BuildingType.SCHOOL, 4);
        const nearbyLibraries = this.countNearbyBuildings(grid, x, z, BuildingType.LIBRARY, 3);
        const nearbyUniversities = this.countNearbyBuildings(grid, x, z, BuildingType.UNIVERSITY, 8);
        
        cell.educationAccess = Math.min(100, 
          (nearbySchools * 25) + (nearbyLibraries * 15) + (nearbyUniversities * 30)
        );
        
        // Healthcare access
        const nearbyHospitals = this.countNearbyBuildings(grid, x, z, BuildingType.HOSPITAL, 6);
        cell.healthcareAccess = Math.min(100, nearbyHospitals * 40);
        
        // Safety level
        const nearbyPolice = this.countNearbyBuildings(grid, x, z, BuildingType.POLICE_STATION, 5);
        const nearbyFire = this.countNearbyBuildings(grid, x, z, BuildingType.FIRE_STATION, 4);
        
        cell.safetyLevel = Math.min(100, 30 + (nearbyPolice * 20) + (nearbyFire * 15));
      });
    });
  }

  private static updateLandValues(grid: GridCell[][]) {
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        let landValue = 50; // Base land value
        
        // Proximity bonuses
        const nearbyParks = this.countNearbyBuildings(grid, x, z, BuildingType.PARK, 3);
        const nearbyCommercial = this.countNearbyZones(grid, x, z, ZoneType.COMMERCIAL, 2);
        const nearbyIndustrial = this.countNearbyZones(grid, x, z, ZoneType.INDUSTRIAL, 4);
        
        landValue += nearbyParks * 15; // Parks increase land value
        landValue += nearbyCommercial * 5; // Commercial areas increase value
        landValue -= nearbyIndustrial * 8; // Industrial areas decrease value
        
        // Infrastructure bonuses
        if (cell.hasRoad) landValue += 10;
        if (cell.hasPower) landValue += 8;
        if (cell.hasWater) landValue += 8;
        
        // Service bonuses
        landValue += cell.educationAccess * 0.2;
        landValue += cell.healthcareAccess * 0.15;
        landValue += cell.safetyLevel * 0.1;
        
        // Pollution penalty
        landValue -= cell.pollution * 0.5;
        
        // Traffic penalty
        landValue -= cell.trafficLevel * 0.3;
        
        // Transit access bonus
        landValue += cell.transitAccess * 0.25;
        
        cell.landValue = Math.max(10, Math.min(200, landValue));
      });
    });
  }

  private static updateEconomy(grid: GridCell[][], resources: CityResources) {
    let totalJobs = 0;
    let totalWorkers = 0;
    
    grid.forEach(row => {
      row.forEach(cell => {
        // Reset job/worker counts
        cell.jobs = 0;
        cell.workers = 0;
        
        if (cell.zoneType === ZoneType.COMMERCIAL) {
          cell.jobs = Math.floor(cell.developmentLevel * 8);
          cell.workers = Math.floor(cell.developmentLevel * 2);
        } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
          cell.jobs = Math.floor(cell.developmentLevel * 12);
          cell.workers = Math.floor(cell.developmentLevel * 3);
        } else if (cell.zoneType === ZoneType.RESIDENTIAL) {
          cell.workers = Math.floor((cell.population || 0) * 0.6); // 60% of population works
        }
        
        totalJobs += cell.jobs || 0;
        totalWorkers += cell.workers || 0;
      });
    });
    
    // Calculate unemployment
    resources.unemployment = totalWorkers > 0 ? 
      Math.max(0, ((totalWorkers - totalJobs) / totalWorkers) * 100) : 0;
  }

  private static updateFinancialSystem(grid: GridCell[][], resources: CityResources) {
    // Initialize financial tracking
    const taxRevenue: TaxRevenue = {
      residential: 0,
      commercial: 0,
      industrial: 0,
      property: 0,
      sales: 0,
      transit: 0,
      utilities: 0,
      fees: 0,
      total: 0
    };

    const infrastructureExpenses: InfrastructureExpenses = {
      roads: 0,
      power: 0,
      water: 0,
      transit: 0,
      waste: 0,
      total: 0
    };

    const serviceExpenses: ServiceExpenses = {
      education: 0,
      healthcare: 0,
      police: 0,
      fire: 0,
      parks: 0,
      libraries: 0,
      total: 0
    };

    // Calculate cell-level finances
    grid.forEach(row => {
      row.forEach(cell => {
        this.calculateCellFinances(cell, taxRevenue, infrastructureExpenses, serviceExpenses);
      });
    });

    // Calculate additional revenue sources
    this.calculateAdditionalRevenue(grid, taxRevenue, resources);

    // Calculate administrative and debt costs
    const administrationCost = Math.max(100, resources.population * 0.5); // Base admin cost
    const debtService = resources.debt * (resources.interestRate / 100) / 12; // Monthly debt payment

    // Compile operating expenses
    const operatingExpenses: OperatingExpenses = {
      infrastructure: infrastructureExpenses,
      services: serviceExpenses,
      administration: administrationCost,
      debt: debtService,
      emergency: Math.max(50, taxRevenue.total * 0.05), // 5% emergency fund
      total: infrastructureExpenses.total + serviceExpenses.total + administrationCost + debtService
    };

    // Calculate cash flow
    const cashFlow = taxRevenue.total - operatingExpenses.total;

    // Update resources
    resources.taxRevenue = taxRevenue;
    resources.operatingExpenses = operatingExpenses;
    resources.cashFlow = cashFlow;
    resources.monthlyIncome = taxRevenue.total;
    resources.monthlyExpenses = operatingExpenses.total;
    resources.budget += cashFlow;

    // Update credit rating based on financial health
    this.updateCreditRating(resources);

    // Generate budget alerts
    this.generateBudgetAlerts(resources);

    // Record financial history
    this.recordFinancialHistory(resources);
  }

  private static calculateCellFinances(
    cell: GridCell, 
    taxRevenue: TaxRevenue, 
    infrastructureExpenses: InfrastructureExpenses, 
    serviceExpenses: ServiceExpenses
  ) {
    // Reset cell financial data
    cell.monthlyTaxRevenue = 0;
    cell.monthlyOperatingCost = 0;
    cell.businessRevenue = 0;
    cell.employmentTax = 0;
    cell.salesTaxRevenue = 0;
    cell.maintenanceCost = 0;

    // Calculate zone-based tax revenue
    if (cell.zoneType === ZoneType.RESIDENTIAL && cell.population) {
      // Residential income tax (based on population and land value)
      const incomeTax = cell.population * 12 * (cell.landValue / 100);
      taxRevenue.residential += incomeTax;
      cell.monthlyTaxRevenue += incomeTax;
      cell.employmentTax = incomeTax;

      // Property tax
      const propertyTax = cell.propertyTax / 12; // Annual to monthly
      taxRevenue.property += propertyTax;
      cell.monthlyTaxRevenue += propertyTax;
    }

    if (cell.zoneType === ZoneType.COMMERCIAL && cell.jobs) {
      // Business tax
      const businessTax = cell.developmentLevel * 40 + (cell.jobs * 5);
      taxRevenue.commercial += businessTax;
      cell.monthlyTaxRevenue += businessTax;

      // Sales tax (based on commercial activity)
      const salesTax = cell.jobs * 8 * (cell.landValue / 100);
      taxRevenue.sales += salesTax;
      cell.salesTaxRevenue = salesTax;
      cell.monthlyTaxRevenue += salesTax;

      // Business revenue (for tracking)
      cell.businessRevenue = cell.jobs * 15 * (cell.developmentLevel + 1);
    }

    if (cell.zoneType === ZoneType.INDUSTRIAL && cell.jobs) {
      // Corporate tax
      const corporateTax = cell.developmentLevel * 60 + (cell.jobs * 4);
      taxRevenue.industrial += corporateTax;
      cell.monthlyTaxRevenue += corporateTax;

      // Industrial production tax
      const productionTax = cell.productionLevel * 2;
      taxRevenue.industrial += productionTax;
      cell.monthlyTaxRevenue += productionTax;

      // Business revenue (for tracking)
      cell.businessRevenue = cell.jobs * 20 * (cell.developmentLevel + 1);
    }

    // Calculate building maintenance costs
    if (cell.buildingType) {
      const maintenanceCost = this.getBuildingMaintenanceCost(cell.buildingType);
      cell.maintenanceCost = maintenanceCost;
      cell.monthlyOperatingCost += maintenanceCost;

      // Categorize expenses
      this.categorizeBuildingExpenses(cell.buildingType, maintenanceCost, infrastructureExpenses, serviceExpenses);
    }

    // Road maintenance based on traffic
    if (cell.buildingType === BuildingType.ROAD || cell.buildingType === BuildingType.HIGHWAY) {
      const trafficWear = cell.trafficLevel * 0.1; // Higher traffic = more wear
      const additionalCost = trafficWear;
      infrastructureExpenses.roads += additionalCost;
      cell.maintenanceCost += additionalCost;
      cell.monthlyOperatingCost += additionalCost;
    }
  }

  private static getBuildingMaintenanceCost(buildingType: BuildingType): number {
    const maintenanceCosts: Record<BuildingType, number> = {
      [BuildingType.ROAD]: 3,
      [BuildingType.POWER_PLANT]: 80,
      [BuildingType.WATER_FACILITY]: 60,
      [BuildingType.SCHOOL]: 45,
      [BuildingType.HOSPITAL]: 90,
      [BuildingType.POLICE_STATION]: 50,
      [BuildingType.FIRE_STATION]: 50,
      [BuildingType.PARK]: 20,
      [BuildingType.LIBRARY]: 35,
      [BuildingType.UNIVERSITY]: 120,
      [BuildingType.WASTE_FACILITY]: 65,
      [BuildingType.BUS_STOP]: 15,
      [BuildingType.SUBWAY_STATION]: 150,
      [BuildingType.TRAIN_STATION]: 200,
      [BuildingType.SUBWAY_TRACK]: 8,
      [BuildingType.TRAIN_TRACK]: 12,
      [BuildingType.TRANSIT_HUB]: 300,
      [BuildingType.MONORAIL_STATION]: 120,
      [BuildingType.MONORAIL_TRACK]: 18,
      [BuildingType.CITY_HALL]: 100,
      [BuildingType.STADIUM]: 180,
      [BuildingType.POWER_LINE]: 5,
      [BuildingType.POWER_SUBSTATION]: 40,
      [BuildingType.HIGHWAY]: 8,
      [BuildingType.BRIDGE]: 25,
      [BuildingType.TRAFFIC_LIGHT]: 12,
      [BuildingType.CARGO_TERMINAL]: 60,
      [BuildingType.WAREHOUSE]: 30,
      [BuildingType.FACTORY]: 50,
      [BuildingType.MINING_FACILITY]: 70,
      [BuildingType.OIL_REFINERY]: 120,
      [BuildingType.STEEL_MILL]: 100,
      [BuildingType.CHEMICAL_PLANT]: 110,
      [BuildingType.FOOD_PROCESSING]: 45,
      [BuildingType.ELECTRONICS_FACTORY]: 75,
      [BuildingType.SHIPPING_DOCK]: 90,
      [BuildingType.FREIGHT_RAIL_TERMINAL]: 80,
      [BuildingType.HIGHWAY_CONNECTION]: 40,
      [BuildingType.RAIL_CONNECTION]: 50
    };

    return maintenanceCosts[buildingType] || 0;
  }

  private static categorizeBuildingExpenses(
    buildingType: BuildingType, 
    cost: number, 
    infrastructure: InfrastructureExpenses, 
    services: ServiceExpenses
  ) {
    // Infrastructure expenses
    if ([BuildingType.ROAD, BuildingType.HIGHWAY, BuildingType.BRIDGE, BuildingType.TRAFFIC_LIGHT].includes(buildingType)) {
      infrastructure.roads += cost;
    } else if ([BuildingType.POWER_PLANT, BuildingType.POWER_LINE, BuildingType.POWER_SUBSTATION].includes(buildingType)) {
      infrastructure.power += cost;
    } else if ([BuildingType.WATER_FACILITY].includes(buildingType)) {
      infrastructure.water += cost;
    } else if ([BuildingType.BUS_STOP, BuildingType.SUBWAY_STATION, BuildingType.TRAIN_STATION, 
               BuildingType.SUBWAY_TRACK, BuildingType.TRAIN_TRACK, BuildingType.TRANSIT_HUB,
               BuildingType.MONORAIL_STATION, BuildingType.MONORAIL_TRACK].includes(buildingType)) {
      infrastructure.transit += cost;
    } else if ([BuildingType.WASTE_FACILITY].includes(buildingType)) {
      infrastructure.waste += cost;
    }
    // Service expenses
    else if ([BuildingType.SCHOOL, BuildingType.UNIVERSITY].includes(buildingType)) {
      services.education += cost;
    } else if ([BuildingType.HOSPITAL].includes(buildingType)) {
      services.healthcare += cost;
    } else if ([BuildingType.POLICE_STATION].includes(buildingType)) {
      services.police += cost;
    } else if ([BuildingType.FIRE_STATION].includes(buildingType)) {
      services.fire += cost;
    } else if ([BuildingType.PARK, BuildingType.STADIUM].includes(buildingType)) {
      services.parks += cost;
    } else if ([BuildingType.LIBRARY].includes(buildingType)) {
      services.libraries += cost;
    }

    // Update totals
    infrastructure.total = infrastructure.roads + infrastructure.power + infrastructure.water + 
                          infrastructure.transit + infrastructure.waste;
    services.total = services.education + services.healthcare + services.police + 
                    services.fire + services.parks + services.libraries;
  }

  private static calculateAdditionalRevenue(grid: GridCell[][], taxRevenue: TaxRevenue, resources: CityResources) {
    // Transit fare revenue
    taxRevenue.transit = resources.transitRidership * 2.5; // $2.50 per ride

    // Utility revenue (water, power)
    let utilityRevenue = 0;
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.hasWater) utilityRevenue += 5; // Water bill
        if (cell.hasPower) utilityRevenue += 8; // Electric bill
      });
    });
    taxRevenue.utilities = utilityRevenue;

    // City fees (permits, licenses, etc.)
    taxRevenue.fees = Math.max(50, resources.population * 0.3);

    // Update total
    taxRevenue.total = taxRevenue.residential + taxRevenue.commercial + taxRevenue.industrial + 
                      taxRevenue.property + taxRevenue.sales + taxRevenue.transit + 
                      taxRevenue.utilities + taxRevenue.fees;
  }

  private static updateCreditRating(resources: CityResources) {
    let score = 100; // Start with perfect score

    // Debt-to-income ratio
    const debtRatio = resources.debt / (resources.monthlyIncome * 12);
    if (debtRatio > 0.8) score -= 30;
    else if (debtRatio > 0.6) score -= 20;
    else if (debtRatio > 0.4) score -= 10;

    // Cash flow
    if (resources.cashFlow < 0) score -= 25;
    else if (resources.cashFlow < resources.monthlyIncome * 0.1) score -= 10;

    // Budget balance
    if (resources.budget < 0) score -= 20;
    else if (resources.budget < resources.monthlyExpenses) score -= 10;

    // Determine credit rating
    if (score >= 95) resources.creditRating = CreditRating.AAA;
    else if (score >= 90) resources.creditRating = CreditRating.AA;
    else if (score >= 80) resources.creditRating = CreditRating.A;
    else if (score >= 70) resources.creditRating = CreditRating.BBB;
    else if (score >= 60) resources.creditRating = CreditRating.BB;
    else if (score >= 50) resources.creditRating = CreditRating.B;
    else if (score >= 40) resources.creditRating = CreditRating.CCC;
    else if (score >= 30) resources.creditRating = CreditRating.CC;
    else if (score >= 20) resources.creditRating = CreditRating.C;
    else resources.creditRating = CreditRating.D;

    // Update interest rate based on credit rating
    const rateMap: Record<string, number> = {
      'AAA': 2.5, 'AA': 3.0, 'A': 3.5, 'BBB': 4.0, 'BB': 5.0,
      'B': 6.5, 'CCC': 8.0, 'CC': 10.0, 'C': 12.0, 'D': 15.0
    };
    resources.interestRate = rateMap[resources.creditRating] || 15.0;
  }

  private static generateBudgetAlerts(resources: CityResources) {
    resources.budgetAlerts = [];

    // Low funds alert
    if (resources.budget < resources.monthlyExpenses * 2) {
      resources.budgetAlerts.push({
        type: BudgetAlertType.LOW_FUNDS,
        severity: resources.budget < resources.monthlyExpenses ? 'critical' : 'high',
        message: `Low funds: Only ${Math.round(resources.budget / resources.monthlyExpenses * 10) / 10} months of expenses remaining`,
        recommendation: 'Increase tax revenue or reduce expenses',
        cost: 0
      });
    }

    // Deficit alert
    if (resources.cashFlow < 0) {
      resources.budgetAlerts.push({
        type: BudgetAlertType.DEFICIT,
        severity: 'high',
        message: `Monthly deficit of $${Math.abs(resources.cashFlow).toLocaleString()}`,
        recommendation: 'Balance budget by increasing revenue or cutting costs',
        cost: Math.abs(resources.cashFlow)
      });
    }

    // High debt alert
    const debtRatio = resources.debt / (resources.monthlyIncome * 12);
    if (debtRatio > 0.6) {
      resources.budgetAlerts.push({
        type: BudgetAlertType.HIGH_DEBT,
        severity: debtRatio > 0.8 ? 'critical' : 'high',
        message: `High debt ratio: ${Math.round(debtRatio * 100)}% of annual income`,
        recommendation: 'Focus on debt reduction and revenue growth',
        cost: resources.debt * 0.1 // 10% debt reduction target
      });
    }

    // Credit rating alert
    if (['BB', 'B', 'CCC', 'CC', 'C', 'D'].includes(resources.creditRating)) {
      resources.budgetAlerts.push({
        type: BudgetAlertType.CREDIT_DOWNGRADE,
        severity: ['C', 'D'].includes(resources.creditRating) ? 'critical' : 'medium',
        message: `Credit rating downgraded to ${resources.creditRating}`,
        recommendation: 'Improve financial stability to restore credit rating',
        cost: 0
      });
    }
  }

  private static recordFinancialHistory(resources: CityResources) {
    const currentMonth = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 30)) % 12;
    const currentYear = resources.simulationYear;

    const record: FinancialRecord = {
      month: currentMonth,
      year: currentYear,
      income: resources.monthlyIncome,
      expenses: resources.monthlyExpenses,
      cashFlow: resources.cashFlow,
      budget: resources.budget,
      debt: resources.debt,
      population: resources.population
    };

    resources.financialHistory.push(record);

    // Keep only last 24 months of history
    if (resources.financialHistory.length > 24) {
      resources.financialHistory.shift();
    }
  }

  private static updateCityMetrics(grid: GridCell[][], resources: CityResources) {
    let totalEducation = 0;
    let totalHealthcare = 0;
    let totalSafety = 0;
    let totalPollution = 0;
    let totalCells = 0;
    let parkCells = 0;
    let totalTrafficFlow = 0;
    let roadCells = 0;
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.zoneType !== ZoneType.EMPTY || cell.buildingType) {
          totalEducation += cell.educationAccess;
          totalHealthcare += cell.healthcareAccess;
          totalSafety += cell.safetyLevel;
          totalPollution += cell.pollution;
          totalCells++;
        }
        
        if (cell.buildingType === BuildingType.PARK) {
          parkCells++;
        }
        
        if (cell.buildingType === BuildingType.ROAD || cell.buildingType === BuildingType.HIGHWAY) {
          totalTrafficFlow += (100 - cell.trafficLevel); // Higher traffic level = lower flow efficiency
          roadCells++;
        }
      });
    });
    
    if (totalCells > 0) {
      resources.education = totalEducation / totalCells;
      resources.healthcare = totalHealthcare / totalCells;
      resources.safety = totalSafety / totalCells;
      resources.pollution = totalPollution / totalCells;
    }
    
    // Calculate traffic flow efficiency
    if (roadCells > 0) {
      resources.trafficFlow = totalTrafficFlow / roadCells;
    }
    
    // Calculate green space percentage
    const totalGridCells = grid.length * grid[0].length;
    resources.greenSpace = (parkCells / totalGridCells) * 100;
  }

  private static updatePowerGrid(grid: GridCell[][]) {
    // Reset power distances
    grid.forEach(row => {
      row.forEach(cell => {
        cell.powerDistance = 999;
        cell.hasPower = false;
      });
    });

    // Find all power sources (plants and substations)
    const powerSources: Position[] = [];
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        if (cell.buildingType === BuildingType.POWER_PLANT || 
            cell.buildingType === BuildingType.POWER_SUBSTATION) {
          powerSources.push({ x, z });
          cell.powerDistance = 0;
          cell.hasPower = true;
        }
      });
    });

    // Propagate power through power lines using Dijkstra-like algorithm
    const queue: { pos: Position; distance: number }[] = powerSources.map(pos => ({ pos, distance: 0 }));
    const visited = new Set<string>();

    while (queue.length > 0) {
      queue.sort((a, b) => a.distance - b.distance);
      const current = queue.shift()!;
      const key = `${current.pos.x},${current.pos.z}`;
      
      if (visited.has(key)) continue;
      visited.add(key);

      const { x, z } = current.pos;
      const cell = grid[x][z];
      
      // Power can travel through power lines with no distance penalty
      // Or through adjacent cells with distance penalty
      const neighbors = [
        { x: x - 1, z, cost: cell.buildingType === BuildingType.POWER_LINE ? 0 : 1 },
        { x: x + 1, z, cost: cell.buildingType === BuildingType.POWER_LINE ? 0 : 1 },
        { x, z: z - 1, cost: cell.buildingType === BuildingType.POWER_LINE ? 0 : 1 },
        { x, z: z + 1, cost: cell.buildingType === BuildingType.POWER_LINE ? 0 : 1 }
      ];

      neighbors.forEach(neighbor => {
        if (neighbor.x >= 0 && neighbor.x < grid.length && 
            neighbor.z >= 0 && neighbor.z < grid[0].length) {
          
          const neighborCell = grid[neighbor.x][neighbor.z];
          const newDistance = current.distance + neighbor.cost;
          
          // Power can travel up to distance 8, or unlimited through power lines
          const maxDistance = neighborCell.buildingType === BuildingType.POWER_LINE ? 999 : 8;
          
          if (newDistance < neighborCell.powerDistance && newDistance <= maxDistance) {
            neighborCell.powerDistance = newDistance;
            neighborCell.hasPower = true;
            
            queue.push({ pos: { x: neighbor.x, z: neighbor.z }, distance: newDistance });
          }
        }
      });
    }
  }

  private static updateRoadNetwork(grid: GridCell[][]) {
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        cell.roadConnections = [];
        cell.roadType = RoadType.NONE;
        
        if (cell.buildingType === BuildingType.ROAD) {
          cell.roadType = RoadType.LOCAL_ROAD;
        } else if (cell.buildingType === BuildingType.HIGHWAY) {
          cell.roadType = RoadType.HIGHWAY;
        } else if (cell.buildingType === BuildingType.BRIDGE) {
          cell.roadType = RoadType.BRIDGE;
        }
        
        // Check connections to adjacent roads
        if (cell.roadType !== RoadType.NONE) {
          const directions = [
            { dx: -1, dz: 0, dir: 'north' as Direction },
            { dx: 1, dz: 0, dir: 'south' as Direction },
            { dx: 0, dz: -1, dir: 'west' as Direction },
            { dx: 0, dz: 1, dir: 'east' as Direction }
          ];
          
          directions.forEach(({ dx, dz, dir }) => {
            const nx = x + dx;
            const nz = z + dz;
            
            if (nx >= 0 && nx < grid.length && nz >= 0 && nz < grid[0].length) {
              const neighbor = grid[nx][nz];
              if (neighbor.buildingType === BuildingType.ROAD || 
                  neighbor.buildingType === BuildingType.HIGHWAY ||
                  neighbor.buildingType === BuildingType.BRIDGE) {
                cell.roadConnections.push(dir);
              }
            }
          });
        }
      });
    });
  }

  private static calculateCommutingPatterns(grid: GridCell[][]) {
    // Clear existing commuting data
    grid.forEach(row => {
      row.forEach(cell => {
        cell.commuterOrigins = [];
        cell.commuterDestinations = [];
        cell.leisureDestinations = [];
      });
    });

    // Find residential areas (origins) and job centers (destinations)
    const residentialAreas: Position[] = [];
    const jobCenters: Position[] = [];
    const leisureSpots: Position[] = [];

    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        if (cell.zoneType === ZoneType.RESIDENTIAL && cell.population && cell.population > 0) {
          residentialAreas.push({ x, z });
        }
        
        if ((cell.zoneType === ZoneType.COMMERCIAL || cell.zoneType === ZoneType.INDUSTRIAL) && 
            cell.jobs && cell.jobs > 0) {
          jobCenters.push({ x, z });
        }
        
        if (cell.buildingType === BuildingType.PARK || 
            cell.buildingType === BuildingType.STADIUM ||
            cell.buildingType === BuildingType.LIBRARY ||
            cell.zoneType === ZoneType.COMMERCIAL) {
          leisureSpots.push({ x, z });
        }
      });
    });

    // Calculate commuting patterns
    residentialAreas.forEach(home => {
      const homeCell = grid[home.x][home.z];
      
      // Find nearest job centers (up to 3)
      const nearbyJobs = jobCenters
        .map(job => ({
          pos: job,
          distance: Math.abs(home.x - job.x) + Math.abs(home.z - job.z)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
      
      nearbyJobs.forEach(job => {
        homeCell.commuterDestinations.push(job.pos);
        grid[job.pos.x][job.pos.z].commuterOrigins.push(home);
      });
      
      // Find leisure destinations (up to 2)
      const nearbyLeisure = leisureSpots
        .map(leisure => ({
          pos: leisure,
          distance: Math.abs(home.x - leisure.x) + Math.abs(home.z - leisure.z)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2);
      
      nearbyLeisure.forEach(leisure => {
        homeCell.leisureDestinations.push(leisure.pos);
      });
    });
  }

  private static calculateTrafficFlow(grid: GridCell[][]) {
    // Reset traffic flow
    grid.forEach(row => {
      row.forEach(cell => {
        cell.trafficFlow = { north: 0, south: 0, east: 0, west: 0, total: 0 };
      });
    });

    // Calculate traffic based on commuting patterns
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        if (cell.zoneType === ZoneType.RESIDENTIAL && cell.population) {
          // Transit reduces road traffic
          const transitReduction = (cell.transitAccess / 100) * 0.6; // Up to 60% reduction with good transit
          const trafficGenerated = (cell.population || 0) * 0.6 * (1 - transitReduction);
          
          // Morning commute to work
          cell.commuterDestinations.forEach(dest => {
            this.addTrafficAlongPath(grid, { x, z }, dest, trafficGenerated * 0.4);
          });
          
          // Evening commute back home
          cell.commuterDestinations.forEach(dest => {
            this.addTrafficAlongPath(grid, dest, { x, z }, trafficGenerated * 0.4);
          });
          
          // Leisure trips (weekends/evenings)
          cell.leisureDestinations.forEach(dest => {
            this.addTrafficAlongPath(grid, { x, z }, dest, trafficGenerated * 0.2);
            this.addTrafficAlongPath(grid, dest, { x, z }, trafficGenerated * 0.2);
          });
        }
      });
    });

    // Calculate traffic levels and congestion
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.buildingType === BuildingType.ROAD || 
            cell.buildingType === BuildingType.HIGHWAY ||
            cell.buildingType === BuildingType.BRIDGE) {
          
          cell.trafficFlow.total = cell.trafficFlow.north + cell.trafficFlow.south + 
                                  cell.trafficFlow.east + cell.trafficFlow.west;
          
          // Calculate congestion based on road capacity
          const roadCapacity = cell.buildingType === BuildingType.HIGHWAY ? 200 : 
                              cell.buildingType === BuildingType.BRIDGE ? 80 : 100;
          
          cell.trafficLevel = Math.min(100, (cell.trafficFlow.total / roadCapacity) * 100);
        }
      });
    });
  }

  private static addTrafficAlongPath(grid: GridCell[][], start: Position, end: Position, traffic: number) {
    // Simple pathfinding - move towards destination
    let current = { ...start };
    const visited = new Set<string>();
    
    while (current.x !== end.x || current.z !== end.z) {
      const key = `${current.x},${current.z}`;
      if (visited.has(key)) break; // Prevent infinite loops
      visited.add(key);
      
      const cell = grid[current.x][current.z];
      
      // Add traffic to current cell if it's a road
      if (cell.buildingType === BuildingType.ROAD || 
          cell.buildingType === BuildingType.HIGHWAY ||
          cell.buildingType === BuildingType.BRIDGE) {
        
        // Determine direction of travel
        if (current.x < end.x) {
          cell.trafficFlow.south += traffic;
        } else if (current.x > end.x) {
          cell.trafficFlow.north += traffic;
        }
        
        if (current.z < end.z) {
          cell.trafficFlow.east += traffic;
        } else if (current.z > end.z) {
          cell.trafficFlow.west += traffic;
        }
      }
      
      // Move towards destination
      if (current.x < end.x && current.x + 1 < grid.length) {
        current.x++;
      } else if (current.x > end.x && current.x - 1 >= 0) {
        current.x--;
      } else if (current.z < end.z && current.z + 1 < grid[0].length) {
        current.z++;
      } else if (current.z > end.z && current.z - 1 >= 0) {
        current.z--;
      } else {
        break; // Can't move closer
      }
    }
  }

  private static updateTransitNetwork(grid: GridCell[][], resources: CityResources) {
    // Reset transit properties
    grid.forEach(row => {
      row.forEach(cell => {
        cell.transitAccess = 0;
        cell.transitLines = [];
        cell.transitType = TransitType.NONE;
        cell.transitConnections = [];
        cell.transitRidership = 0;
      });
    });

    // Find all transit stations and tracks
    const transitStations: { pos: Position; type: TransitType; capacity: number }[] = [];

    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        const pos = { x, z };
        
        // Identify transit infrastructure
        if (cell.buildingType === BuildingType.BUS_STOP) {
          transitStations.push({ pos, type: TransitType.BUS, capacity: 50 });
          cell.transitType = TransitType.BUS;
        } else if (cell.buildingType === BuildingType.SUBWAY_STATION) {
          transitStations.push({ pos, type: TransitType.SUBWAY, capacity: 200 });
          cell.transitType = TransitType.SUBWAY;
        } else if (cell.buildingType === BuildingType.TRAIN_STATION) {
          transitStations.push({ pos, type: TransitType.TRAIN, capacity: 500 });
          cell.transitType = TransitType.TRAIN;
        } else if (cell.buildingType === BuildingType.MONORAIL_STATION) {
          transitStations.push({ pos, type: TransitType.MONORAIL, capacity: 150 });
          cell.transitType = TransitType.MONORAIL;
        } else if (cell.buildingType === BuildingType.TRANSIT_HUB) {
          transitStations.push({ pos, type: TransitType.SUBWAY, capacity: 800 });
          transitStations.push({ pos, type: TransitType.TRAIN, capacity: 800 });
          transitStations.push({ pos, type: TransitType.BUS, capacity: 200 });
          cell.transitType = TransitType.SUBWAY; // Primary type
        }
        
        // Identify transit tracks
        if (cell.buildingType === BuildingType.SUBWAY_TRACK) {
          cell.transitType = TransitType.SUBWAY;
        } else if (cell.buildingType === BuildingType.TRAIN_TRACK) {
          cell.transitType = TransitType.TRAIN;
        } else if (cell.buildingType === BuildingType.MONORAIL_TRACK) {
          cell.transitType = TransitType.MONORAIL;
        }
      });
    });

    // Calculate transit access for each cell
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        let maxAccess = 0;
        
        // Check access to different transit types
        const busAccess = this.calculateTransitAccess(grid, x, z, transitStations, TransitType.BUS, 3);
        const subwayAccess = this.calculateTransitAccess(grid, x, z, transitStations, TransitType.SUBWAY, 5);
        const trainAccess = this.calculateTransitAccess(grid, x, z, transitStations, TransitType.TRAIN, 8);
        const monorailAccess = this.calculateTransitAccess(grid, x, z, transitStations, TransitType.MONORAIL, 6);
        
        maxAccess = Math.max(busAccess, subwayAccess, trainAccess, monorailAccess);
        cell.transitAccess = maxAccess;
        
        // Calculate potential ridership from this cell
        if (cell.zoneType === ZoneType.RESIDENTIAL && cell.population && cell.population > 0) {
          // Higher transit access = more people use transit
          const transitUsageRate = (cell.transitAccess / 100) * 0.4; // Up to 40% use transit
          cell.transitRidership = Math.floor(cell.population * transitUsageRate);
        }
      });
    });

    // Update city-wide transit metrics
    this.updateTransitMetrics(grid, resources);
  }

  private static calculateTransitAccess(
    grid: GridCell[][], 
    x: number, 
    z: number, 
    stations: { pos: Position; type: TransitType; capacity: number }[], 
    transitType: TransitType, 
    maxRange: number
  ): number {
    let bestAccess = 0;
    
    stations
      .filter(station => station.type === transitType)
      .forEach(station => {
        const distance = Math.abs(x - station.pos.x) + Math.abs(z - station.pos.z);
        if (distance <= maxRange) {
          // Access decreases with distance
          const access = Math.max(0, 100 - (distance * (100 / maxRange)));
          bestAccess = Math.max(bestAccess, access);
        }
      });
    
    return bestAccess;
  }

  private static updateTransitMetrics(grid: GridCell[][], resources: CityResources) {
    let totalCells = 0;
    let cellsWithTransit = 0;
    let totalRidership = 0;
    let totalCapacity = 0;

    grid.forEach(row => {
      row.forEach(cell => {
        totalCells++;
        
        if (cell.transitAccess > 20) { // Minimum viable transit access
          cellsWithTransit++;
        }
        
        totalRidership += cell.transitRidership;
        
        // Calculate capacity based on transit infrastructure
        if (cell.buildingType === BuildingType.BUS_STOP) totalCapacity += 50;
        else if (cell.buildingType === BuildingType.SUBWAY_STATION) totalCapacity += 200;
        else if (cell.buildingType === BuildingType.TRAIN_STATION) totalCapacity += 500;
        else if (cell.buildingType === BuildingType.MONORAIL_STATION) totalCapacity += 150;
        else if (cell.buildingType === BuildingType.TRANSIT_HUB) totalCapacity += 1000;
      });
    });

    resources.transitCoverage = totalCells > 0 ? (cellsWithTransit / totalCells) * 100 : 0;
    resources.transitRidership = totalRidership;
    resources.transitEfficiency = totalCapacity > 0 ? Math.min(100, (totalRidership / totalCapacity) * 100) : 0;
  }

  private static updateIndustrialSystem(grid: GridCell[][], resources: CityResources) {
    // Reset industrial properties
    grid.forEach(row => {
      row.forEach(cell => {
        cell.industryType = IndustryType.NONE;
        cell.inputResources = [];
        cell.outputResources = [];
        cell.productionLevel = 0;
        cell.warehouseCapacity = 0;
        cell.currentInventory = {
          [ResourceType.RAW_MATERIALS]: 0,
          [ResourceType.STEEL]: 0,
          [ResourceType.OIL]: 0,
          [ResourceType.CHEMICALS]: 0,
          [ResourceType.ELECTRONICS]: 0,
          [ResourceType.FOOD]: 0,
          [ResourceType.MANUFACTURED_GOODS]: 0
        };
        cell.supplyChainConnections = [];
        cell.industrialTraffic = 0;
        cell.cargoFlow = { north: 0, south: 0, east: 0, west: 0 };
      });
    });

    // Identify industrial buildings and set their properties
    const industrialBuildings: IndustrialBuilding[] = [];
    
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        const pos = { x, z };
        
        // Set industrial properties based on building type
        if (cell.buildingType === BuildingType.MINING_FACILITY) {
          cell.industryType = IndustryType.RAW_MATERIALS;
          cell.outputResources = [ResourceType.RAW_MATERIALS];
          cell.warehouseCapacity = 1000;
          cell.productionLevel = cell.hasPower ? 80 : 20;
          // Initialize some inventory for raw materials
          cell.currentInventory = { 
            [ResourceType.RAW_MATERIALS]: 100,
            [ResourceType.STEEL]: 0,
            [ResourceType.OIL]: 0,
            [ResourceType.CHEMICALS]: 0,
            [ResourceType.ELECTRONICS]: 0,
            [ResourceType.FOOD]: 0,
            [ResourceType.MANUFACTURED_GOODS]: 0
          };
        } else if (cell.buildingType === BuildingType.OIL_REFINERY) {
          cell.industryType = IndustryType.PROCESSING;
          cell.inputResources = [ResourceType.OIL];
          cell.outputResources = [ResourceType.CHEMICALS];
          cell.warehouseCapacity = 800;
          cell.productionLevel = cell.hasPower ? 85 : 15;
          // Initialize some oil inventory
          cell.currentInventory = { 
            [ResourceType.RAW_MATERIALS]: 0,
            [ResourceType.STEEL]: 0,
            [ResourceType.OIL]: 50,
            [ResourceType.CHEMICALS]: 25,
            [ResourceType.ELECTRONICS]: 0,
            [ResourceType.FOOD]: 0,
            [ResourceType.MANUFACTURED_GOODS]: 0
          };
        } else if (cell.buildingType === BuildingType.STEEL_MILL) {
          cell.industryType = IndustryType.PROCESSING;
          cell.inputResources = [ResourceType.RAW_MATERIALS];
          cell.outputResources = [ResourceType.STEEL];
          cell.warehouseCapacity = 1200;
          cell.productionLevel = cell.hasPower ? 75 : 10;
        } else if (cell.buildingType === BuildingType.CHEMICAL_PLANT) {
          cell.industryType = IndustryType.PROCESSING;
          cell.inputResources = [ResourceType.OIL, ResourceType.RAW_MATERIALS];
          cell.outputResources = [ResourceType.CHEMICALS];
          cell.warehouseCapacity = 600;
          cell.productionLevel = cell.hasPower ? 70 : 5;
        } else if (cell.buildingType === BuildingType.ELECTRONICS_FACTORY) {
          cell.industryType = IndustryType.MANUFACTURING;
          cell.inputResources = [ResourceType.STEEL, ResourceType.CHEMICALS];
          cell.outputResources = [ResourceType.ELECTRONICS];
          cell.warehouseCapacity = 400;
          cell.productionLevel = cell.hasPower ? 90 : 25;
        } else if (cell.buildingType === BuildingType.FOOD_PROCESSING) {
          cell.industryType = IndustryType.PROCESSING;
          cell.inputResources = [ResourceType.RAW_MATERIALS];
          cell.outputResources = [ResourceType.FOOD];
          cell.warehouseCapacity = 500;
          cell.productionLevel = cell.hasPower ? 85 : 30;
        } else if (cell.buildingType === BuildingType.FACTORY) {
          cell.industryType = IndustryType.ASSEMBLY;
          cell.inputResources = [ResourceType.STEEL, ResourceType.ELECTRONICS];
          cell.outputResources = [ResourceType.MANUFACTURED_GOODS];
          cell.warehouseCapacity = 600;
          cell.productionLevel = cell.hasPower ? 80 : 20;
        } else if (cell.buildingType === BuildingType.WAREHOUSE) {
          cell.industryType = IndustryType.LOGISTICS;
          cell.warehouseCapacity = 2000;
          cell.productionLevel = 50; // Warehouses are always somewhat active
        } else if (cell.buildingType === BuildingType.CARGO_TERMINAL) {
          cell.industryType = IndustryType.LOGISTICS;
          cell.warehouseCapacity = 1500;
          cell.productionLevel = cell.hasPower ? 60 : 20;
        } else if (cell.buildingType === BuildingType.SHIPPING_DOCK) {
          cell.industryType = IndustryType.LOGISTICS;
          cell.warehouseCapacity = 2500;
          cell.productionLevel = cell.hasPower ? 70 : 30;
        } else if (cell.buildingType === BuildingType.FREIGHT_RAIL_TERMINAL) {
          cell.industryType = IndustryType.LOGISTICS;
          cell.warehouseCapacity = 2000;
          cell.productionLevel = cell.hasPower ? 65 : 25;
        }
        
        // Initialize empty inventory if not set
        if (cell.industryType !== IndustryType.NONE && !cell.currentInventory) {
          cell.currentInventory = {
            [ResourceType.RAW_MATERIALS]: 0,
            [ResourceType.STEEL]: 0,
            [ResourceType.OIL]: 0,
            [ResourceType.CHEMICALS]: 0,
            [ResourceType.ELECTRONICS]: 0,
            [ResourceType.FOOD]: 0,
            [ResourceType.MANUFACTURED_GOODS]: 0
          };
        }
        
        // Create industrial building record
        if (cell.industryType !== IndustryType.NONE && cell.buildingType) {
          industrialBuildings.push({
            position: pos,
            type: cell.buildingType,
            industryType: cell.industryType,
            inputResources: cell.inputResources,
            outputResources: cell.outputResources,
            productionCapacity: cell.warehouseCapacity,
            currentProduction: cell.productionLevel,
            supplyChains: [],
            warehouseCapacity: cell.warehouseCapacity,
            currentInventory: cell.currentInventory
          });
        }
      });
    });

    // Create supply chains between compatible buildings
    this.createSupplyChains(grid, industrialBuildings);
    
    // Update industrial metrics
    this.updateIndustrialMetrics(grid, resources, industrialBuildings);
  }

  private static createSupplyChains(grid: GridCell[][], industrialBuildings: IndustrialBuilding[]) {
    // Find suppliers and consumers for each resource type
    const suppliers: Record<ResourceType, IndustrialBuilding[]> = {} as any;
    const consumers: Record<ResourceType, IndustrialBuilding[]> = {} as any;
    
    // Initialize resource maps
    Object.values(ResourceType).forEach(resource => {
      suppliers[resource] = [];
      consumers[resource] = [];
    });
    
    // Categorize buildings
    industrialBuildings.forEach(building => {
      building.outputResources.forEach(resource => {
        suppliers[resource].push(building);
      });
      building.inputResources.forEach(resource => {
        consumers[resource].push(building);
      });
    });
    
    // Create supply chains
    Object.values(ResourceType).forEach(resource => {
      suppliers[resource].forEach(supplier => {
        consumers[resource].forEach(consumer => {
          const distance = Math.abs(supplier.position.x - consumer.position.x) + 
                          Math.abs(supplier.position.z - consumer.position.z);
          
          // Only create supply chains for nearby buildings (within 10 blocks)
          if (distance <= 10) {
            const supplyChain: SupplyChain = {
              id: `${supplier.position.x}-${supplier.position.z}-${consumer.position.x}-${consumer.position.z}-${resource}`,
              from: supplier.position,
              to: consumer.position,
              resourceType: resource,
              volume: Math.min(100, supplier.currentProduction * 0.8),
              transportMode: distance > 5 ? 'rail' : 'road',
              efficiency: this.calculateSupplyChainEfficiency(grid, supplier.position, consumer.position)
            };
            
            supplier.supplyChains.push(supplyChain);
            grid[supplier.position.x][supplier.position.z].supplyChainConnections.push(supplyChain);
            grid[consumer.position.x][consumer.position.z].supplyChainConnections.push(supplyChain);
          }
        });
      });
    });
  }

  private static calculateSupplyChainEfficiency(grid: GridCell[][], from: Position, to: Position): number {
    // Calculate efficiency based on transportation infrastructure
    let efficiency = 50; // Base efficiency
    
    // Check for road connections
    const hasRoadPath = this.hasTransportPath(grid, from, to, 'road');
    if (hasRoadPath) efficiency += 20;
    
    // Check for rail connections
    const hasRailPath = this.hasTransportPath(grid, from, to, 'rail');
    if (hasRailPath) efficiency += 30;
    
    // Distance penalty
    const distance = Math.abs(from.x - to.x) + Math.abs(from.z - to.z);
    efficiency -= distance * 2;
    
    return Math.max(10, Math.min(100, efficiency));
  }

  private static hasTransportPath(grid: GridCell[][], from: Position, to: Position, mode: 'road' | 'rail'): boolean {
    // Simplified path checking - in a real implementation, this would use pathfinding
    const fromCell = grid[from.x][from.z];
    const toCell = grid[to.x][to.z];
    
    if (mode === 'road') {
      return fromCell.hasRoad && toCell.hasRoad;
    } else {
      return (fromCell.buildingType === BuildingType.TRAIN_TRACK || fromCell.buildingType === BuildingType.FREIGHT_RAIL_TERMINAL) &&
             (toCell.buildingType === BuildingType.TRAIN_TRACK || toCell.buildingType === BuildingType.FREIGHT_RAIL_TERMINAL);
    }
  }

  private static updateIndustrialMetrics(grid: GridCell[][], resources: CityResources, industrialBuildings: IndustrialBuilding[]) {
    let totalProduction = 0;
    let totalSupplyChains = 0;
    let efficientSupplyChains = 0;
    let totalWarehouseCapacity = 0;
    let usedWarehouseCapacity = 0;
    let totalCargoTraffic = 0;

    industrialBuildings.forEach(building => {
      totalProduction += building.currentProduction;
      totalSupplyChains += building.supplyChains.length;
      
      building.supplyChains.forEach(chain => {
        if (chain.efficiency > 70) efficientSupplyChains++;
        totalCargoTraffic += chain.volume * 0.1; // Convert to vehicle trips
      });
      
      totalWarehouseCapacity += building.warehouseCapacity;
      usedWarehouseCapacity += Object.values(building.currentInventory).reduce((sum, amount) => sum + amount, 0);
    });

    resources.industrialProduction = totalProduction;
    resources.supplyChainEfficiency = totalSupplyChains > 0 ? (efficientSupplyChains / totalSupplyChains) * 100 : 0;
    resources.cargoTraffic = totalCargoTraffic;
    resources.warehouseUtilization = totalWarehouseCapacity > 0 ? (usedWarehouseCapacity / totalWarehouseCapacity) * 100 : 0;
    
    // Calculate external trade (connections to neighboring cities)
    let externalTrade = 0;
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.buildingType === BuildingType.HIGHWAY_CONNECTION || 
            cell.buildingType === BuildingType.RAIL_CONNECTION) {
          externalTrade += cell.industrialTraffic * 0.5;
        }
      });
    });
    resources.externalTrade = externalTrade;
  }

  private static calculateCargoTraffic(grid: GridCell[][]) {
    // Reset cargo flow
    grid.forEach(row => {
      row.forEach(cell => {
        cell.cargoFlow = { north: 0, south: 0, east: 0, west: 0 };
        cell.industrialTraffic = 0;
      });
    });

    // Calculate cargo traffic along supply chains
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        if (cell.supplyChainConnections.length > 0) {
          cell.supplyChainConnections.forEach(chain => {
            const cargoVolume = chain.volume * 0.1; // Convert to vehicle trips
            
            // Add cargo traffic along the path
            this.addCargoTrafficAlongPath(grid, chain.from, chain.to, cargoVolume, chain.transportMode);
          });
        }
      });
    });

    // Add external trade traffic
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.buildingType === BuildingType.HIGHWAY_CONNECTION || 
            cell.buildingType === BuildingType.RAIL_CONNECTION) {
          // Generate external trade traffic
          const externalTraffic = Math.random() * 50 + 20; // 20-70 vehicles per day
          cell.industrialTraffic += externalTraffic;
          
          // Distribute traffic to nearby industrial areas
          this.distributeExternalTraffic(grid, { x: cell.position.x, z: cell.position.z }, externalTraffic);
        }
      });
    });
  }

  private static addCargoTrafficAlongPath(grid: GridCell[][], start: Position, end: Position, traffic: number, mode: 'road' | 'rail' | 'both') {
    // Simple pathfinding for cargo traffic
    let current = { ...start };
    const visited = new Set<string>();
    
    while (current.x !== end.x || current.z !== end.z) {
      const key = `${current.x},${current.z}`;
      if (visited.has(key)) break;
      visited.add(key);
      
      const cell = grid[current.x][current.z];
      
      // Add cargo traffic based on transport mode
      if ((mode === 'road' || mode === 'both') && 
          (cell.buildingType === BuildingType.ROAD || 
           cell.buildingType === BuildingType.HIGHWAY ||
           cell.buildingType === BuildingType.BRIDGE)) {
        
        cell.industrialTraffic += traffic;
        
        // Determine direction of cargo flow
        if (current.x < end.x) {
          cell.cargoFlow.south += traffic;
        } else if (current.x > end.x) {
          cell.cargoFlow.north += traffic;
        }
        
        if (current.z < end.z) {
          cell.cargoFlow.east += traffic;
        } else if (current.z > end.z) {
          cell.cargoFlow.west += traffic;
        }
      }
      
      if ((mode === 'rail' || mode === 'both') && 
          (cell.buildingType === BuildingType.TRAIN_TRACK ||
           cell.buildingType === BuildingType.FREIGHT_RAIL_TERMINAL)) {
        
        cell.industrialTraffic += traffic * 0.5; // Rail is more efficient
        
        // Add rail cargo flow
        if (current.x < end.x) {
          cell.cargoFlow.south += traffic * 0.5;
        } else if (current.x > end.x) {
          cell.cargoFlow.north += traffic * 0.5;
        }
        
        if (current.z < end.z) {
          cell.cargoFlow.east += traffic * 0.5;
        } else if (current.z > end.z) {
          cell.cargoFlow.west += traffic * 0.5;
        }
      }
      
      // Move towards destination
      if (current.x < end.x && current.x + 1 < grid.length) {
        current.x++;
      } else if (current.x > end.x && current.x - 1 >= 0) {
        current.x--;
      } else if (current.z < end.z && current.z + 1 < grid[0].length) {
        current.z++;
      } else if (current.z > end.z && current.z - 1 >= 0) {
        current.z--;
      } else {
        break;
      }
    }
  }

  private static distributeExternalTraffic(grid: GridCell[][], connectionPoint: Position, traffic: number) {
    // Find nearby industrial buildings and distribute traffic to them
    const range = 8;
    for (let dx = -range; dx <= range; dx++) {
      for (let dz = -range; dz <= range; dz++) {
        const x = connectionPoint.x + dx;
        const z = connectionPoint.z + dz;
        
        if (x >= 0 && x < grid.length && z >= 0 && z < grid[0].length) {
          const cell = grid[x][z];
          
          if (cell.industryType !== IndustryType.NONE) {
            const distance = Math.abs(dx) + Math.abs(dz);
            const trafficShare = traffic / (distance + 1) * 0.1;
            
            // Add traffic along path to industrial building
            this.addCargoTrafficAlongPath(grid, connectionPoint, { x, z }, trafficShare, 'road');
          }
        }
      }
    }
  }

  private static updateZoningAndLandValues(grid: GridCell[][], resources: CityResources) {
    // Increment simulation time (each update = ~1 month, 24 updates = 1 year)
    const currentTime = resources.simulationYear * 12 + (Date.now() % 12);
    
    // Annual land value update (every 24 simulation cycles ≈ 1 year)
    const shouldUpdateAnnually = Math.floor(currentTime) % 12 === 0;
    
    if (shouldUpdateAnnually) {
      resources.simulationYear += 1;
      console.log(`Annual land value update - Year ${resources.simulationYear}`);
    }

    let totalLandValue = 0;
    let zonedCells = 0;
    let totalPropertyTax = 0;

    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        // Mark cell as zoned if it has a zone type
        if (cell.zoneType !== ZoneType.EMPTY && !cell.isZoned) {
          cell.isZoned = true;
          cell.zonedDate = currentTime;
        }

        if (cell.isZoned) {
          zonedCells++;
          
          // Calculate new land value based on multiple factors
          const newLandValue = this.calculateLandValue(grid, x, z, cell);
          
          // Update land value history
          if (shouldUpdateAnnually || cell.landValueHistory.length === 0) {
            cell.landValueHistory.push(newLandValue);
            // Keep only last 10 years of history
            if (cell.landValueHistory.length > 10) {
              cell.landValueHistory.shift();
            }
            
            // Calculate appreciation rate
            if (cell.landValueHistory.length > 1) {
              const oldValue = cell.landValueHistory[cell.landValueHistory.length - 2];
              cell.appreciationRate = ((newLandValue - oldValue) / oldValue) * 100;
            }
          }
          
          cell.landValue = newLandValue;
          cell.lastLandValueUpdate = currentTime;
          
          // Calculate property tax (1% of land value annually)
          cell.propertyTax = cell.landValue * 0.01;
          totalPropertyTax += cell.propertyTax;
          
          // Calculate market demand for this location
          cell.marketDemand = this.calculateMarketDemand(grid, x, z, cell);
          
          // Calculate development pressure
          cell.developmentPressure = this.calculateDevelopmentPressure(cell);
          
          totalLandValue += cell.landValue;
        }
      });
    });

    // Update city-wide metrics
    resources.averageLandValue = zonedCells > 0 ? totalLandValue / zonedCells : 50;
    resources.totalZonedLand = zonedCells;
    resources.propertyTaxRevenue = totalPropertyTax; zonedCells;
    resources.propertyTaxRevenue = totalPropertyTax;
    
    // Calculate city-wide demand
    this.calculateCityWideDemand(grid, resources);
  }

  private static calculateLandValue(grid: GridCell[][], x: number, z: number, cell: GridCell): number {
    let landValue = 50; // Base land value
    
    // Location factors
    const distanceFromCenter = Math.abs(x - 10) + Math.abs(z - 10);
    landValue += Math.max(0, 20 - distanceFromCenter); // Central locations more valuable
    
    // Infrastructure bonuses
    if (cell.hasRoad) landValue += 15;
    if (cell.hasPower) landValue += 12;
    if (cell.hasWater) landValue += 12;
    
    // Accessibility bonus
    landValue += cell.accessibility * 0.3;
    landValue += cell.transitAccess * 0.25;
    
    // Service proximity bonuses
    landValue += cell.educationAccess * 0.2;
    landValue += cell.healthcareAccess * 0.15;
    landValue += cell.safetyLevel * 0.1;
    
    // Environmental factors
    const nearbyParks = this.countNearbyBuildings(grid, x, z, BuildingType.PARK, 3);
    landValue += nearbyParks * 12;
    
    // Pollution penalty
    landValue -= cell.pollution * 0.4;
    
    // Traffic penalty
    landValue -= cell.trafficLevel * 0.2;
    
    // Crime penalty (significant impact on land value)
    landValue -= (cell.crimeScore || 20) * 0.4;
    
    // Police coverage bonus
    landValue += (cell.policeCoverage || 0) * 0.15;
    
    // Zone-specific adjustments
    if (cell.zoneType === ZoneType.COMMERCIAL) {
      // Commercial benefits from foot traffic and accessibility
      const nearbyResidential = this.countNearbyZones(grid, x, z, ZoneType.RESIDENTIAL, 4);
      landValue += nearbyResidential * 8;
      landValue += cell.accessibility * 0.4;
    } else if (cell.zoneType === ZoneType.RESIDENTIAL) {
      // Residential benefits from quiet, clean areas
      const nearbyIndustrial = this.countNearbyZones(grid, x, z, ZoneType.INDUSTRIAL, 5);
      landValue -= nearbyIndustrial * 10;
      landValue += cell.safetyLevel * 0.3;
    } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
      // Industrial benefits from transportation access
      const nearbyFreight = this.countNearbyBuildings(grid, x, z, BuildingType.FREIGHT_RAIL_TERMINAL, 6);
      landValue += nearbyFreight * 15;
      landValue += cell.accessibility * 0.2;
      // Industrial doesn't mind pollution as much
      landValue += cell.pollution * 0.1;
    }
    
    // Market forces - supply and demand
    const zoneSupply = this.countNearbyZones(grid, x, z, cell.zoneType, 8);
    if (zoneSupply > 10) landValue -= 10; // Oversupply reduces value
    
    return Math.max(10, Math.min(300, landValue));
  }

  private static calculateMarketDemand(grid: GridCell[][], x: number, z: number, cell: GridCell): number {
    let demand = 50; // Base demand
    
    // Zone-specific demand calculations
    if (cell.zoneType === ZoneType.RESIDENTIAL) {
      // Residential demand based on jobs nearby
      const nearbyJobs = this.countNearbyZones(grid, x, z, ZoneType.COMMERCIAL, 6) * 8 +
                        this.countNearbyZones(grid, x, z, ZoneType.INDUSTRIAL, 8) * 12;
      demand += Math.min(30, nearbyJobs);
      
      // Demand increases with good services
      demand += (cell.educationAccess + cell.healthcareAccess + cell.safetyLevel) / 10;
      
      // Demand decreases with pollution
      demand -= cell.pollution * 0.3;
      
    } else if (cell.zoneType === ZoneType.COMMERCIAL) {
      // Commercial demand based on nearby population
      const nearbyPopulation = this.calculateNearbyPopulation(grid, x, z, 5);
      demand += Math.min(40, nearbyPopulation / 10);
      
      // Accessibility is crucial for commercial
      demand += cell.accessibility * 0.4;
      demand += cell.transitAccess * 0.3;
      
    } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
      // Industrial demand based on transportation access
      demand += cell.accessibility * 0.3;
      
      // Proximity to freight infrastructure
      const nearbyFreight = this.countNearbyBuildings(grid, x, z, BuildingType.FREIGHT_RAIL_TERMINAL, 8) +
                           this.countNearbyBuildings(grid, x, z, BuildingType.CARGO_TERMINAL, 6);
      demand += nearbyFreight * 15;
      
      // Distance from residential (industrial prefers to be away from homes)
      const nearbyResidential = this.countNearbyZones(grid, x, z, ZoneType.RESIDENTIAL, 4);
      demand -= nearbyResidential * 5;
    }
    
    return Math.max(0, Math.min(100, demand));
  }

  private static calculateDevelopmentPressure(cell: GridCell): number {
    let pressure = 0;
    
    // High land value creates development pressure
    pressure += (cell.landValue - 50) * 0.5;
    
    // High market demand creates pressure
    pressure += cell.marketDemand * 0.4;
    
    // Low development level with high demand creates pressure
    if (cell.developmentLevel < 3) {
      pressure += (3 - cell.developmentLevel) * 10;
    }
    
    // Infrastructure availability creates pressure
    if (cell.hasRoad && cell.hasPower && cell.hasWater) {
      pressure += 20;
    }
    
    return Math.max(0, Math.min(100, pressure));
  }

  private static calculateCityWideDemand(grid: GridCell[][], resources: CityResources) {
    let residentialSupply = 0;
    let commercialSupply = 0;
    let industrialSupply = 0;
    let totalPopulation = 0;
    let totalJobs = 0;

    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.zoneType === ZoneType.RESIDENTIAL) {
          residentialSupply += cell.developmentLevel;
          totalPopulation += cell.population || 0;
        } else if (cell.zoneType === ZoneType.COMMERCIAL) {
          commercialSupply += cell.developmentLevel;
          totalJobs += cell.jobs || 0;
        } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
          industrialSupply += cell.developmentLevel;
          totalJobs += cell.jobs || 0;
        }
      });
    });

    // Calculate demand based on supply/demand balance
    const jobsPerPerson = totalPopulation > 0 ? totalJobs / totalPopulation : 0;
    
    // Residential demand increases if there are more jobs than housing
    resources.residentialDemand = Math.min(100, 50 + (jobsPerPerson - 0.8) * 50);
    
    // Commercial demand based on population growth
    resources.commercialDemand = Math.min(100, 50 + (totalPopulation / 100) - commercialSupply);
    
    // Industrial demand based on commercial demand
    resources.industrialDemand = Math.min(100, 50 + (commercialSupply * 0.5) - industrialSupply);
  }

  private static processDevelopment(grid: GridCell[][], resources: CityResources) {
    let newDevelopments = 0;
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.isZoned && cell.zoneType !== ZoneType.EMPTY) {
          // Check if this cell should develop/upgrade
          const shouldDevelop = this.shouldCellDevelop(cell, resources);
          
          if (shouldDevelop && cell.developmentLevel < 3) {
            // Upgrade development level
            const oldLevel = cell.developmentLevel;
            cell.developmentLevel = Math.min(3, cell.developmentLevel + 0.2);
            
            if (Math.floor(cell.developmentLevel) > Math.floor(oldLevel)) {
              newDevelopments++;
              
              // Update population/jobs based on new development level
              if (cell.zoneType === ZoneType.RESIDENTIAL) {
                cell.population = Math.floor(cell.developmentLevel * 15 * (cell.landValue / 100));
              } else if (cell.zoneType === ZoneType.COMMERCIAL) {
                cell.jobs = Math.floor(cell.developmentLevel * 12 * (cell.landValue / 100));
              } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
                cell.jobs = Math.floor(cell.developmentLevel * 18 * (cell.landValue / 100));
              }
            }
          }
        }
      });
    });
    
    resources.developmentRate = newDevelopments;
  }

  private static shouldCellDevelop(cell: GridCell, resources: CityResources): boolean {
    // Development probability based on multiple factors
    let developmentChance = 0;
    
    // High development pressure increases chance
    developmentChance += cell.developmentPressure * 0.01;
    
    // High market demand increases chance
    developmentChance += cell.marketDemand * 0.008;
    
    // High land value increases chance
    developmentChance += (cell.landValue - 50) * 0.002;
    
    // Infrastructure requirements
    if (!cell.hasRoad) developmentChance *= 0.1;
    if (!cell.hasPower) developmentChance *= 0.3;
    if (!cell.hasWater) developmentChance *= 0.5;
    
    // Zone-specific factors
    if (cell.zoneType === ZoneType.RESIDENTIAL) {
      developmentChance += resources.residentialDemand * 0.005;
    } else if (cell.zoneType === ZoneType.COMMERCIAL) {
      developmentChance += resources.commercialDemand * 0.005;
    } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
      developmentChance += resources.industrialDemand * 0.005;
    }
    
    return Math.random() < Math.min(0.1, developmentChance); // Max 10% chance per update
  }

  private static calculateNearbyPopulation(grid: GridCell[][], x: number, z: number, range: number): number {
    let population = 0;
    for (let dx = -range; dx <= range; dx++) {
      for (let dz = -range; dz <= range; dz++) {
        const nx = x + dx;
        const nz = z + dz;
        if (nx >= 0 && nx < grid.length && nz >= 0 && nz < grid[0].length) {
          population += grid[nx][nz].population || 0;
        }
      }
    }
    return population;
  }

  private static updateCrimeSystem(grid: GridCell[][], resources: CityResources) {
    // Reset crime data
    let totalCrimeScore = 0;
    let cellsWithCrime = 0;
    let totalIncidents = 0;
    const crimeByType: Record<string, number> = {
      none: 0,
      petty_theft: 0,
      burglary: 0,
      vandalism: 0,
      drug_related: 0,
      violent_crime: 0,
      organized_crime: 0,
      white_collar: 0
    };

    // Calculate police coverage first
    this.calculatePoliceCoverage(grid);

    // Calculate crime for each cell
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        if (cell.zoneType !== ZoneType.EMPTY || cell.buildingType) {
          // Calculate base crime score
          const crimeData = this.calculateCrimeScore(grid, x, z, cell);
          cell.crimeScore = crimeData.score;
          cell.crimeType = crimeData.dominantType;
          cell.crimeFactors = crimeData.factors;

          // Update crime history
          if (!cell.crimeHistory) cell.crimeHistory = [];
          cell.crimeHistory.push(cell.crimeScore);
          if (cell.crimeHistory.length > 12) { // Keep 12 months of history
            cell.crimeHistory.shift();
          }

          // Calculate incidents based on crime score and population/activity
          const incidents = this.calculateCrimeIncidents(cell);
          totalIncidents += incidents;
          crimeByType[cell.crimeType] += incidents;

          totalCrimeScore += cell.crimeScore;
          cellsWithCrime++;
        }
      });
    });

    // Update city-wide crime metrics
    resources.averageCrimeScore = cellsWithCrime > 0 ? totalCrimeScore / cellsWithCrime : 20;
    resources.totalCrimeIncidents = totalIncidents;
    resources.crimeByType = crimeByType as any;
    
    // Calculate crime reduction rate
    const previousCrime = resources.averageCrimeScore || 20;
    resources.crimeReductionRate = ((previousCrime - resources.averageCrimeScore) / previousCrime) * 100;

    // Calculate police coverage percentage
    let cellsWithPoliceCoverage = 0;
    let totalCells = 0;
    grid.forEach(row => {
      row.forEach(cell => {
        totalCells++;
        if (cell.policeCoverage > 20) cellsWithPoliceCoverage++;
      });
    });
    resources.policeCoverage = totalCells > 0 ? (cellsWithPoliceCoverage / totalCells) * 100 : 0;

    // Calculate criminal justice spending
    resources.criminalJusticeSpending = this.calculateCriminalJusticeSpending(grid);
  }

  private static calculatePoliceCoverage(grid: GridCell[][]) {
    // Reset police coverage
    grid.forEach(row => {
      row.forEach(cell => {
        cell.policeCoverage = 0;
      });
    });

    // Find all police stations and calculate coverage
    const policeStations: Position[] = [];
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        if (cell.buildingType === BuildingType.POLICE_STATION) {
          policeStations.push({ x, z });
        }
      });
    });

    // Calculate coverage for each cell
    grid.forEach((row, x) => {
      row.forEach((cell, z) => {
        let maxCoverage = 0;
        
        policeStations.forEach(station => {
          const distance = Math.abs(x - station.x) + Math.abs(z - station.z);
          const maxRange = 8; // Police stations cover 8 blocks radius
          
          if (distance <= maxRange) {
            // Coverage decreases with distance
            const coverage = Math.max(0, 100 - (distance * (100 / maxRange)));
            maxCoverage = Math.max(maxCoverage, coverage);
          }
        });

        cell.policeCoverage = maxCoverage;
      });
    });
  }

  private static calculateCrimeScore(grid: GridCell[][], x: number, z: number, cell: GridCell): {
    score: number;
    dominantType: CrimeType;
    factors: any[];
  } {
    let crimeScore = 30; // Base crime score
    const factors: any[] = [];
    const crimeTypeScores: Record<string, number> = {
      petty_theft: 0,
      burglary: 0,
      vandalism: 0,
      drug_related: 0,
      violent_crime: 0,
      organized_crime: 0,
      white_collar: 0
    };

    // Police coverage reduces crime significantly
    const policeReduction = cell.policeCoverage * 0.6; // Up to 60% reduction
    crimeScore -= policeReduction;
    if (cell.policeCoverage > 0) {
      factors.push({
        type: 'police_coverage',
        impact: -policeReduction,
        description: `Police coverage reduces crime by ${Math.round(policeReduction)}%`
      });
    }

    // Population density affects crime
    const nearbyPopulation = this.calculateNearbyPopulation(grid, x, z, 3);
    if (nearbyPopulation > 50) {
      const densityIncrease = Math.min(20, (nearbyPopulation - 50) * 0.2);
      crimeScore += densityIncrease;
      crimeTypeScores.petty_theft += densityIncrease * 0.4;
      crimeTypeScores.burglary += densityIncrease * 0.3;
      factors.push({
        type: 'density',
        impact: densityIncrease,
        description: `High population density increases crime by ${Math.round(densityIncrease)}%`
      });
    }

    // Unemployment increases crime
    const nearbyJobs = this.countNearbyZones(grid, x, z, ZoneType.COMMERCIAL, 4) * 8 +
                      this.countNearbyZones(grid, x, z, ZoneType.INDUSTRIAL, 6) * 12;
    const jobsPerPerson = nearbyPopulation > 0 ? nearbyJobs / nearbyPopulation : 1;
    
    if (jobsPerPerson < 0.6) { // High unemployment
      const unemploymentIncrease = (0.6 - jobsPerPerson) * 30;
      crimeScore += unemploymentIncrease;
      crimeTypeScores.drug_related += unemploymentIncrease * 0.3;
      crimeTypeScores.petty_theft += unemploymentIncrease * 0.4;
      factors.push({
        type: 'unemployment',
        impact: unemploymentIncrease,
        description: `High unemployment increases crime by ${Math.round(unemploymentIncrease)}%`
      });
    }

    // Education reduces crime
    const educationReduction = cell.educationAccess * 0.3;
    crimeScore -= educationReduction;
    if (cell.educationAccess > 0) {
      factors.push({
        type: 'education',
        impact: -educationReduction,
        description: `Education access reduces crime by ${Math.round(educationReduction)}%`
      });
    }

    // Pollution increases crime
    const pollutionIncrease = cell.pollution * 0.2;
    crimeScore += pollutionIncrease;
    if (cell.pollution > 0) {
      crimeTypeScores.vandalism += pollutionIncrease * 0.5;
      factors.push({
        type: 'pollution',
        impact: pollutionIncrease,
        description: `Pollution increases crime by ${Math.round(pollutionIncrease)}%`
      });
    }

    // Zone-specific crime patterns
    if (cell.zoneType === ZoneType.COMMERCIAL) {
      crimeTypeScores.petty_theft += 15;
      crimeTypeScores.white_collar += 10;
      crimeScore += 5; // Commercial areas have more crime opportunities
    } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
      crimeTypeScores.organized_crime += 10;
      crimeTypeScores.drug_related += 8;
      crimeScore += 3;
    } else if (cell.zoneType === ZoneType.RESIDENTIAL) {
      crimeTypeScores.burglary += 12;
      if (cell.landValue < 40) { // Low-income residential
        crimeTypeScores.violent_crime += 8;
        crimeScore += 8;
      }
    }

    // Building-specific effects
    if (cell.buildingType === BuildingType.STADIUM) {
      crimeScore += 10; // Large gatherings can increase crime
      crimeTypeScores.vandalism += 15;
    } else if (cell.buildingType === BuildingType.PARK) {
      crimeScore -= 5; // Parks reduce crime during day
      crimeTypeScores.drug_related += 5; // But can attract drug activity
    } else if (cell.buildingType === BuildingType.SCHOOL || cell.buildingType === BuildingType.UNIVERSITY) {
      crimeScore -= 8; // Educational institutions reduce crime
    } else if (cell.buildingType === BuildingType.HOSPITAL) {
      crimeScore -= 3; // Healthcare facilities reduce crime
    }

    // Nearby crime hotspots increase crime
    const nearbyCrime = this.calculateNearbyCrime(grid, x, z, 3);
    if (nearbyCrime > 50) {
      const crimeSpillover = (nearbyCrime - 50) * 0.3;
      crimeScore += crimeSpillover;
      factors.push({
        type: 'crime_spillover',
        impact: crimeSpillover,
        description: `Nearby crime hotspots increase crime by ${Math.round(crimeSpillover)}%`
      });
    }

    // Land value affects crime (higher value = lower crime)
    const landValueEffect = (cell.landValue - 50) * -0.2;
    crimeScore += landValueEffect;
    if (landValueEffect !== 0) {
      factors.push({
        type: 'land_value',
        impact: landValueEffect,
        description: `Land value ${landValueEffect < 0 ? 'reduces' : 'increases'} crime by ${Math.round(Math.abs(landValueEffect))}%`
      });
    }

    // Determine dominant crime type
    let dominantType = CrimeType.NONE;
    let maxScore = 0;
    Object.entries(crimeTypeScores).forEach(([type, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantType = type as CrimeType;
      }
    });

    // If no specific crime type dominates, use general categories
    if (maxScore < 5) {
      if (crimeScore > 60) dominantType = CrimeType.VIOLENT_CRIME;
      else if (crimeScore > 40) dominantType = CrimeType.PETTY_THEFT;
      else if (crimeScore > 20) dominantType = CrimeType.VANDALISM;
      else dominantType = CrimeType.NONE;
    }

    return {
      score: Math.max(0, Math.min(100, crimeScore)),
      dominantType,
      factors
    };
  }

  private static calculateNearbyCrime(grid: GridCell[][], x: number, z: number, range: number): number {
    let totalCrime = 0;
    let cellCount = 0;

    for (let dx = -range; dx <= range; dx++) {
      for (let dz = -range; dz <= range; dz++) {
        const nx = x + dx;
        const nz = z + dz;
        
        if (nx >= 0 && nx < grid.length && nz >= 0 && nz < grid[0].length) {
          if (dx !== 0 || dz !== 0) { // Don't include the center cell
            totalCrime += grid[nx][nz].crimeScore || 20;
            cellCount++;
          }
        }
      }
    }

    return cellCount > 0 ? totalCrime / cellCount : 20;
  }

  private static calculateCrimeIncidents(cell: GridCell): number {
    let incidents = 0;
    
    // Base incidents based on crime score
    incidents = (cell.crimeScore / 100) * 5; // Up to 5 incidents per month at 100% crime

    // Multiply by activity level
    if (cell.zoneType === ZoneType.RESIDENTIAL && cell.population) {
      incidents *= (cell.population / 10); // More people = more potential incidents
    } else if (cell.zoneType === ZoneType.COMMERCIAL && cell.jobs) {
      incidents *= (cell.jobs / 15); // Commercial activity affects incidents
    } else if (cell.zoneType === ZoneType.INDUSTRIAL && cell.jobs) {
      incidents *= (cell.jobs / 20); // Industrial areas have different patterns
    }

    // Random variation
    incidents *= (0.8 + Math.random() * 0.4); // ±20% variation

    return Math.round(Math.max(0, incidents));
  }

  private static calculateCriminalJusticeSpending(grid: GridCell[][]): number {
    let spending = 0;
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.buildingType === BuildingType.POLICE_STATION) {
          spending += 50; // Base police station operating cost
        }
      });
    });

    return spending;
  }
}
