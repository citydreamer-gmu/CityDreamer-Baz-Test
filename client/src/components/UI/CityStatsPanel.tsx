import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useCityStore } from "../../lib/stores/useCityStore";

export default function CityStatsPanel() {
  const { resources } = useCityStore();

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return num >= 0 ? `+$${formatNumber(num)}` : `-$${formatNumber(Math.abs(num))}`;
  };

  const getStatusColor = (value: number, thresholds = { good: 70, ok: 40 }) => {
    if (value >= thresholds.good) return "text-green-400";
    if (value >= thresholds.ok) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressColor = (value: number, thresholds = { good: 70, ok: 40 }) => {
    if (value >= thresholds.good) return "bg-green-500";
    if (value >= thresholds.ok) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-64 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle>City Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Economic Overview */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">💰 Economy</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Monthly Income</span>
              <span className="text-green-400 font-mono text-xs">
                {formatCurrency(resources.monthlyIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Monthly Expenses</span>
              <span className="text-red-400 font-mono text-xs">
                -{formatCurrency(resources.monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Net Income</span>
              <span className={`font-mono text-xs ${
                (resources.monthlyIncome - resources.monthlyExpenses) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(resources.monthlyIncome - resources.monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Unemployment</span>
              <span className={`font-mono text-xs ${getStatusColor(100 - resources.unemployment)}`}>
                {resources.unemployment.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* City Services */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🏛️ Services</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Education</span>
                <span className={`text-xs font-mono ${getStatusColor(resources.education)}`}>
                  {resources.education.toFixed(0)}%
                </span>
              </div>
              <div className="relative">
                <Progress value={resources.education} className="h-2" />
                <div className={`absolute top-0 left-0 h-2 rounded ${getProgressColor(resources.education)}`} 
                     style={{width: `${Math.min(100, resources.education)}%`}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Healthcare</span>
                <span className={`text-xs font-mono ${getStatusColor(resources.healthcare)}`}>
                  {resources.healthcare.toFixed(0)}%
                </span>
              </div>
              <div className="relative">
                <Progress value={resources.healthcare} className="h-2" />
                <div className={`absolute top-0 left-0 h-2 rounded ${getProgressColor(resources.healthcare)}`} 
                     style={{width: `${Math.min(100, resources.healthcare)}%`}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Safety</span>
                <span className={`text-xs font-mono ${getStatusColor(resources.safety)}`}>
                  {resources.safety.toFixed(0)}%
                </span>
              </div>
              <div className="relative">
                <Progress value={resources.safety} className="h-2" />
                <div className={`absolute top-0 left-0 h-2 rounded ${getProgressColor(resources.safety)}`} 
                     style={{width: `${Math.min(100, resources.safety)}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Environment */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🌍 Environment</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Pollution</span>
                <span className={`text-xs font-mono ${getStatusColor(100 - resources.pollution)}`}>
                  {resources.pollution.toFixed(0)}%
                </span>
              </div>
              <div className="relative">
                <Progress value={resources.pollution} className="h-2" />
                <div className="absolute top-0 left-0 h-2 rounded bg-red-500" 
                     style={{width: `${Math.min(100, resources.pollution)}%`}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Green Space</span>
                <span className={`text-xs font-mono ${getStatusColor(resources.greenSpace, { good: 15, ok: 8 })}`}>
                  {resources.greenSpace.toFixed(1)}%
                </span>
              </div>
              <div className="relative">
                <Progress value={resources.greenSpace} className="h-2" />
                <div className={`absolute top-0 left-0 h-2 rounded ${getProgressColor(resources.greenSpace, { good: 15, ok: 8 })}`} 
                     style={{width: `${Math.min(100, resources.greenSpace * 5)}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-300">🚗 Infrastructure</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Traffic Flow</span>
                <span className={`text-xs font-mono ${getStatusColor(resources.trafficFlow)}`}>
                  {resources.trafficFlow.toFixed(0)}%
                </span>
              </div>
              <div className="relative">
                <Progress value={resources.trafficFlow} className="h-2" />
                <div className={`absolute top-0 left-0 h-2 rounded ${getProgressColor(resources.trafficFlow)}`} 
                     style={{width: `${Math.min(100, resources.trafficFlow)}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="border-t border-gray-600 pt-2">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">💡 Tips</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Build parks to reduce pollution</p>
            <p>• Universities boost education</p>
            <p>• Transit reduces traffic</p>
            <p>• Balance jobs and workers</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}