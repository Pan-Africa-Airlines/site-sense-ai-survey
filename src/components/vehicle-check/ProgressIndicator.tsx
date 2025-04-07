
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">Progress</span>
        <span className="text-sm font-medium">{currentStep + 1} of {totalSteps}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-akhanya rounded-full h-2 transition-all duration-300" 
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
