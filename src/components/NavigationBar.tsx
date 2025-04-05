
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

const NavigationBar: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate("/login");
  };
  
  const userEmail = localStorage.getItem("userEmail") || "User";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/akhanya-logo.png" 
                alt="Akhanya IT" 
                className="h-8"
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.src = "https://via.placeholder.com/80x30?text=Akhanya";
                }}
              />
              <div className="h-6 w-px bg-gray-300 mx-1"></div>
              <img 
                src="/eskom-logo.png" 
                alt="Eskom" 
                className="h-8"
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.src = "https://via.placeholder.com/80x30?text=Eskom";
                }}
              />
            </div>
            <div className="h-6 w-px bg-gray-300 mx-3"></div>
            <div className="text-akhanya font-bold text-xl mr-2">SiteSense</div>
            <div className="text-xs bg-akhanya-purple text-white px-1.5 py-0.5 rounded">AI</div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className={isActive("/") ? "bg-akhanya-purple hover:bg-akhanya-dark" : ""}
            >
              Dashboard
            </Button>
            <Button
              variant={isActive("/car-check") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/car-check")}
              className={isActive("/car-check") ? "bg-akhanya-purple hover:bg-akhanya-dark" : ""}
            >
              Vehicle Check
            </Button>
            <Button
              variant={isActive("/assessment") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/assessment")}
              className={isActive("/assessment") ? "bg-akhanya-purple hover:bg-akhanya-dark" : ""}
            >
              Site Assessment
            </Button>
            <Button
              variant={isActive("/installation") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/installation")}
              className={isActive("/installation") ? "bg-akhanya-purple hover:bg-akhanya-dark" : ""}
            >
              Installation
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 hidden md:block">{userEmail}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
