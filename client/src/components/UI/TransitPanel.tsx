import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useCityStore } from "../../lib/stores/useCityStore";

export default function TransitPanel() {
  const { grid, resources } = useCityStore();

  // Calculate transit system statistics
  const transitStats = grid.reduce((stats, row) => {
    row.forEach(cell => {
      // Count transit infrastructure
      if (cell.buildingType === 'bus_stop') stats.busStops++;
      if (cell.buildingType === 'subway_station') stats.subwayStations++;
      if (cell.buildingType === 'train_station') stats.trainStations++;
      if (cell.buildingType === 'monorail_station') stats.monorailStations++;
      if (cell.buildingType === 'transit_hub') stats.transitHubs++;
      
      // Count tracks
      if (cell.buildingType === 'subway_track') stats.subwayTracks++;
      if (cell.buildingType === 'train_track') stats.trainTracks++;
      if (cell.buildingType === 'monorail_track') stats.monorailTracks++;
      
      // Count ridership and access
      if (cell.transitRidership) stats.totalRiders += cell.transitRidership;
      if (cell.transitAccess > 0) {
        stats.totalAccess += cell.transitAccess;
        stats.accessibleCells++;
      }
      
      // Access level distribution
      if (cell.transitAccess >= 80) stats.excellentAccess++;
      else if (cell.transitAccess >= 60) stats.goodAccess++;
      else if (cell.transitAccess >= 40) stats.fairAccess++;
      else if (cell.transitAccess >= 20) stats.poorAccess++;
      else if (cell.zoneType !== 'empty' || cell.buildingType) stats.noAccess++;
      
      stats.totalCells++;
    });
    return stats;
  }, {
    busStops: 0,
    subwayStations: 0,
    trainStations: 0,
    monorailStations: 0,
    transitHubs: 0,
    subwayTracks: 0,
    trainTracks: 0,
    monorailTracks: 0,
    totalRiders: 0,
    totalAccess: 0,
    accessibleCells: 0,
    excellentAccess: 0,
    goodAccess: 0,
    fairAccess: 0,
    poorAccess: 0,
    noAccess: 0,
    totalCells: 0
  });

  const averageAccess = transitStats.accessibleCells > 0 ? 
    transitStats.totalAccess / transitStats.accessibleCells : 0;

  const getAccessColor = (level: number) => {
    if (level >= 70) return "text-green-400";
    if (level >= 50) return "text-yellow-400";
    if (level >= 30) return "text-orange-400";
    return "text-red-400";
  };

  const getProgressColor = (level: number) => {
    if (level >= 70) return "bg-green-500";
    if (level >= 50) return "bg-yellow-500";
    if (level >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-64 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚇 Transit System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Transit Performance */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">System Coverage</span>
            <span className={`font-mono text-sm ${getAccessColor(resources.transitCoverage)}`}>
              {resources.transitCoverage.toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={resources.transitCoverage} className="h-3" />
            <div className={`absolute top-0 left-0 h-3 rounded ${getProgressColor(resources.transitCoverage)}`} 
                 style={{width: `${Math.min(100, resources.transitCoverage)}%`}}></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {resources.transitCoverage >= 70 ? "Excellent coverage" :
             resources.transitCoverage >= 50 ? "Good coverage" :
             resources.transitCoverage >= 30 ? "Fair coverage" : "Poor coverage"}
          </div>
        </div>

        {/* Transit Efficiency */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">System Efficiency</span>
            <span className={`font-mono text-sm ${getAccessColor(resources.transitEfficiency)}`}>
              {resources.transitEfficiency.toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={resources.transitEfficiency} className="h-3" />
            <div className={`absolute top-0 left-0 h-3 rounded ${getProgressColor(resources.transitEfficiency)}`} 
                 style={{width: `${Math.min(100, resources.transitEfficiency)}%`}}></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {resources.transitRidership.toLocaleString()} daily riders
          </div>
        </div>

        {/* Transit Infrastructure */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🚉 Stations</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs">Bus Stops</span>
              </div>
              <span className="text-xs font-mono">{transitStats.busStops}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="text-xs">Subway</span>
              </div>
              <span className="text-xs font-mono">{transitStats.subwayStations}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-700 rounded-full"></div>
                <span className="text-xs">Train</span>
              </div>
              <span className="text-xs font-mono">{transitStats.trainStations}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span className="text-xs">Monorail</span>
              </div>
              <span className="text-xs font-mono">{transitStats.monorailStations}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-700 rounded-full"></div>
                <span className="text-xs">Transit Hubs</span>
              </div>
              <span className="text-xs font-mono">{transitStats.transitHubs}</span>
            </div>
          </div>
        </div>

        {/* Track Network */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🛤️ Track Network</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Subway Tracks</span>
                {transitStats.subwayTracks > 0 && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs font-mono">{transitStats.subwayTracks}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Train Tracks</span>
                {transitStats.trainTracks > 0 && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs font-mono">{transitStats.trainTracks}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Monorail Tracks</span>
                {transitStats.monorailTracks > 0 && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs font-mono">{transitStats.monorailTracks}</span>
            </div>
          </div>
        </div>

        {/* Access Distribution */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">📍 Access Quality</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Excellent</span>
              </div>
              <span className="text-xs font-mono">{transitStats.excellentAccess}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Good</span>
              </div>
              <span className="text-xs font-mono">{transitStats.goodAccess}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs">Fair</span>
              </div>
              <span className="text-xs font-mono">{transitStats.fairAccess}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">Poor/None</span>
              </div>
              <span className="text-xs font-mono">{transitStats.poorAccess + transitStats.noAccess}</span>
            </div>
          </div>
        </div>

        {/* Train Indicators */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🚂 Active Trains</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 bg-blue-600 rounded"></div>
              <span>Blue trains on train tracks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 bg-orange-600 rounded"></div>
              <span>Orange indicators on subway tracks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 bg-purple-600 rounded"></div>
              <span>Purple monorail cars</span>
            </div>
            <p className="mt-2">• Trains appear when ridership &gt; 0</p>
            <p>• Trains move automatically along tracks</p>
          </div>
        </div>

        {/* Tips */}
        <div className="border-t border-gray-600 pt-2">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">💡 Transit Tips</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Connect stations with tracks for efficiency</p>
            <p>• Transit hubs serve multiple transit types</p>
            <p>• Good transit reduces road traffic</p>
            <p>• Place stations near residential areas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}