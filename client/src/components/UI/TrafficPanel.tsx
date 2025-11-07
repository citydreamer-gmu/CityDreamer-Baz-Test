import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useCityStore } from "../../lib/stores/useCityStore";

export default function TrafficPanel() {
  const { grid, resources } = useCityStore();

  // Calculate traffic statistics
  const trafficStats = grid.reduce((stats, row) => {
    row.forEach(cell => {
      if (cell.buildingType === 'road' || cell.buildingType === 'highway' || cell.buildingType === 'bridge') {
        stats.totalRoads++;
        stats.totalTraffic += cell.trafficFlow?.total || 0;
        
        if (cell.trafficLevel > 80) stats.heavyCongestion++;
        else if (cell.trafficLevel > 50) stats.moderateCongestion++;
        else if (cell.trafficLevel > 20) stats.lightTraffic++;
        else stats.freeFlow++;
        
        if (cell.buildingType === 'highway') stats.highways++;
        if (cell.buildingType === 'bridge') stats.bridges++;
      }
      
      // Count commuters
      if (cell.zoneType === 'residential' && cell.population) {
        stats.totalCommuters += Math.floor(cell.population * 0.6);
      }
      
      // Count transit stops
      if (cell.buildingType === 'bus_stop') stats.busStops++;
      if (cell.buildingType === 'subway_station') stats.subwayStations++;
      if (cell.buildingType === 'train_station') stats.trainStations++;
      if (cell.buildingType === 'transit_hub') stats.transitHubs++;
      if (cell.buildingType === 'monorail_station') stats.monorailStations++;
      if (cell.buildingType === 'traffic_light') stats.trafficLights++;
    });
    return stats;
  }, {
    totalRoads: 0,
    totalTraffic: 0,
    heavyCongestion: 0,
    moderateCongestion: 0,
    lightTraffic: 0,
    freeFlow: 0,
    highways: 0,
    bridges: 0,
    totalCommuters: 0,
    busStops: 0,
    subwayStations: 0,
    trainStations: 0,
    transitHubs: 0,
    monorailStations: 0,
    trafficLights: 0
  });

  const averageTraffic = trafficStats.totalRoads > 0 ? 
    trafficStats.totalTraffic / trafficStats.totalRoads : 0;

  const getTrafficColor = (level: number) => {
    if (level < 30) return "text-green-400";
    if (level < 60) return "text-yellow-400";
    if (level < 80) return "text-orange-400";
    return "text-red-400";
  };

  const getProgressColor = (level: number) => {
    if (level < 30) return "bg-green-500";
    if (level < 60) return "bg-yellow-500";
    if (level < 80) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStatusColor = (value: number, thresholds = { good: 70, ok: 40 }) => {
    if (value >= thresholds.good) return "text-green-400";
    if (value >= thresholds.ok) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="w-64 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚗 Traffic System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Traffic Flow */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Traffic Flow</span>
            <span className={`font-mono text-sm ${getTrafficColor(100 - resources.trafficFlow)}`}>
              {resources.trafficFlow.toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={resources.trafficFlow} className="h-3" />
            <div className={`absolute top-0 left-0 h-3 rounded ${getProgressColor(100 - resources.trafficFlow)}`} 
                 style={{width: `${Math.min(100, resources.trafficFlow)}%`}}></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {resources.trafficFlow >= 80 ? "Excellent flow" :
             resources.trafficFlow >= 60 ? "Good flow" :
             resources.trafficFlow >= 40 ? "Moderate congestion" : "Heavy congestion"}
          </div>
        </div>

        {/* Road Network Stats */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🛣️ Infrastructure</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Roads</span>
              <span className="text-xs font-mono">{trafficStats.totalRoads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Highways</span>
              <span className="text-xs font-mono">{trafficStats.highways}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Bridges</span>
              <span className="text-xs font-mono">{trafficStats.bridges}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Traffic Lights</span>
              <span className="text-xs font-mono">{trafficStats.trafficLights}</span>
            </div>
          </div>
        </div>

        {/* Traffic Conditions */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🚦 Conditions</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Free Flow</span>
              </div>
              <span className="text-xs font-mono">{trafficStats.freeFlow}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Light Traffic</span>
              </div>
              <span className="text-xs font-mono">{trafficStats.lightTraffic}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs">Moderate</span>
              </div>
              <span className="text-xs font-mono">{trafficStats.moderateCongestion}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">Heavy Congestion</span>
              </div>
              <span className="text-xs font-mono">{trafficStats.heavyCongestion}</span>
            </div>
          </div>
        </div>

        {/* Public Transit */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🚌 Public Transit</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Transit Coverage</span>
                <span className={`text-xs font-mono ${getStatusColor(resources.transitCoverage, { good: 60, ok: 30 })}`}>
                  {resources.transitCoverage.toFixed(0)}%
                </span>
              </div>
              <div className="relative">
                <Progress value={resources.transitCoverage} className="h-2" />
                <div className={`absolute top-0 left-0 h-2 rounded ${getProgressColor(resources.transitCoverage, { good: 60, ok: 30 })}`} 
                     style={{width: `${Math.min(100, resources.transitCoverage)}%`}}></div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Bus Stops</span>
                <span className="text-xs font-mono">{trafficStats.busStops}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Subway Stations</span>
                <span className="text-xs font-mono">{trafficStats.subwayStations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Train Stations</span>
                <span className="text-xs font-mono">{trafficStats.trainStations || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Transit Hubs</span>
                <span className="text-xs font-mono">{trafficStats.transitHubs || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Daily Riders</span>
                <span className="text-xs font-mono">{resources.transitRidership.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="border-t border-gray-600 pt-2">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">💡 Traffic Tips</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Build highways for high-capacity routes</p>
            <p>• Add traffic lights at busy intersections</p>
            <p>• Public transit reduces road congestion</p>
            <p>• Connect residential to commercial areas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}