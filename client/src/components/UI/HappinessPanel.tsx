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
        stats.totalHappiness += cell.happiness;
        if (cell.happiness >= 80) stats.veryHappy++;
        else if (cell.happiness >= 60) stats.happy++;
        else if (cell.happiness >= 40) stats.neutral++;
        else if (cell.happiness >= 20) stats.unhappy++;
        else stats.veryUnhappy++;
      }
    });
    return stats;
  }, { total: 0, totalHappiness: 0, veryHappy: 0, happy: 0, neutral: 0, unhappy: 0, veryUnhappy: 0 });

  // Calculate average happiness from actual grid data
  const avgHappiness = happinessStats.total > 0 ? happinessStats.totalHappiness / happinessStats.total : 50;

  const getHappinessColor = (happiness: number) => {
    if (happiness >= 80) return "text-green-400";
    if (happiness >= 60) return "text-green-300";
    if (happiness >= 40) return "text-yellow-400";
    if (happiness >= 20) return "text-orange-400";
    return "text-red-400";
  };

  const getHappinessLevel = (happiness: number) => {
    if (happiness >= 80) return "Thriving 😊";
    if (happiness >= 60) return "Content 😌";
    if (happiness >= 40) return "Neutral 😐";
    if (happiness >= 20) return "Frustrated 😕";
    return "Miserable 😢";
  };

  const getProgressBarColor = (happiness: number) => {
    if (happiness >= 80) return "bg-green-500";
    if (happiness >= 60) return "bg-green-400";
    if (happiness >= 40) return "bg-yellow-400";
    if (happiness >= 20) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <Card className="w-64 bg-gray-800 text-white border-gray-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Citizen Happiness
          <span className="text-2xl">
            {avgHappiness >= 80 ? "😊" : avgHappiness >= 60 ? "😌" : avgHappiness >= 40 ? "😐" : avgHappiness >= 20 ? "😕" : "😢"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Overall Happiness</span>
            <span className={`font-mono text-lg font-bold ${getHappinessColor(avgHappiness)}`}>
              {avgHappiness.toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={avgHappiness} 
              className="h-4"
            />
            <div className={`absolute top-0 left-0 h-4 rounded ${getProgressBarColor(avgHappiness)}`} 
                 style={{width: `${Math.min(100, avgHappiness)}%`}}></div>
          </div>
          <div className={`text-sm mt-2 font-semibold ${getHappinessColor(avgHappiness)}`}>
            {getHappinessLevel(avgHappiness)}
          </div>
        </div>

        {happinessStats.total > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-300">Zone Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Thriving</span>
                </div>
                <span className="text-xs font-mono">{happinessStats.veryHappy}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-xs">Content</span>
                </div>
                <span className="text-xs font-mono">{happinessStats.happy}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-xs">Neutral</span>
                </div>
                <span className="text-xs font-mono">{happinessStats.neutral}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-xs">Frustrated</span>
                </div>
                <span className="text-xs font-mono">{happinessStats.unhappy}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-xs">Miserable</span>
                </div>
                <span className="text-xs font-mono">{happinessStats.veryUnhappy}</span>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-600 pt-3">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">💡 Happiness Tips</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>🛣️ Roads: +10 happiness</p>
            <p>⚡ Power: +15 happiness</p>
            <p>💧 Water: +15 happiness</p>
            <p>🏫 Schools: +5 per nearby</p>
            <p>🏥 Hospitals: +5 per nearby</p>
            <p>👮 Police: +3 per nearby</p>
            <p>🏭 Pollution: Reduces happiness</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
