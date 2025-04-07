
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface RegionSelectorProps {
  selectedRegions: string[];
  onRegionChange: (region: string) => void;
  regions: string[];
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegions,
  onRegionChange,
  regions,
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
