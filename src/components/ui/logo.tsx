
import React from "react";

interface LogoProps {
  className?: string;
}

const BCXLogo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={className}>
      <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* B */}
        <path d="M15 10H35C40.5 10 45 15 45 20C45 23 43 25.5 40 27C43 28.5 46 31 46 35C46 40.5 41 45 35 45H15V10Z" fill="black"/>
        <path d="M25 20V26H32C33.5 26 35 24.5 35 23C35 21.5 33.5 20 32 20H25Z" fill="white"/>
        <path d="M25 30V35H32C34 35 36 33.5 36 32.5C36 31 34 30 32 30H25Z" fill="white"/>
        
        {/* C */}
        <path d="M55 10C47 10 40 16.5 40 27.5C40 38.5 47 45 55 45C60 45 64 42.5 67 39L60 35C58.5 36.5 57 37 55 37C51 37 48 33 48 27.5C48 22 51 18 55 18C57 18 58.5 18.5 60 20L67 16C64 12.5 60 10 55 10Z" fill="black"/>
        
        {/* X */}
        <path d="M70 10L80 27.5L70 45H80L85 35L90 45H100L90 27.5L100 10H90L85 20L80 10H70Z" fill="black"/>
        <path d="M85 27.5L90 45H100L90 27.5L85 27.5Z" fill="#d33a37"/>
      </svg>
    </div>
  );
};

export default BCXLogo;
