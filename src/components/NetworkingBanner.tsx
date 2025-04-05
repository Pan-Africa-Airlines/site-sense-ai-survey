
import React from "react";
import { Server, Wifi, Cable, Router } from "lucide-react";

interface NetworkingBannerProps {
  title: string;
  subtitle?: string;
  showIcons?: boolean;
}

const NetworkingBanner: React.FC<NetworkingBannerProps> = ({ 
  title, 
  subtitle, 
  showIcons = true 
}) => {
  return (
    <div className="relative w-full overflow-hidden mb-8">
      {/* Background gradient with overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-akhanya-dark to-akhanya opacity-90 z-10"></div>
      
      {/* Banner image */}
      <img
        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
        alt="Network Engineers"
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/1200x300?text=Network+Engineering";
        }}
      />
      
      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          {subtitle && <p className="text-white text-opacity-90 max-w-2xl">{subtitle}</p>}
          
          {/* Network icons */}
          {showIcons && (
            <div className="flex space-x-4 mt-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Server className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Cable className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Router className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
          
          {/* AI badge */}
          <div className="absolute top-4 right-4 bg-white bg-opacity-20 px-3 py-1 rounded-full flex items-center space-x-1">
            <span className="text-white text-sm font-medium">AI-Enhanced</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkingBanner;
