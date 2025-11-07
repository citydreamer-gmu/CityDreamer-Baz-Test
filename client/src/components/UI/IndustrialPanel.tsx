import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useCityStore } from "../../lib/stores/useCityStore";
import { BuildingType, IndustryType } from "../../types/city";

export default function IndustrialPanel() {
  const { grid, resources } = useCityStore();

  // Calculate industrial statistics
  const industrialStats = grid.reduce((stats, row) => {
    row.forEach(cell => {
      // Count industrial buildings
      if (cell.buildingType === BuildingType.WAREHOUSE) stats.warehouses++;
      if (cell.buildingType === BuildingType.FACTORY) stats.factories++;
      if (cell.buildingType === BuildingType.MINING_FACILITY) stats.miningFacilities++;
      if (cell.buildingType === BuildingType.OIL_REFINERY) stats.oilRefineries++;
      if (cell.buildingType === BuildingType.STEEL_MILL) stats.steelMills++;
      if (cell.buildingType === BuildingType.CHEMICAL_PLANT) stats.chemicalPlants++;
      if (cell.buildingType === BuildingType.ELECTRONICS_FACTORY) stats.electronicsFactories++;
      if (cell.buildingType === BuildingType.FOOD_PROCESSING) stats.foodProcessing++;
      if (cell.buildingType === BuildingType.CARGO_TERMINAL) stats.cargoTerminals++;
      if (cell.buildingType === BuildingType.SHIPPING_DOCK) stats.shippingDocks++;
      if (cell.buildingType === BuildingType.FREIGHT_RAIL_TERMINAL) stats.freightRailTerminals++;
      
      // Count connections
      if (cell.buildingType === BuildingType.HIGHWAY_CONNECTION) stats.highwayConnections++;
      if (cell.buildingType === BuildingType.RAIL_CONNECTION) stats.railConnections++;
      
      // Count supply chains and production
      if (cell.supplyChainConnections) {
        stats.totalSupplyChains += cell.supplyChainConnections.length;
        cell.supplyChainConnections.forEach(chain => {
          if (chain.efficiency > 70) stats.efficientChains++;
        });
      }
      
      if (cell.productionLevel > 0) {
        stats.activeProduction++;
        stats.totalProduction += cell.productionLevel;
      }
      
      if (cell.industrialTraffic > 0) {
        stats.totalCargoTraffic += cell.industrialTraffic;
      }
      
      if (cell.industryType && cell.industryType !== IndustryType.NONE) {
        stats.totalIndustrialBuildings++;
      }
    });
    return stats;
  }, {
    warehouses: 0,
    factories: 0,
    miningFacilities: 0,
    oilRefineries: 0,
    steelMills: 0,
    chemicalPlants: 0,
    electronicsFactories: 0,
    foodProcessing: 0,
    cargoTerminals: 0,
    shippingDocks: 0,
    freightRailTerminals: 0,
    highwayConnections: 0,
    railConnections: 0,
    totalSupplyChains: 0,
    efficientChains: 0,
    activeProduction: 0,
    totalProduction: 0,
    totalCargoTraffic: 0,
    totalIndustrialBuildings: 0
  });

  const averageProduction = industrialStats.activeProduction > 0 ? 
    industrialStats.totalProduction / industrialStats.activeProduction : 0;

  const getStatusColor = (value: number, thresholds = { good: 70, ok: 40 }) => {
    if (value >= thresholds.good) return "text-green-400";
    if (value >= thresholds.ok) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressColor = (value: number, thresholds = { good: 70, ok: 40 }) => {
    if (value >= thresholds.good) return "bg-green-500";
    if (value >= thresholds.ok) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-64 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏭 Industrial System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Industrial Performance */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Production Level</span>
            <span className={`font-mono text-sm ${getStatusColor(averageProduction)}`}>
              {averageProduction.toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={averageProduction} className="h-3" />
            <div className={`absolute top-0 left-0 h-3 rounded ${getProgressColor(averageProduction)}`} 
                 style={{width: `${Math.min(100, averageProduction)}%`}}></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {industrialStats.activeProduction} active facilities
          </div>
        </div>

        {/* Supply Chain Efficiency */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Supply Chains</span>
            <span className={`font-mono text-sm ${getStatusColor(resources.supplyChainEfficiency)}`}>
              {resources.supplyChainEfficiency.toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={resources.supplyChainEfficiency} className="h-3" />
            <div className={`absolute top-0 left-0 h-3 rounded ${getProgressColor(resources.supplyChainEfficiency)}`} 
                 style={{width: `${Math.min(100, resources.supplyChainEfficiency)}%`}}></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {industrialStats.efficientChains}/{industrialStats.totalSupplyChains} efficient
          </div>
        </div>

        {/* Raw Materials & Processing */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🏗️ Production</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-800 rounded-full"></div>
                <span className="text-xs">Mining</span>
              </div>
              <span className="text-xs font-mono">{industrialStats.miningFacilities}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                <span className="text-xs">Oil Refinery</span>
              </div>
              <span className="text-xs font-mono">{industrialStats.oilRefineries}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-800 rounded-full"></div>
                <span className="text-xs">Steel Mill</span>
              </div>
              <span className="text-xs font-mono">{industrialStats.steelMills}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-800 rounded-full"></div>
                <span className="text-xs">Chemical</span>
              </div>
              <span className="text-xs font-mono">{industrialStats.chemicalPlants}</span>
            </div>
          </div>
        </div>

        {/* Manufacturing */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🏭 Manufacturing</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-xs">Electronics</span>
              </div>
              <span className="text-xs font-mono">{industrialStats.electronicsFactories}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="text-xs">Food Processing</span>
              </div>
              <span className="text-xs font-mono">{industrialStats.foodProcessing}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-800 rounded-full"></div>
                <span className="text-xs">Factories</span>
              </div>
              <span className="text-xs font-mono">{industrialStats.factories}</span>
            </div>
          </div>
        </div>

        {/* Logistics */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">📦 Logistics</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Warehouses</span>
              <span className="text-xs font-mono">{industrialStats.warehouses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Cargo Terminals</span>
              <span className="text-xs font-mono">{industrialStats.cargoTerminals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Shipping Docks</span>
              <span className="text-xs font-mono">{industrialStats.shippingDocks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Freight Rail</span>
              <span className="text-xs font-mono">{industrialStats.freightRailTerminals}</span>
            </div>
          </div>
        </div>

        {/* External Connections */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🌐 External Trade</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Highway Exits</span>
              <span className="text-xs font-mono">{industrialStats.highwayConnections}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Rail Connections</span>
              <span className="text-xs font-mono">{industrialStats.railConnections}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Daily Cargo Traffic</span>
              <span className="text-xs font-mono">{Math.floor(resources.cargoTraffic)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">External Trade</span>
              <span className="text-xs font-mono">{Math.floor(resources.externalTrade)}</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="border-t border-gray-600 pt-2">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">💡 Industrial Tips</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Connect raw materials to processing plants</p>
            <p>• Use warehouses for supply chain efficiency</p>
            <p>• Highway/rail connections enable external trade</p>
            <p>• Watch for cargo trucks and freight trains</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}