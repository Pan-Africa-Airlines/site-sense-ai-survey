
import React from "react";

interface LogoProps {
  className?: string;
}

const BCXLogo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={className}>
      <svg width="180" height="90" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* B */}
        <path d="M22.5 15H52.5C60.75 15 67.5 22.5 67.5 30C67.5 34.5 64.5 38.25 60 40.5C64.5 42.75 69 46.5 69 52.5C69 60.75 61.5 67.5 52.5 67.5H22.5V15Z" fill="white"/>
        <path d="M37.5 30V39H48C50.25 39 52.5 36.75 52.5 34.5C52.5 32.25 50.25 30 48 30H37.5Z" fill="black"/>
        <path d="M37.5 45V52.5H48C51 52.5 54 50.25 54 48.75C54 46.5 51 45 48 45H37.5Z" fill="black"/>
        
        {/* C */}
        <path d="M82.5 15C70.5 15 60 24.75 60 41.25C60 57.75 70.5 67.5 82.5 67.5C90 67.5 96 63.75 100.5 58.5L90 52.5C87.75 54.75 85.5 55.5 82.5 55.5C76.5 55.5 72 49.5 72 41.25C72 33 76.5 27 82.5 27C85.5 27 87.75 27.75 90 30L100.5 24C96 18.75 90 15 82.5 15Z" fill="white"/>
        
        {/* X */}
        <path d="M105 15L120 41.25L105 67.5H120L127.5 52.5L135 67.5H150L135 41.25L150 15H135L127.5 30L120 15H105Z" fill="white"/>
        <path d="M127.5 41.25L135 67.5H150L135 41.25L127.5 41.25Z" fill="#d33a37"/>
      </svg>
    </div>
  );
};

export default BCXLogo;
