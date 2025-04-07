
import { useState } from "react";
import { EskomSite } from "@/types/site";

export const useSiteFilters = (initialSearchQuery = "", initialRegionFilter = "") => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [regionFilter, setRegionFilter] = useState(initialRegionFilter);

  const filterSites = (sites: EskomSite[]): EskomSite[] => {
    return sites.filter(site => {
      const matchesSearch = !searchQuery || 
        site.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = !regionFilter || site.region === regionFilter;
      return matchesSearch && matchesRegion;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRegionFilter("");
  };

  return {
    searchQuery,
    setSearchQuery,
    regionFilter,
    setRegionFilter,
    filterSites,
    clearFilters
  };
};
