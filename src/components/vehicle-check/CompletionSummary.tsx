
import React from 'react';
import { CheckCircle } from "lucide-react";

const CompletionSummary: React.FC = () => {
  return (
    <div className="bg-green-50 border border-green-100 rounded-md p-4 mb-4 flex items-start">
      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-green-800 font-medium">All safety checks completed!</p>
        <p className="text-green-700 text-sm mt-1">Your vehicle is ready for the journey.</p>
      </div>
    </div>
  );
};

export default CompletionSummary;
