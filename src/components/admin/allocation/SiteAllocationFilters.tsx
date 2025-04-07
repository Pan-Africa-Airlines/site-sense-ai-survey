
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SiteAllocationFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  regionFilter: string;
  setRegionFilter: (value: string) => void;
  regions: string[];
  clearFilters: () => void;
}

const SiteAllocationFilters: React.FC<SiteAllocationFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  regionFilter,
  setRegionFilter,
  regions,
  clearFilters
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Filter Sites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center relative flex-1">
            <Search className="absolute left-2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search sites..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-regions">All Regions</SelectItem>
                {regions.map(region => (
                  region ? (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ) : null
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteAllocationFilters;
