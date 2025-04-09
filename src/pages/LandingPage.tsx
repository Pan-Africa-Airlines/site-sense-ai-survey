
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
      <header className="bg-black text-white p-4 shadow-md z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
              alt="Akhanya IT" 
              className="h-10 brightness-0 invert" 
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
              }}
            />
          </div>
          <ThemeSwitcher size="sm" />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Akhanya IT Platform</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Select which dashboard you want to access</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-akhanya rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Engineer Dashboard</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Access field operations, site assessments, and installation tasks
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/engineer-dashboard')} 
                  className="w-full bg-akhanya hover:bg-akhanya-dark"
                  size="lg"
                >
                  Enter Engineer Dashboard
                </Button>
              </div>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Admin Dashboard</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Manage teams, monitor site performance, and oversee operations
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/admin/dashboard')} 
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  Enter Admin Dashboard
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-900 p-4 text-center text-gray-600 dark:text-gray-400 mt-auto">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Akhanya IT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
