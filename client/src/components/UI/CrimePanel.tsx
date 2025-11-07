import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useCityStore } from "../../lib/stores/useCityStore";
import { CrimeType } from "../../types/city";

export default function CrimePanel() {
  const { resources, grid } = useCityStore();

  // Calculate crime statistics
  const crimeStats = {
    totalPoliceStations: 0,
    highCrimeAreas: 0,
    safestArea: 100,
    mostDangerousArea: 0,
    crimeHotspots: [] as { x: number; z: number; score: number; type: string }[]
  };

  grid.forEach((row, x) => {
    row.forEach((cell, z) => {
      if (cell.buildingType === 'police_station') {
        crimeStats.totalPoliceStations++;
      }
      
      if (cell.crimeScore > 70) {
        crimeStats.highCrimeAreas++;
      }
      
      if (cell.crimeScore > 0) {
        crimeStats.safestArea = Math.min(crimeStats.safestArea, cell.crimeScore);
        crimeStats.mostDangerousArea = Math.max(crimeStats.mostDangerousArea, cell.crimeScore);
        
        if (cell.crimeScore > 60) {
          crimeStats.crimeHotspots.push({
            x, z, 
            score: cell.crimeScore, 
            type: cell.crimeType || 'none'
          });
        }
      }
    });
  });

  // Sort hotspots by crime score
  crimeStats.crimeHotspots.sort((a, b) => b.score - a.score);
  crimeStats.crimeHotspots = crimeStats.crimeHotspots.slice(0, 5); // Top 5 hotspots

  const getCrimeColor = (score: number) => {
    if (score < 20) return 'text-green-400';
    if (score < 40) return 'text-yellow-400';
    if (score < 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCrimeLevel = (score: number) => {
    if (score < 20) return 'Very Safe';
    if (score < 40) return 'Safe';
    if (score < 60) return 'Moderate';
    if (score < 80) return 'High Crime';
    return 'Dangerous';
  };

  const getCrimeTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      none: '✅',
      petty_theft: '👛',
      burglary: '🏠',
      vandalism: '🔨',
      drug_related: '💊',
      violent_crime: '⚔️',
      organized_crime: '🕴️',
      white_collar: '💼'
    };
    return icons[type] || '❓';
  };

  const getCrimeTypeName = (type: string) => {
    const names: Record<string, string> = {
      none: 'No Crime',
      petty_theft: 'Petty Theft',
      burglary: 'Burglary',
      vandalism: 'Vandalism',
      drug_related: 'Drug Related',
      violent_crime: 'Violent Crime',
      organized_crime: 'Organized Crime',
      white_collar: 'White Collar'
    };
    return names[type] || 'Unknown';
  };

  const formatNumber = (num: number) => Math.round(num).toLocaleString();

  return (
    <Card className="w-80 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🚔</span>
          Crime & Safety
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Crime Statistics */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">City Safety Overview</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Average Crime</div>
              <div className={`text-lg font-bold ${getCrimeColor(resources.averageCrimeScore)}`}>
                {Math.round(resources.averageCrimeScore)}/100
              </div>
              <div className="text-xs text-gray-400">
                {getCrimeLevel(resources.averageCrimeScore)}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Police Coverage</div>
              <div className="text-lg font-bold text-blue-400">
                {Math.round(resources.policeCoverage)}%
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Monthly Incidents</div>
              <div className="text-lg font-bold text-red-400">
                {formatNumber(resources.totalCrimeIncidents)}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Police Stations</div>
              <div className="text-lg font-bold text-cyan-400">
                {crimeStats.totalPoliceStations}
              </div>
            </div>
          </div>
        </div>

        {/* Crime Trend */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Crime Trend</h4>
          <div className="bg-gray-700 p-2 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm">Monthly Change</span>
              <span className={`text-sm font-bold ${
                resources.crimeReductionRate > 0 ? 'text-green-400' : 
                resources.crimeReductionRate < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {resources.crimeReductionRate > 0 ? '↓' : resources.crimeReductionRate < 0 ? '↑' : '→'}
                {Math.abs(resources.crimeReductionRate).toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {resources.crimeReductionRate > 0 ? 'Crime is decreasing' : 
               resources.crimeReductionRate < 0 ? 'Crime is increasing' : 'Crime is stable'}
            </div>
          </div>
        </div>

        {/* Crime by Type */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Crime Types</h4>
          <div className="space-y-1">
            {Object.entries(resources.crimeByType || {})
              .filter(([type, count]) => count > 0)
              .sort(([,a], [,b]) => (b as number) - (a as number))
              .slice(0, 5)
              .map(([type, count]) => (
                <div key={type} className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    <span>{getCrimeTypeIcon(type)}</span>
                    {getCrimeTypeName(type)}
                  </span>
                  <span className="text-red-400 font-bold">{formatNumber(count as number)}</span>
                </div>
              ))}
            {Object.values(resources.crimeByType || {}).every(count => count === 0) && (
              <div className="text-sm text-gray-400 text-center py-2">
                No crime incidents this month! 🎉
              </div>
            )}
          </div>
        </div>

        {/* Crime Hotspots */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Crime Hotspots</h4>
          <div className="space-y-1">
            {crimeStats.crimeHotspots.length > 0 ? (
              crimeStats.crimeHotspots.map((hotspot, index) => (
                <div key={index} className="bg-red-900/30 p-2 rounded border border-red-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {getCrimeTypeIcon(hotspot.type)} ({hotspot.x}, {hotspot.z})
                    </span>
                    <span className="text-red-400 font-bold text-sm">
                      {Math.round(hotspot.score)}/100
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {getCrimeTypeName(hotspot.type)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 text-center py-2">
                No major crime hotspots detected
              </div>
            )}
          </div>
        </div>

        {/* Safety Recommendations */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Safety Recommendations</h4>
          <div className="space-y-1">
            {resources.policeCoverage < 50 && (
              <div className="bg-blue-900/30 p-2 rounded border border-blue-700">
                <div className="text-xs text-blue-300">
                  <strong>🚔 Build more police stations</strong> - Only {Math.round(resources.policeCoverage)}% coverage
                </div>
              </div>
            )}
            {crimeStats.highCrimeAreas > 5 && (
              <div className="bg-red-900/30 p-2 rounded border border-red-700">
                <div className="text-xs text-red-300">
                  <strong>⚠️ Address high crime areas</strong> - {crimeStats.highCrimeAreas} dangerous zones
                </div>
              </div>
            )}
            {resources.averageCrimeScore > 60 && (
              <div className="bg-yellow-900/30 p-2 rounded border border-yellow-700">
                <div className="text-xs text-yellow-300">
                  <strong>📚 Improve education</strong> - Education reduces crime rates
                </div>
              </div>
            )}
            {resources.unemployment > 15 && (
              <div className="bg-purple-900/30 p-2 rounded border border-purple-700">
                <div className="text-xs text-purple-300">
                  <strong>💼 Create more jobs</strong> - High unemployment increases crime
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Budget Impact */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Criminal Justice Budget</h4>
          <div className="bg-gray-700 p-2 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm">Monthly Spending</span>
              <span className="text-yellow-400 font-bold">
                ${formatNumber(resources.criminalJusticeSpending)}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Police stations and law enforcement
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
              <span className="text-blue-400 mr-2">🚔</span>
              Build Police Station ($600)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-left justify-start"
            >
              <span className="text-green-400 mr-2">🏫</span>
              Build School ($500)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-left justify-start"
            >
              <span className="text-purple-400 mr-2">🏭</span>
              Zone Industrial (Jobs)
            </Button>
          </div>
        </div>

        {/* Crime Map Legend */}
        <div className="bg-gray-900/50 p-2 rounded border border-gray-600">
          <div className="text-xs text-gray-300 mb-2">
            <strong>Crime Map Legend:</strong>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Safe (0-20)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Low (20-40)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Medium (40-60)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>High (60+)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}