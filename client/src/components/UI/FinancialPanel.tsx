import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useCityStore } from "../../lib/stores/useCityStore";
import { BudgetAlertType, CreditRating } from "../../types/city";

export default function FinancialPanel() {
  const { resources } = useCityStore();

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${Math.round(value).toLocaleString()}`;
  };

  const formatPercent = (value: number) => `${Math.round(value * 10) / 10}%`;

  const getCashFlowColor = (cashFlow: number) => {
    if (cashFlow > 0) return 'text-green-400';
    if (cashFlow < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getCreditRatingColor = (rating: string) => {
    if (['AAA', 'AA', 'A'].includes(rating)) return 'text-green-400';
    if (['BBB', 'BB'].includes(rating)) return 'text-yellow-400';
    if (['B', 'CCC'].includes(rating)) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-900/20';
      default: return 'border-blue-500 bg-blue-900/20';
    }
  };

  const getAlertIcon = (type: BudgetAlertType) => {
    const icons = {
      [BudgetAlertType.LOW_FUNDS]: '💰',
      [BudgetAlertType.DEFICIT]: '📉',
      [BudgetAlertType.HIGH_DEBT]: '💳',
      [BudgetAlertType.CREDIT_DOWNGRADE]: '📊',
      [BudgetAlertType.INFRASTRUCTURE_DECAY]: '🏗️',
      [BudgetAlertType.SERVICE_UNDERFUNDING]: '🏥'
    };
    return icons[type] || '⚠️';
  };

  // Calculate financial health score
  const calculateFinancialHealth = () => {
    let score = 100;
    
    if ((resources.cashFlow || 0) < 0) score -= 30;
    if ((resources.budget || 0) < (resources.monthlyExpenses || 0)) score -= 20;
    if ((resources.debt || 0) > (resources.monthlyIncome || 0) * 6) score -= 25;
    if (['B', 'CCC', 'CC', 'C', 'D'].includes(resources.creditRating || 'A')) score -= 15;
    
    return Math.max(0, score);
  };

  const financialHealth = calculateFinancialHealth();
  const healthColor = financialHealth > 80 ? 'text-green-400' : 
                     financialHealth > 60 ? 'text-yellow-400' : 
                     financialHealth > 40 ? 'text-orange-400' : 'text-red-400';

  return (
    <Card className="w-80 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>💰</span>
          City Finances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Financial Overview */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Financial Overview</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Budget</div>
              <div className={`text-lg font-bold ${resources.budget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(resources.budget)}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Cash Flow</div>
              <div className={`text-lg font-bold ${getCashFlowColor(resources.cashFlow)}`}>
                {formatCurrency(resources.cashFlow)}/mo
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Credit Rating</div>
              <div className={`text-lg font-bold ${getCreditRatingColor(resources.creditRating)}`}>
                {resources.creditRating}
              </div>
              <div className="text-xs text-gray-400">
                {formatPercent(resources.interestRate)} interest
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Financial Health</div>
              <div className={`text-lg font-bold ${healthColor}`}>
                {financialHealth}/100
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Income Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Monthly Income: {formatCurrency(resources.taxRevenue?.total || 0)}</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2">
                <span className="text-green-400">🏠</span>
                Residential Tax
              </span>
              <span className="text-green-400 font-bold">{formatCurrency(resources.taxRevenue?.residential || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2">
                <span className="text-blue-400">🏢</span>
                Commercial Tax
              </span>
              <span className="text-green-400 font-bold">{formatCurrency(resources.taxRevenue?.commercial || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2">
                <span className="text-purple-400">🏭</span>
                Industrial Tax
              </span>
              <span className="text-green-400 font-bold">{formatCurrency(resources.taxRevenue?.industrial || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2">
                <span className="text-yellow-400">🏘️</span>
                Property Tax
              </span>
              <span className="text-green-400 font-bold">{formatCurrency(resources.taxRevenue?.property || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2">
                <span className="text-cyan-400">🛒</span>
                Sales Tax
              </span>
              <span className="text-green-400 font-bold">{formatCurrency(resources.taxRevenue?.sales || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2">
                <span className="text-indigo-400">🚇</span>
                Transit Fares
              </span>
              <span className="text-green-400 font-bold">{formatCurrency(resources.taxRevenue?.transit || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2">
                <span className="text-orange-400">⚡</span>
                Utilities
              </span>
              <span className="text-green-400 font-bold">{formatCurrency(resources.taxRevenue?.utilities || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2">
                <span className="text-gray-400">📋</span>
                Fees & Permits
              </span>
              <span className="text-green-400 font-bold">{formatCurrency(resources.taxRevenue?.fees || 0)}</span>
            </div>
          </div>
        </div>

        {/* Monthly Expenses Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Monthly Expenses: {formatCurrency(resources.operatingExpenses?.total || 0)}</h4>
          
          {/* Infrastructure Expenses */}
          <div className="bg-gray-700/50 p-2 rounded">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="font-semibold">🏗️ Infrastructure</span>
              <span className="text-red-400 font-bold">{formatCurrency(resources.operatingExpenses?.infrastructure?.total || 0)}</span>
            </div>
            <div className="space-y-1 ml-4">
              <div className="flex justify-between text-xs">
                <span>Roads</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.infrastructure?.roads || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Power Grid</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.infrastructure?.power || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Water System</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.infrastructure?.water || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Public Transit</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.infrastructure?.transit || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Waste Management</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.infrastructure?.waste || 0)}</span>
              </div>
            </div>
          </div>

          {/* Service Expenses */}
          <div className="bg-gray-700/50 p-2 rounded">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="font-semibold">🏥 Services</span>
              <span className="text-red-400 font-bold">{formatCurrency(resources.operatingExpenses?.services?.total || 0)}</span>
            </div>
            <div className="space-y-1 ml-4">
              <div className="flex justify-between text-xs">
                <span>Education</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.services?.education || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Healthcare</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.services?.healthcare || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Police</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.services?.police || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Fire Department</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.services?.fire || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Parks & Recreation</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.services?.parks || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Libraries</span>
                <span className="text-red-400">{formatCurrency(resources.operatingExpenses?.services?.libraries || 0)}</span>
              </div>
            </div>
          </div>

          {/* Other Expenses */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span>🏛️ Administration</span>
              <span className="text-red-400 font-bold">{formatCurrency(resources.operatingExpenses?.administration || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>💳 Debt Service</span>
              <span className="text-red-400 font-bold">{formatCurrency(resources.operatingExpenses?.debt || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>🚨 Emergency Fund</span>
              <span className="text-red-400 font-bold">{formatCurrency(resources.operatingExpenses?.emergency || 0)}</span>
            </div>
          </div>
        </div>

        {/* Debt Information */}
        {(resources.debt || 0) > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300">Debt Information</h4>
            <div className="bg-red-900/20 p-2 rounded border border-red-700">
              <div className="flex justify-between items-center text-sm">
                <span>Total Debt</span>
                <span className="text-red-400 font-bold">{formatCurrency(resources.debt || 0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Interest Rate</span>
                <span className="text-red-400">{formatPercent(resources.interestRate || 0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Debt-to-Income</span>
                <span className="text-red-400">
                  {formatPercent(((resources.debt || 0) / ((resources.monthlyIncome || 0) * 12)) * 100)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Budget Alerts */}
        {resources.budgetAlerts && resources.budgetAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300">Budget Alerts</h4>
            <div className="space-y-2">
              {resources.budgetAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className={`p-2 rounded border ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{alert.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{alert.recommendation}</div>
                      {alert.cost > 0 && (
                        <div className="text-xs text-yellow-400 mt-1">
                          Cost to resolve: {formatCurrency(alert.cost)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Financial Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            {(resources.budget || 0) < (resources.monthlyExpenses || 0) * 2 && (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-red-900/30 border-red-700 hover:bg-red-800/30 text-left justify-start"
              >
                <span className="text-red-400 mr-2">🚨</span>
                Emergency: Increase Taxes
              </Button>
            )}
            {(resources.cashFlow || 0) < 0 && (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-orange-900/30 border-orange-700 hover:bg-orange-800/30 text-left justify-start"
              >
                <span className="text-orange-400 mr-2">📉</span>
                Reduce Operating Costs
              </Button>
            )}
            {(resources.debt || 0) > (resources.monthlyIncome || 0) * 6 && (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-yellow-900/30 border-yellow-700 hover:bg-yellow-800/30 text-left justify-start"
              >
                <span className="text-yellow-400 mr-2">💳</span>
                Focus on Debt Reduction
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-left justify-start"
            >
              <span className="text-blue-400 mr-2">📊</span>
              View Financial History
            </Button>
          </div>
        </div>

        {/* Financial Tips */}
        <div className="bg-blue-900/30 p-2 rounded border border-blue-700">
          <div className="text-xs text-blue-300">
            <strong>💡 Financial Tip:</strong> Maintain 2-3 months of expenses in reserve. 
            Balance growth investments with fiscal responsibility to maintain a good credit rating.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}