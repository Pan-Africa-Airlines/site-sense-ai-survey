
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

interface RegionSelectorProps {
  selectedRegions: string[];
  onRegionChange?: (region: string) => void;
  onChange?: (regions: string[]) => void;
  regions: string[];
  control?: Control<any>;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegions,
  onRegionChange,
  onChange,
  regions,
  control,
}) => {
  // Function to handle region selection
  const handleRegionClick = (region: string) => {
    if (onRegionChange) {
      onRegionChange(region);
    } else if (onChange) {
      const newRegions = selectedRegions.includes(region)
        ? selectedRegions.filter(r => r !== region)
        : [...selectedRegions, region];
      onChange(newRegions);
    }
  };

  // Default regions if none provided
  const defaultRegions = [
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

  // Use provided regions or fall back to defaults
  const availableRegions = regions || defaultRegions;

  return (
    <FormItem>
      <FormLabel>Regions</FormLabel>
      <FormControl>
        <div className="flex flex-wrap gap-2">
          {availableRegions.map((region) => (
            <Badge 
              key={region}
              variant={selectedRegions.includes(region) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleRegionClick(region)}
            >
              {region}
            </Badge>
          ))}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default RegionSelector;
