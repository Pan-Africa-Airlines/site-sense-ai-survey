
import React from "react";

interface LogoProps {
  className?: string;
}

const BCXLogo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/69678852-6930-4db3-9062-732d93a32840.png" 
        alt="BCX Logo" 
        className="h-full w-auto"
      />
    </div>
  );
};

export default BCXLogo;
