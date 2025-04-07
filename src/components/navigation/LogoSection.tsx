
import React from "react";
import BCXLogo from "@/components/ui/logo";
import { LogoSectionProps } from "./types";

const LogoSection: React.FC<LogoSectionProps> = ({ isCompact = false }) => {
  const logoHeight = isCompact ? 'h-16' : 'h-20';
  const eskLogo = isCompact ? 'h-11' : 'h-14';
  const textSize = isCompact ? 'text-base' : 'text-lg';
  
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-4">
        <BCXLogo className={logoHeight} />
        <div className="h-12 w-px bg-gray-600 mx-2"></div>
        <img 
          src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
          alt="Akhanya IT" 
          className={`${eskLogo} w-auto`}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
          }}
        />
        <div className="h-12 w-px bg-gray-600 mx-2"></div>
        <img 
          src="/eskom-logo.png" 
          alt="Eskom" 
          className={`${eskLogo} w-auto`}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/120x45?text=Eskom";
          }}
        />
      </div>
      <div className="h-12 w-px bg-gray-600 mx-4"></div>
      <div className={`text-white font-bold ${textSize}`}>
        Eskom<span>Site</span><span className="text-red-600">IQ</span>
      </div>
      <div className={`text-xs bg-red-600 text-white px-2 py-1 rounded ml-2`}>AI</div>
    </div>
  );
};

export default LogoSection;
