
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle2, 
  CalendarCheck, 
  BarChart4, 
  Award 
} from "lucide-react";

interface EngineerMetricsCardsProps {
  engineerId?: string;
  isLoading: boolean;
}

const EngineerMetricsCards: React.FC<EngineerMetricsCardsProps> = ({ 
  engineerId, 
  isLoading 
}) => {
  // In a real application, we'd fetch these metrics based on the engineerId
  const metrics = {
    completedTasks: 28,
    sitesAssessed: 12,
    satisfaction: 94,
    upcomingTasks: 5
  };

  const cards = [
    {
      title: "Completed Tasks",
      value: metrics.completedTasks,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Sites Assessed",
      value: metrics.sitesAssessed,
      icon: CalendarCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Satisfaction Rate",
      value: `${metrics.satisfaction}%`,
      icon: Award,
      color: "text-amber-500",
      bgColor: "bg-amber-50"
    },
    {
      title: "Upcoming Tasks",
      value: metrics.upcomingTasks,
      icon: BarChart4,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                )}
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EngineerMetricsCards;
