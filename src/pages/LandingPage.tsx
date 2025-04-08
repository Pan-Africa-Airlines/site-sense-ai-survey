
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 dark:bg-gray-950 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
              alt="Akhanya IT" 
              className="h-8 brightness-0 invert" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/120x45?text=Akhanya";
              }}
            />
          </div>
          <div className="flex items-center space-x-4">
            <nav className="space-x-4">
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </nav>
            <ThemeSwitcher size="sm" />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-6 flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-bold mb-6 dark:text-white">Welcome to the Akhanya Site Assessment Platform</h1>
          <p className="text-xl mb-8 dark:text-gray-300">A comprehensive platform for managing site assessments and installations</p>
          <div className="space-x-4">
            <Button asChild variant="default" size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/login">Engineer Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login?role=admin">Admin Login</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-900 p-4 text-center text-gray-600 dark:text-gray-400">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Akhanya IT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
