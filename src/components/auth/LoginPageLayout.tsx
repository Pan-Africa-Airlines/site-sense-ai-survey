
import React from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginPageLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

const LoginPageLayout = ({ children, title, description }: LoginPageLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Background with overlay and image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90 dark:from-gray-950/90 dark:via-gray-900/90 dark:to-black/90">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" 
             style={{backgroundImage: "url('/lovable-uploads/47596378-d2cb-4456-a4b6-34e2a2abfdba.png')"}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/20 to-gray-900/50"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md border-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
            <CardHeader className="space-y-1 pb-2 border-b border-gray-100 dark:border-gray-800">
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
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center space-y-1.5 mb-6">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</CardTitle>
                {description && (
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    {description}
                  </CardDescription>
                )}
              </div>
              {children}
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 pt-4 pb-6 px-8">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Powered by Akhanya IT Innovations
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPageLayout;
