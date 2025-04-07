
import React from "react";
import { NavLink } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <NavLink to="/" className="flex items-center space-x-2 dark:text-white !duration-0 !transition-none">
      <img 
        src="/lovable-uploads/d67b70d4-e9cc-436f-a32c-4063e2443190.png" 
        alt="Logo" 
        className="h-6 w-auto" 
      />
      <span className="font-bold">SiteSense</span>
    </NavLink>
  );
};

export default Logo;
