
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Car, ClipboardList, HardHat, ChevronRight } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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

  // Function to get page title based on current path
  const getPageTitle = () => {
    switch(location.pathname) {
      case "/": return "Dashboard";
      case "/car-check": return "Vehicle Check";
      case "/assessment": return "Site Assessment";
      case "/installation": return "Installation";
      default: return "";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
                alt="Akhanya IT" 
                className="h-10"
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
            <div className="text-akhanya-secondary font-bold text-xl mr-2">SiteSense</div>
            <div className="text-xs bg-akhanya text-white px-1.5 py-0.5 rounded">AI</div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className={isActive("/") ? "bg-akhanya hover:bg-akhanya-dark" : ""}
            >
              <Home className="w-4 h-4 mr-1" /> Dashboard
            </Button>
            <Button
              variant={isActive("/car-check") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/car-check")}
              className={isActive("/car-check") ? "bg-akhanya hover:bg-akhanya-dark" : ""}
            >
              <Car className="w-4 h-4 mr-1" /> Vehicle Check
            </Button>
            <Button
              variant={isActive("/assessment") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/assessment")}
              className={isActive("/assessment") ? "bg-akhanya hover:bg-akhanya-dark" : ""}
            >
              <ClipboardList className="w-4 h-4 mr-1" /> Site Assessment
            </Button>
            <Button
              variant={isActive("/installation") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/installation")}
              className={isActive("/installation") ? "bg-akhanya hover:bg-akhanya-dark" : ""}
            >
              <HardHat className="w-4 h-4 mr-1" /> Installation
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
      
      {/* Breadcrumb navigation - only shown on non-dashboard pages */}
      {location.pathname !== "/" && (
        <div className="bg-gray-50 border-t border-b border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate("/")}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
