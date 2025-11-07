import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { useCityStore } from "../../lib/stores/useCityStore";
import { useState } from "react";

interface CityPolicies {
  taxRate: number; // 5-25%
  educationFunding: number; // 50-150%
  healthcareFunding: number; // 50-150%
  policeFunding: number; // 50-150%
  environmentalRegulations: number; // 0-100%
}

export default function PolicyPanel() {
  const { resources, updateResources } = useCityStore();
  
  // Initialize policies if they don't exist
  const [policies, setPolicies] = useState<CityPolicies>({
    taxRate: 15,
    educationFunding: 100,
    healthcareFunding: 100,
    policeFunding: 100,
    environmentalRegulations: 50
  });

  const handlePolicyChange = (policy: keyof CityPolicies, value: number[]) => {
    const newPolicies = { ...policies, [policy]: value[0] };
    setPolicies(newPolicies);
    
    // Apply policy effects immediately
    applyPolicyEffects(newPolicies);
  };

  const applyPolicyEffects = (newPolicies: CityPolicies) => {
    // Calculate policy costs and effects
    const baseCost = resources.population * 2;
    
    const educationCost = baseCost * (newPolicies.educationFunding / 100);
    const healthcareCost = baseCost * (newPolicies.healthcareFunding / 100);
    const policeCost = baseCost * (newPolicies.policeFunding / 100);
    const environmentalCost = baseCost * (newPolicies.environmentalRegulations / 100);
    
    const totalPolicyCost = educationCost + healthcareCost + policeCost + environmentalCost;
    
    // Update monthly expenses to include policy costs
    updateResources({
      monthlyExpenses: resources.monthlyExpenses + totalPolicyCost
    });
  };

  const getPolicyColor = (value: number, optimal: number = 100) => {
    const diff = Math.abs(value - optimal);
    if (diff <= 20) return "text-green-400";
    if (diff <= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getPolicyEffect = (policy: keyof CityPolicies, value: number) => {
    switch (policy) {
      case 'taxRate':
        if (value < 10) return "Low revenue, high happiness";
        if (value > 20) return "High revenue, low happiness";
        return "Balanced revenue and happiness";
      
      case 'educationFunding':
        if (value < 80) return "Poor education quality";
        if (value > 120) return "Excellent education, high cost";
        return "Good education quality";
      
      case 'healthcareFunding':
        if (value < 80) return "Limited healthcare access";
        if (value > 120) return "Universal healthcare, high cost";
        return "Good healthcare coverage";
      
      case 'policeFunding':
        if (value < 80) return "Higher crime rates";
        if (value > 120) return "Very safe, high cost";
        return "Good public safety";
      
      case 'environmentalRegulations':
        if (value < 30) return "High pollution, low business costs";
        if (value > 70) return "Clean environment, higher business costs";
        return "Moderate environmental protection";
      
      default:
        return "";
    }
  };

  return (
    <Card className="w-64 bg-gray-800 text-white border-gray-600">
      <CardHeader>
        <CardTitle>City Policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tax Rate */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Tax Rate</span>
            <span className={`text-sm font-mono ${getPolicyColor(policies.taxRate, 15)}`}>
              {policies.taxRate}%
            </span>
          </div>
          <Slider
            value={[policies.taxRate]}
            onValueChange={(value) => handlePolicyChange('taxRate', value)}
            min={5}
            max={25}
            step={1}
            className="mb-1"
          />
          <p className="text-xs text-gray-400">
            {getPolicyEffect('taxRate', policies.taxRate)}
          </p>
        </div>

        {/* Education Funding */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Education</span>
            <span className={`text-sm font-mono ${getPolicyColor(policies.educationFunding)}`}>
              {policies.educationFunding}%
            </span>
          </div>
          <Slider
            value={[policies.educationFunding]}
            onValueChange={(value) => handlePolicyChange('educationFunding', value)}
            min={50}
            max={150}
            step={5}
            className="mb-1"
          />
          <p className="text-xs text-gray-400">
            {getPolicyEffect('educationFunding', policies.educationFunding)}
          </p>
        </div>

        {/* Healthcare Funding */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Healthcare</span>
            <span className={`text-sm font-mono ${getPolicyColor(policies.healthcareFunding)}`}>
              {policies.healthcareFunding}%
            </span>
          </div>
          <Slider
            value={[policies.healthcareFunding]}
            onValueChange={(value) => handlePolicyChange('healthcareFunding', value)}
            min={50}
            max={150}
            step={5}
            className="mb-1"
          />
          <p className="text-xs text-gray-400">
            {getPolicyEffect('healthcareFunding', policies.healthcareFunding)}
          </p>
        </div>

        {/* Police Funding */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Public Safety</span>
            <span className={`text-sm font-mono ${getPolicyColor(policies.policeFunding)}`}>
              {policies.policeFunding}%
            </span>
          </div>
          <Slider
            value={[policies.policeFunding]}
            onValueChange={(value) => handlePolicyChange('policeFunding', value)}
            min={50}
            max={150}
            step={5}
            className="mb-1"
          />
          <p className="text-xs text-gray-400">
            {getPolicyEffect('policeFunding', policies.policeFunding)}
          </p>
        </div>

        {/* Environmental Regulations */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Environment</span>
            <span className={`text-sm font-mono ${getPolicyColor(policies.environmentalRegulations, 60)}`}>
              {policies.environmentalRegulations}%
            </span>
          </div>
          <Slider
            value={[policies.environmentalRegulations]}
            onValueChange={(value) => handlePolicyChange('environmentalRegulations', value)}
            min={0}
            max={100}
            step={5}
            className="mb-1"
          />
          <p className="text-xs text-gray-400">
            {getPolicyEffect('environmentalRegulations', policies.environmentalRegulations)}
          </p>
        </div>

        {/* Policy Summary */}
        <div className="border-t border-gray-600 pt-2">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">💡 Policy Tips</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Higher taxes = more revenue, less happiness</p>
            <p>• Funding boosts service quality</p>
            <p>• Environmental rules reduce pollution</p>
            <p>• Balance cost vs. citizen satisfaction</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}