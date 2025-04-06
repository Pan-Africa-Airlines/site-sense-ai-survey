
import React from "react";

interface LogoProps {
  className?: string;
}

const BCXLogo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={className}>
      <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.5 15H64C69.5 15 74 19.5 74 25C74 30.5 69.5 35 64 35H43.5V15Z" fill="#747474"/>
        <path d="M43.5 40H69C74.5 40 79 44.5 79 50C79 55.5 74.5 60 69 60H43.5V40Z" fill="#747474"/>
        <path d="M84 15H104.5C110 15 114.5 19.5 114.5 25C114.5 30.5 110 35 104.5 35H84V15Z" fill="#747474"/>
        <path d="M99 40H104.5L114.5 60H104.5L99 40Z" fill="#d33a37"/>
      </svg>
    </div>
  );
};

export default BCXLogo;
