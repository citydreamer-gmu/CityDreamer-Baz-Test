import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useCityStore } from "../../lib/stores/useCityStore";

export default function PowerGridPanel() {
  const { grid, resources } = useCityStore();

  // Calculate power grid statistics
  const powerStats = grid.reduce((stats, row) => {
    row.forEach(cell => {
      if (cell.buildingType === 'power_plant') {
        stats.powerPlants++;
        stats.totalGeneration += 50; // Each plant generates 50 units
      }
      if (cell.buildingType === 'power_substation') {
        stats.substations++;
      }
      if (cell.buildingType === 'power_line') {
        stats.powerLines++;
      }
      
      if (cell.hasPower) {
        stats.poweredCells++;
        if (cell.zoneType !== 'empty') {
          stats.poweredZones++;
        }
      } else if (cell.zoneType !== 'empty' || cell.buildingType) {
        stats.unpoweredCells++;
      }
      
      // Count power distance distribution
      if (cell.powerDistance !== undefined) {
        if (cell.powerDistance === 0) stats.directConnection++;
        else if (cell.powerDistance <= 2) stats.nearConnection++;
        else if (cell.powerDistance <= 5) stats.mediumConnection++;
        else if (cell.powerDistance <= 8) stats.farConnection++;
        else stats.noConnection++;
      }
    });
    return stats;
  }, {
    powerPlants: 0,
    substations: 0,
    powerLines: 0,
    totalGeneration: 0,
    poweredCells: 0,
    unpoweredCells: 0,
    poweredZones: 0,
    directConnection: 0,
    nearConnection: 0,
    mediumConnection: 0,
    farConnection: 0,
    noConnection: 0
  });

  const totalCells = powerStats.poweredCells + powerStats.unpoweredCells;
  const coveragePercentage = totalCells > 0 ? (powerStats.poweredCells / totalCells) * 100 : 0;
  const efficiency = resources.powerCapacity > 0 ? (resources.power / resources.powerCapacity) * 100 : 0;

  const getEfficiencyColor = (value: number) => {
    if (value >= 70) return "text-green-400";
    if (value >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressColor = (value: number) => {
    if (value >= 70) return "bg-green-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-64 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚡ Power Grid
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Power Generation & Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Grid Efficiency</span>
            <span className={`font-mono text-sm ${getEfficiencyColor(efficiency)}`}>
              {efficiency.toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={efficiency} className="h-3" />
            <div className={`absolute top-0 left-0 h-3 rounded ${getProgressColor(efficiency)}`} 
                 style={{width: `${Math.min(100, efficiency)}%`}}></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {resources.power} / {resources.powerCapacity} MW available
          </div>
        </div>

        {/* Coverage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Power Coverage</span>
            <span className={`font-mono text-sm ${getEfficiencyColor(coveragePercentage)}`}>
              {coveragePercentage.toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={coveragePercentage} className="h-3" />
            <div className={`absolute top-0 left-0 h-3 rounded ${getProgressColor(coveragePercentage)}`} 
                 style={{width: `${Math.min(100, coveragePercentage)}%`}}></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {powerStats.poweredZones} zones powered
          </div>
        </div>

        {/* Infrastructure */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🏭 Infrastructure</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Power Plants</span>
              <span className="text-xs font-mono">{powerStats.powerPlants}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Substations</span>
              <span className="text-xs font-mono">{powerStats.substations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Power Lines</span>
              <span className="text-xs font-mono">{powerStats.powerLines}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Total Generation</span>
              <span className="text-xs font-mono">{powerStats.totalGeneration} MW</span>
            </div>
          </div>
        </div>

        {/* Connection Quality */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🔌 Connection Quality</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Direct</span>
              </div>
              <span className="text-xs font-mono">{powerStats.directConnection}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-xs">Near</span>
              </div>
              <span className="text-xs font-mono">{powerStats.nearConnection}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Medium</span>
              </div>
              <span className="text-xs font-mono">{powerStats.mediumConnection}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs">Far</span>
              </div>
              <span className="text-xs font-mono">{powerStats.farConnection}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">No Power</span>
              </div>
              <span className="text-xs font-mono">{powerStats.noConnection}</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="border-t border-gray-600 pt-2">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">💡 Power Tips</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Use power lines for long-distance transmission</p>
            <p>• Substations extend power range efficiently</p>
            <p>• Build plants near high-demand areas</p>
            <p>• Monitor power usage vs. generation</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}