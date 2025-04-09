
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface RegionSelectorProps {
  selectedRegions: string[];
  regions?: string[];
  control?: Control<any>;
  onRegionChange?: (region: string) => void;
  onChange?: (regions: string[]) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegions,
  regions = [],
  control,
  onRegionChange,
  onChange,
}) => {
  // If no regions provided, use default list
  const regionsList = regions.length > 0 ? regions : [
    "Gauteng",
    "Western Cape",
    "Eastern Cape",
    "KwaZulu-Natal",
    "Free State",
    "North West",
    "Mpumalanga",
    "Limpopo",
    "Northern Cape",
  ];

  // Handle checkbox change for controlled component
  const handleCheckboxChange = (region: string) => {
    if (onRegionChange) {
      // Using the callback pattern for parent component
      onRegionChange(region);
    } else if (onChange) {
      // Direct control of region array
      const isSelected = selectedRegions.includes(region);
      const newRegions = isSelected
        ? selectedRegions.filter(r => r !== region)
        : [...selectedRegions, region];
      onChange(newRegions);
    }
  };

  // If control is provided, use React Hook Form version
  if (control) {
    return (
      <FormField
        control={control}
        name="regions"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Regions</FormLabel>
              <p className="text-sm text-gray-500">
                Select regions where this user will be operating
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {regionsList.map((region) => (
                <div key={region} className="flex items-center space-x-2">
                  <Checkbox
                    id={`region-${region}`}
                    checked={selectedRegions.includes(region)}
                    onCheckedChange={() => onRegionChange && onRegionChange(region)}
                  />
                  <label
                    htmlFor={`region-${region}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {region}
                  </label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Regular controlled component version
  return (
    <div className="space-y-4">
      <div>
        <label className="text-base font-medium">Regions</label>
        <p className="text-sm text-gray-500">
          Select regions where this user will be operating
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {regionsList.map((region) => (
          <div key={region} className="flex items-center space-x-2">
            <Checkbox
              id={`region-${region}`}
              checked={selectedRegions.includes(region)}
              onCheckedChange={() => handleCheckboxChange(region)}
            />
            <label
              htmlFor={`region-${region}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {region}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionSelector;
