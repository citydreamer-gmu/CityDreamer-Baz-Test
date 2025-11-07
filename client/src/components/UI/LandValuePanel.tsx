import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useCityStore } from "../../lib/stores/useCityStore";
import { ZoneType } from "../../types/city";

export default function LandValuePanel() {
  const { resources, grid } = useCityStore();

  // Calculate zoning statistics
  const zoningStats = {
    totalZoned: 0,
    residential: 0,
    commercial: 0,
    industrial: 0,
    empty: 0,
    averageLandValue: 0,
    highValueCells: 0,
    lowValueCells: 0
  };

  let totalLandValue = 0;
  let zonedCells = 0;

  grid.forEach(row => {
    row.forEach(cell => {
      if (cell.isZoned) {
        zoningStats.totalZoned++;
        zonedCells++;
        totalLandValue += cell.landValue;
        
        if (cell.landValue > 100) zoningStats.highValueCells++;
        if (cell.landValue < 30) zoningStats.lowValueCells++;
      }
      
      switch (cell.zoneType) {
        case ZoneType.RESIDENTIAL:
          zoningStats.residential++;
          break;
        case ZoneType.COMMERCIAL:
          zoningStats.commercial++;
          break;
        case ZoneType.INDUSTRIAL:
          zoningStats.industrial++;
          break;
        case ZoneType.EMPTY:
          zoningStats.empty++;
          break;
      }
    });
  });

  zoningStats.averageLandValue = zonedCells > 0 ? totalLandValue / zonedCells : 0;

  // Calculate development pressure statistics
  let highPressureCells = 0;
  let readyToDevelop = 0;
  
  grid.forEach(row => {
    row.forEach(cell => {
      if (cell.isZoned && cell.developmentPressure > 70) {
        highPressureCells++;
      }
      if (cell.isZoned && cell.developmentPressure > 50 && cell.developmentLevel < 3) {
        readyToDevelop++;
      }
    });
  });

  const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString()}`;
  const formatPercent = (value: number) => `${Math.round(value)}%`;

  return (
    <Card className="w-80 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🏘️</span>
          Land Value & Zoning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* City-wide Land Value Metrics */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Land Value Overview</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Average Value</div>
              <div className="text-lg font-bold text-green-400">
                {formatCurrency(resources.averageLandValue)}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Appreciation</div>
              <div className="text-lg font-bold text-blue-400">
                {formatPercent(resources.landValueAppreciation)}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Property Tax</div>
              <div className="text-lg font-bold text-yellow-400">
                {formatCurrency(resources.propertyTaxRevenue)}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Simulation Year</div>
              <div className="text-lg font-bold text-purple-400">
                {resources.simulationYear}
              </div>
            </div>
          </div>
        </div>

        {/* Zoning Statistics */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Zoning Distribution</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                Residential
              </span>
              <span className="text-sm">{zoningStats.residential} cells</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                Commercial
              </span>
              <span className="text-sm">{zoningStats.commercial} cells</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                Industrial
              </span>
              <span className="text-sm">{zoningStats.industrial} cells</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                Empty
              </span>
              <span className="text-sm">{zoningStats.empty} cells</span>
            </div>
          </div>
        </div>

        {/* Market Demand */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Market Demand</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Residential</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-600 rounded">
                  <div 
                    className="h-full bg-green-500 rounded"
                    style={{ width: `${resources.residentialDemand}%` }}
                  ></div>
                </div>
                <span className="text-xs w-8">{Math.round(resources.residentialDemand)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Commercial</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-600 rounded">
                  <div 
                    className="h-full bg-blue-500 rounded"
                    style={{ width: `${resources.commercialDemand}%` }}
                  ></div>
                </div>
                <span className="text-xs w-8">{Math.round(resources.commercialDemand)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Industrial</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-600 rounded">
                  <div 
                    className="h-full bg-purple-500 rounded"
                    style={{ width: `${resources.industrialDemand}%` }}
                  ></div>
                </div>
                <span className="text-xs w-8">{Math.round(resources.industrialDemand)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Activity */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Development Activity</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">New Developments</div>
              <div className="text-lg font-bold text-orange-400">
                {resources.developmentRate}/year
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Ready to Develop</div>
              <div className="text-lg font-bold text-cyan-400">
                {readyToDevelop} cells
              </div>
            </div>
          </div>
        </div>

        {/* Land Value Distribution */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Value Distribution</h4>
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <div className="text-red-400 font-bold">{zoningStats.lowValueCells}</div>
              <div className="text-xs text-gray-400">Low Value</div>
              <div className="text-xs text-gray-500">(&lt;$30)</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold">
                {zoningStats.totalZoned - zoningStats.highValueCells - zoningStats.lowValueCells}
              </div>
              <div className="text-xs text-gray-400">Medium Value</div>
              <div className="text-xs text-gray-500">($30-$100)</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">{zoningStats.highValueCells}</div>
              <div className="text-xs text-gray-400">High Value</div>
              <div className="text-xs text-gray-500">(&gt;$100)</div>
            </div>
          </div>
        </div>

        {/* Development Pressure Indicator */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Development Pressure</h4>
          <div className="bg-gray-700 p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">High Pressure Areas</span>
              <span className="text-sm font-bold text-red-400">{highPressureCells}</span>
            </div>
            <div className="text-xs text-gray-400">
              Areas with high development pressure (&gt;70%) are likely to upgrade soon
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Quick Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-left justify-start"
            >
              <span className="text-green-400 mr-2">🏠</span>
              Zone Residential (High Demand: {Math.round(resources.residentialDemand)}%)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-left justify-start"
            >
              <span className="text-blue-400 mr-2">🏢</span>
              Zone Commercial (Demand: {Math.round(resources.commercialDemand)}%)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-left justify-start"
            >
              <span className="text-purple-400 mr-2">🏭</span>
              Zone Industrial (Demand: {Math.round(resources.industrialDemand)}%)
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-900/30 p-2 rounded border border-blue-700">
          <div className="text-xs text-blue-300">
            <strong>💡 Tip:</strong> Land values update annually. High-value areas attract more development. 
            Provide good infrastructure and services to increase land values and property tax revenue.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}