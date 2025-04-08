
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, Check } from "lucide-react";
import { AIInsight } from "@/types/dashboard";

interface AIInsightsSectionProps {
  insights: AIInsight[];
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ insights }) => {
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
        {insights.map((insight, index) => (
          <Card key={index} className="border-l-4 border-l-akhanya h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-md">{insight.title}</CardTitle>
                {renderIcon(insight.icon)}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsSection;
