import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useCityStore } from "../../lib/stores/useCityStore";
import { ZoneType, BuildingType } from "../../types/city";

export default function ZoningPanel() {
  const { selectedTool, setSelectedTool } = useCityStore();

  const zoneTools = [
    { type: ZoneType.EMPTY, name: "Clear", color: "bg-gray-500", cost: 0 },
    { type: ZoneType.RESIDENTIAL, name: "Residential", color: "bg-green-500", cost: 100 },
    { type: ZoneType.COMMERCIAL, name: "Commercial", color: "bg-blue-500", cost: 200 },
    { type: ZoneType.INDUSTRIAL, name: "Industrial", color: "bg-purple-500", cost: 300 }
  ];

  const infrastructureTools = [
    { type: BuildingType.ROAD, name: "Road", color: "bg-gray-700", cost: 50 },
    { type: BuildingType.HIGHWAY, name: "Highway", color: "bg-gray-800", cost: 150 },
    { type: BuildingType.BRIDGE, name: "Bridge", color: "bg-amber-700", cost: 500 },
    { type: BuildingType.TRAFFIC_LIGHT, name: "Traffic Light", color: "bg-red-600", cost: 75 },
    { type: BuildingType.POWER_LINE, name: "Power Line", color: "bg-yellow-400", cost: 25 },
    { type: BuildingType.POWER_SUBSTATION, name: "Substation", color: "bg-yellow-600", cost: 300 }
  ];

  const transitTools = [
    { type: BuildingType.BUS_STOP, name: "Bus Stop", color: "bg-blue-500", cost: 100 },
    { type: BuildingType.SUBWAY_STATION, name: "Subway Station", color: "bg-orange-600", cost: 2000 },
    { type: BuildingType.SUBWAY_TRACK, name: "Subway Track", color: "bg-orange-700", cost: 200 },
    { type: BuildingType.TRAIN_STATION, name: "Train Station", color: "bg-green-700", cost: 3500 },
    { type: BuildingType.TRAIN_TRACK, name: "Train Track", color: "bg-green-800", cost: 300 },
    { type: BuildingType.MONORAIL_STATION, name: "Monorail Station", color: "bg-purple-600", cost: 2500 },
    { type: BuildingType.MONORAIL_TRACK, name: "Monorail Track", color: "bg-purple-700", cost: 400 },
    { type: BuildingType.TRANSIT_HUB, name: "Transit Hub", color: "bg-indigo-700", cost: 5000 }
  ];

  const industrialTools = [
    { type: BuildingType.WAREHOUSE, name: "Warehouse", color: "bg-gray-500", cost: 1500 },
    { type: BuildingType.FACTORY, name: "Factory", color: "bg-amber-800", cost: 2500 },
    { type: BuildingType.MINING_FACILITY, name: "Mining", color: "bg-yellow-800", cost: 3000 },
    { type: BuildingType.OIL_REFINERY, name: "Oil Refinery", color: "bg-gray-800", cost: 8000 },
    { type: BuildingType.STEEL_MILL, name: "Steel Mill", color: "bg-red-800", cost: 6000 },
    { type: BuildingType.CHEMICAL_PLANT, name: "Chemical Plant", color: "bg-green-800", cost: 7000 },
    { type: BuildingType.ELECTRONICS_FACTORY, name: "Electronics", color: "bg-blue-600", cost: 5000 },
    { type: BuildingType.FOOD_PROCESSING, name: "Food Plant", color: "bg-orange-600", cost: 3500 },
    { type: BuildingType.CARGO_TERMINAL, name: "Cargo Terminal", color: "bg-yellow-700", cost: 4000 },
    { type: BuildingType.SHIPPING_DOCK, name: "Shipping Dock", color: "bg-blue-800", cost: 6000 },
    { type: BuildingType.FREIGHT_RAIL_TERMINAL, name: "Freight Rail", color: "bg-green-900", cost: 5500 },
    { type: BuildingType.HIGHWAY_CONNECTION, name: "Highway Exit", color: "bg-gray-900", cost: 2000 },
    { type: BuildingType.RAIL_CONNECTION, name: "Rail Connection", color: "bg-green-700", cost: 3000 }
  ];

  const buildingTools = [
    { type: BuildingType.POWER_PLANT, name: "Power Plant", color: "bg-yellow-500", cost: 1000 },
    { type: BuildingType.WATER_FACILITY, name: "Water Facility", color: "bg-cyan-500", cost: 800 },
    { type: BuildingType.SCHOOL, name: "School", color: "bg-green-600", cost: 500 },
    { type: BuildingType.HOSPITAL, name: "Hospital", color: "bg-red-500", cost: 800 },
    { type: BuildingType.POLICE_STATION, name: "Police", color: "bg-blue-800", cost: 600 },
    { type: BuildingType.FIRE_STATION, name: "Fire Station", color: "bg-red-700", cost: 600 },
    { type: BuildingType.PARK, name: "Park", color: "bg-green-400", cost: 200 },
    { type: BuildingType.LIBRARY, name: "Library", color: "bg-amber-600", cost: 400 },
    { type: BuildingType.UNIVERSITY, name: "University", color: "bg-purple-600", cost: 1200 },
    { type: BuildingType.WASTE_FACILITY, name: "Waste Plant", color: "bg-gray-600", cost: 700 },
    { type: BuildingType.CITY_HALL, name: "City Hall", color: "bg-yellow-600", cost: 1500 },
    { type: BuildingType.STADIUM, name: "Stadium", color: "bg-indigo-600", cost: 3000 }
  ];

  return (
    <Card className="w-64 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle>Zoning & Buildings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Zones</h4>
          <div className="grid grid-cols-1 gap-2">
            {zoneTools.map((tool) => (
              <Button
                key={tool.type}
                variant={selectedTool === tool.type ? "default" : "outline"}
                onClick={() => setSelectedTool(selectedTool === tool.type ? null : tool.type)}
                className="justify-start text-left bg-gray-700 border-gray-600 hover:bg-gray-600"
              >
                <div className={`w-4 h-4 rounded mr-2 ${tool.color}`} />
                <span className="flex-1">{tool.name}</span>
                <span className="text-xs text-gray-400">${tool.cost}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Infrastructure</h4>
          <div className="grid grid-cols-1 gap-2">
            {infrastructureTools.map((tool) => (
              <Button
                key={tool.type}
                variant={selectedTool === tool.type ? "default" : "outline"}
                onClick={() => setSelectedTool(selectedTool === tool.type ? null : tool.type)}
                className="justify-start text-left bg-gray-700 border-gray-600 hover:bg-gray-600"
              >
                <div className={`w-4 h-4 rounded mr-2 ${tool.color}`} />
                <span className="flex-1">{tool.name}</span>
                <span className="text-xs text-gray-400">${tool.cost}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Public Transit</h4>
          <div className="grid grid-cols-1 gap-2">
            {transitTools.map((tool) => (
              <Button
                key={tool.type}
                variant={selectedTool === tool.type ? "default" : "outline"}
                onClick={() => setSelectedTool(selectedTool === tool.type ? null : tool.type)}
                className="justify-start text-left bg-gray-700 border-gray-600 hover:bg-gray-600"
              >
                <div className={`w-4 h-4 rounded mr-2 ${tool.color}`} />
                <span className="flex-1">{tool.name}</span>
                <span className="text-xs text-gray-400">${tool.cost}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Industrial</h4>
          <div className="grid grid-cols-1 gap-2">
            {industrialTools.map((tool) => (
              <Button
                key={tool.type}
                variant={selectedTool === tool.type ? "default" : "outline"}
                onClick={() => setSelectedTool(selectedTool === tool.type ? null : tool.type)}
                className="justify-start text-left bg-gray-700 border-gray-600 hover:bg-gray-600"
              >
                <div className={`w-4 h-4 rounded mr-2 ${tool.color}`} />
                <span className="flex-1">{tool.name}</span>
                <span className="text-xs text-gray-400">${tool.cost}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Buildings</h4>
          <div className="grid grid-cols-1 gap-2">
            {buildingTools.map((tool) => (
              <Button
                key={tool.type}
                variant={selectedTool === tool.type ? "default" : "outline"}
                onClick={() => setSelectedTool(selectedTool === tool.type ? null : tool.type)}
                className="justify-start text-left bg-gray-700 border-gray-600 hover:bg-gray-600"
              >
                <div className={`w-4 h-4 rounded mr-2 ${tool.color}`} />
                <span className="flex-1">{tool.name}</span>
                <span className="text-xs text-gray-400">${tool.cost}</span>
              </Button>
            ))}
          </div>
        </div>

        {selectedTool && (
          <div className="border-t border-gray-600 pt-2">
            <p className="text-sm text-gray-300">
              Selected: <span className="text-white">{selectedTool.replace('_', ' ').toUpperCase()}</span>
            </p>
            <p className="text-xs text-gray-400">Click on the grid to place</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
