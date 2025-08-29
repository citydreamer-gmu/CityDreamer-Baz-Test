import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useCityStore } from "../../lib/stores/useCityStore";

export default function ResourcePanel() {
  const { resources } = useCityStore();

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const powerPercentage = resources.powerCapacity > 0 ? 
    (resources.power / resources.powerCapacity) * 100 : 0;
  const waterPercentage = resources.waterCapacity > 0 ? 
    (resources.water / resources.waterCapacity) * 100 : 0;

  return (
    <Card className="w-64 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle>City Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Budget</span>
            <span className="text-green-400 font-mono">${formatNumber(resources.budget)}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Population</span>
            <span className="text-white font-mono">{formatNumber(resources.population)}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Power</span>
            <span className="text-yellow-400 font-mono">
              {formatNumber(resources.power)} / {formatNumber(resources.powerCapacity)}
            </span>
          </div>
          <Progress 
            value={powerPercentage} 
            className="h-2"
          />
          <div className="text-xs text-gray-400 mt-1">
            {powerPercentage.toFixed(0)}% available
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Water</span>
            <span className="text-blue-400 font-mono">
              {formatNumber(resources.water)} / {formatNumber(resources.waterCapacity)}
            </span>
          </div>
          <Progress 
            value={waterPercentage} 
            className="h-2"
          />
          <div className="text-xs text-gray-400 mt-1">
            {waterPercentage.toFixed(0)}% available
          </div>
        </div>

        <div className="border-t border-gray-600 pt-2">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Tips</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Build power plants to increase power capacity</p>
            <p>• Water facilities provide water for your city</p>
            <p>• Zones need power and water to develop</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
