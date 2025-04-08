
import React from "react";

const LoginBranding: React.FC = () => {
  return (
    <div className="pb-2 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between gap-4 mb-4">
        <img 
          src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
          alt="Akhanya IT" 
          className="h-16 drop-shadow-md"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/160x60?text=Akhanya";
          }}
        />
        <img 
          src="https://www.eskom.co.za/wp-content/uploads/2021/08/Eskom-logo.png" 
          alt="Eskom" 
          className="h-14"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/140x56?text=Eskom";
          }}
        />
      </div>
      <div className="flex justify-center mt-1 mb-2">
        <img 
          src="/lovable-uploads/d67b70d4-e9cc-436f-a32c-4063e2443190.png" 
          alt="BCX" 
          className="h-20"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/200x80?text=BCX";
          }}
        />
      </div>
    </div>
  );
};

export default LoginBranding;
