
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Car, ClipboardList, HardHat, ChevronRight, Settings, LogOut, User, ShieldAlert } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const NavigationBar: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  
  // Get initials from email for the avatar fallback
  const getInitials = (email: string) => {
    if (email === "User") return "U";
    const nameParts = email.split('@')[0].split('.');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

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
                className="h-16" 
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
                }}
              />
              <div className="h-8 w-px bg-gray-300 mx-2"></div>
              <img 
                src="/eskom-logo.png" 
                alt="Eskom" 
                className="h-12"
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.src = "https://via.placeholder.com/120x45?text=Eskom";
                }}
              />
            </div>
            <div className="h-8 w-px bg-gray-300 mx-4"></div>
            <div className="text-akhanya-secondary font-bold text-2xl mr-0">
              Eskom<span>Site</span><span className="text-red-600">IQ</span>
            </div>
            <div className="text-sm bg-akhanya text-white px-2 py-1 rounded ml-2">AI</div>
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
            
            {/* Profile dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src="/engineer-profile.jpg" alt="Profile" />
                    <AvatarFallback className="bg-akhanya text-white">
                      {getInitials(userEmail)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/admin/login")}>
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
