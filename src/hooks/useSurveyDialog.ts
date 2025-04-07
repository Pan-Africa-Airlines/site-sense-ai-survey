
import { useState } from 'react';
import { SiteAllocation } from '@/types/dashboard';

export const useSurveyDialog = () => {
  const [showSurvey, setShowSurvey] = useState<boolean>(false);
  const [selectedSite, setSelectedSite] = useState<SiteAllocation | null>(null);
  
  const handleOpenSurvey = (site: SiteAllocation) => {
    setSelectedSite(site);
    setShowSurvey(true);
  };

  const handleCloseSurvey = () => {
    setShowSurvey(false);
    setSelectedSite(null);
  };
  
  return {
    showSurvey,
    setShowSurvey,
    selectedSite,
    setSelectedSite,
    handleOpenSurvey,
    handleCloseSurvey
  };
};
