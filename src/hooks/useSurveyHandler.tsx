
import { useState } from 'react';

export const useSurveyHandler = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  const handleOpenSurvey = (site) => {
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
