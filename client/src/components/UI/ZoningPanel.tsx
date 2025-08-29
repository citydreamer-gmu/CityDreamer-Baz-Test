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

  const buildingTools = [
    { type: BuildingType.ROAD, name: "Road", color: "bg-gray-700", cost: 50 },
    { type: BuildingType.POWER_PLANT, name: "Power Plant", color: "bg-yellow-500", cost: 1000 },
    { type: BuildingType.WATER_FACILITY, name: "Water Facility", color: "bg-cyan-500", cost: 800 },
    { type: BuildingType.SCHOOL, name: "School", color: "bg-green-600", cost: 500 },
    { type: BuildingType.HOSPITAL, name: "Hospital", color: "bg-red-500", cost: 800 },
    { type: BuildingType.POLICE_STATION, name: "Police", color: "bg-blue-800", cost: 600 },
    { type: BuildingType.FIRE_STATION, name: "Fire Station", color: "bg-red-700", cost: 600 }
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
