
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckItemProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onCheckedChange: () => void;
}

const CheckItem: React.FC<CheckItemProps> = ({
  id,
  title,
  description,
  icon,
  checked,
  onCheckedChange
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-4">
      <div className="flex flex-col items-center mb-4">
        {icon}
        <h3 className="text-lg font-medium mt-3 text-center">{title}</h3>
      </div>
      
      <p className="text-gray-600 text-center mb-4">{description}</p>
      
      <div className="flex items-center justify-center mt-2">
        <Checkbox 
          id={`check-${id}`} 
          checked={checked} 
          onCheckedChange={onCheckedChange}
          className="mr-2 h-5 w-5"
        />
        <Label htmlFor={`check-${id}`} className="font-medium cursor-pointer">
          Confirm Check Complete
        </Label>
      </div>
    </div>
  );
};

export default CheckItem;
