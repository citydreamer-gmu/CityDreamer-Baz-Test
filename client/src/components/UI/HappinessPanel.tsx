import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useCityStore } from "../../lib/stores/useCityStore";

export default function HappinessPanel() {
  const { resources, grid } = useCityStore();

  // Calculate happiness statistics
  const happinessStats = grid.reduce((stats, row) => {
    row.forEach(cell => {
      if (cell.zoneType !== 'empty') {
        stats.total++;
        if (cell.happiness >= 80) stats.veryHappy++;
        else if (cell.happiness >= 60) stats.happy++;
        else if (cell.happiness >= 40) stats.neutral++;
        else if (cell.happiness >= 20) stats.unhappy++;
        else stats.veryUnhappy++;
      }
    });
    return stats;
  }, { total: 0, veryHappy: 0, happy: 0, neutral: 0, unhappy: 0, veryUnhappy: 0 });

  const getHappinessColor = (happiness: number) => {
    if (happiness >= 80) return "text-green-400";
    if (happiness >= 60) return "text-green-300";
    if (happiness >= 40) return "text-yellow-400";
    if (happiness >= 20) return "text-orange-400";
    return "text-red-400";
  };

  const getHappinessLevel = (happiness: number) => {
    if (happiness >= 80) return "Very Happy";
    if (happiness >= 60) return "Happy";
    if (happiness >= 40) return "Neutral";
    if (happiness >= 20) return "Unhappy";
    return "Very Unhappy";
  };

  return (
    <Card className="w-64 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle>Citizen Happiness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Overall Happiness</span>
            <span className={`font-mono ${getHappinessColor(resources.happiness)}`}>
              {resources.happiness.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={resources.happiness} 
            className="h-3"
          />
          <div className={`text-xs mt-1 ${getHappinessColor(resources.happiness)}`}>
            {getHappinessLevel(resources.happiness)}
          </div>
        </div>

        {happinessStats.total > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-300">Happiness Distribution</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-green-400">Very Happy</span>
                <span>{happinessStats.veryHappy} zones</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300">Happy</span>
                <span>{happinessStats.happy} zones</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">Neutral</span>
                <span>{happinessStats.neutral} zones</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400">Unhappy</span>
                <span>{happinessStats.unhappy} zones</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">Very Unhappy</span>
                <span>{happinessStats.veryUnhappy} zones</span>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-600 pt-2">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Happiness Factors</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Roads: +10 happiness</p>
            <p>• Power: +15 happiness</p>
            <p>• Water: +15 happiness</p>
            <p>• Schools: +5 per nearby school</p>
            <p>• Hospitals: +5 per nearby hospital</p>
            <p>• Police: +3 per nearby station</p>
            <p>• Pollution: Reduces happiness</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
