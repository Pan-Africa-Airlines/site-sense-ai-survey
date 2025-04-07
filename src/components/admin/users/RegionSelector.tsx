
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

interface RegionSelectorProps {
  selectedRegions: string[];
  onRegionChange: (region: string) => void;
  regions: string[];
  control: Control<any>; // Add control prop
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegions,
  onRegionChange,
  regions,
  control, // Include control in props
}) => {
  return (
    <FormItem>
      <FormLabel>Regions</FormLabel>
      <FormControl>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <Badge 
              key={region}
              variant={selectedRegions.includes(region) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onRegionChange(region)}
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
