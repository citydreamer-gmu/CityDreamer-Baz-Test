import ZoningPanel from "./ZoningPanel";
import ResourcePanel from "./ResourcePanel";
import HappinessPanel from "./HappinessPanel";
import { useCityStore } from "../../lib/stores/useCityStore";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function GameUI() {
  const { 
    isSimulationRunning, 
    toggleSimulation, 
    saveCity, 
    loadCity, 
    resetCity,
    simulationSpeed,
    setSimulationSpeed 
  } = useCityStore();

  const handleSave = () => {
    saveCity();
    console.log("City saved!");
  };

  const handleLoad = () => {
    const success = loadCity();
    console.log(success ? "City loaded!" : "No saved city found!");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the city? This cannot be undone.")) {
      resetCity();
      console.log("City reset!");
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar with game controls */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="flex gap-2">
          <Button
            variant={isSimulationRunning ? "destructive" : "default"}
            onClick={toggleSimulation}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            {isSimulationRunning ? "Pause" : "Play"}
          </Button>
          <select
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(Number(e.target.value))}
            className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </div>
      </div>

      {/* Left side panels - all visible at once */}
      <div className="absolute top-4 left-4 pointer-events-auto flex flex-col gap-4">
        <ZoningPanel />
        <ResourcePanel />
        <HappinessPanel />
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 pointer-events-auto">
        <Card className="p-4 bg-gray-800 text-white border-gray-600">
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="outline" className="border-gray-600 hover:bg-gray-700">
              Save City
            </Button>
            <Button onClick={handleLoad} variant="outline" className="border-gray-600 hover:bg-gray-700">
              Load City
            </Button>
            <Button onClick={handleReset} variant="destructive">
              Reset City
            </Button>
          </div>
        </Card>
      </div>

      {/* Instructions moved to top left corner */}
      <div className="absolute top-4 right-72 pointer-events-auto">
        <Card className="p-3 bg-gray-800 text-white border-gray-600 max-w-xs">
          <h3 className="text-sm font-bold mb-2">Controls</h3>
          <div className="text-xs space-y-1">
            <p><strong>WASD/Arrows:</strong> Move camera</p>
            <p><strong>Q/E:</strong> Up/Down</p>
            <p><strong>Click:</strong> Place zones/buildings</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
