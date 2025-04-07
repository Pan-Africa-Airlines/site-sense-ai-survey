
import React from "react";

interface LogoProps {
  className?: string;
}

const BCXLogo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/lovable-uploads/69678852-6930-4db3-9062-732d93a32840.png" 
        alt="BCX Logo" 
        className="h-full w-auto object-contain max-w-full"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/120x45?text=BCX";
        }}
      />
    </div>
  );
};

export default BCXLogo;
