
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, Check } from "lucide-react";

interface AIInsightsSectionProps {
  aiInsights: {
    type: string;
    title: string;
    description: string;
    icon: string;
  }[];
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ aiInsights }) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "trend-up":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "alert-triangle":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "check":
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Brain className="h-5 w-5 text-akhanya" />;
    }
  };

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-akhanya" />
        <h2 className="text-xl font-semibold text-akhanya">AI Insights</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiInsights.map((insight, index) => (
          <Card key={index} className="border-l-4 border-l-akhanya">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-md">{insight.title}</CardTitle>
                {renderIcon(insight.icon)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsSection;
