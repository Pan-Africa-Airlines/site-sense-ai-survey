
import { useState } from 'react';
import { AllocatedSite } from '@/types/dashboard';

export const useSurveyHandler = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedSite, setSelectedSite] = useState<AllocatedSite | null>(null);

  const handleOpenSurvey = (site: AllocatedSite) => {
    setSelectedSite(site);
    setShowSurvey(true);
  };

  const handleCloseSurvey = () => {
    setShowSurvey(false);
    setSelectedSite(null);
  };

  return {
    showSurvey,
    selectedSite,
    setShowSurvey,
    setSelectedSite,
    handleOpenSurvey,
    handleCloseSurvey
  };
};
