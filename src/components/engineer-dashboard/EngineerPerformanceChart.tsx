
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface EngineerPerformanceChartProps {
  engineerId?: string;
}

const EngineerPerformanceChart: React.FC<EngineerPerformanceChartProps> = ({ engineerId }) => {
  // In a real app, this data would come from an API based on the engineerId
  const performanceData = [
    { month: 'Jan', assessments: 5, installations: 3, satisfaction: 90 },
    { month: 'Feb', assessments: 7, installations: 4, satisfaction: 85 },
    { month: 'Mar', assessments: 10, installations: 6, satisfaction: 92 },
    { month: 'Apr', assessments: 8, installations: 7, satisfaction: 95 },
    { month: 'May', assessments: 12, installations: 8, satisfaction: 90 },
    { month: 'Jun', assessments: 15, installations: 10, satisfaction: 88 }
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={performanceData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              borderRadius: "8px", 
              border: "1px solid #e2e8f0"
            }} 
          />
          <Legend />
          <Bar yAxisId="left" dataKey="assessments" name="Assessments" fill="#4ade80" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="left" dataKey="installations" name="Installations" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="satisfaction" name="Satisfaction %" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngineerPerformanceChart;
