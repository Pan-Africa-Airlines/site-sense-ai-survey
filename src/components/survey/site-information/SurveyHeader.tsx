
import React from "react";

const SurveyHeader: React.FC = () => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/f4bbbf20-b8f5-4f87-8a68-bd14981cef3e.png" 
          alt="BCX Logo" 
          className="h-20 object-contain" 
        />
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-8">ESKOM OT IP/MPLS NETWORK</h1>
      <h2 className="text-xl font-bold text-center mb-8">SITE SURVEY REPORT</h2>
    </>
  );
};

export default SurveyHeader;
