
import React from "react";
import { Lock } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

const LoginHeader: React.FC = () => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-center mb-2">
        <div className="rounded-full bg-akhanya p-2.5 shadow-md">
          <Lock className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="text-center space-y-1.5">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Sign in to EskomSiteIQ</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Enter your credentials to access the platform
        </CardDescription>
      </div>
    </div>
  );
};

export default LoginHeader;
