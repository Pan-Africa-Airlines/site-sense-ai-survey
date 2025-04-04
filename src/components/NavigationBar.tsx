
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

const NavigationBar: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-bcx font-bold text-xl mr-2">SiteSense</div>
            <div className="text-xs bg-bcx text-white px-1.5 py-0.5 rounded">AI</div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
            >
              Dashboard
            </Button>
            <Button
              variant={isActive("/assessment") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/assessment")}
            >
              Site Assessment
            </Button>
            <Button
              variant={isActive("/installation") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/installation")}
            >
              Installation
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "User authentication and profiles will be available in the next update."
              });
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
