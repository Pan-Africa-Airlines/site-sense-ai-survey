
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
              alt="Akhanya IT" 
              className="h-8 brightness-0 invert" 
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
              }}
            />
          </div>
          <nav className="space-x-4">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-6 flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-bold mb-6">Welcome to the Akhanya Site Assessment Platform</h1>
          <p className="text-xl mb-8">A comprehensive platform for managing site assessments and installations</p>
          <div className="space-x-4">
            <Button asChild variant="default" size="lg">
              <Link to="/login">Engineer Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/admin/login">Admin Login</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-gray-600">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Akhanya IT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
