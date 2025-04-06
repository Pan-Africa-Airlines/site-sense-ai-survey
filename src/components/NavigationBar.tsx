
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Car, ClipboardList, HardHat, ChevronRight, Settings, LogOut, User, ShieldAlert, Badge, FileSpreadsheet } from "lucide-react";
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

interface NavigationBarProps {
  isCompact?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isCompact = false }) => {
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
  const userName = userEmail.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  ).join(' ');
  
  const getInitials = (email: string) => {
    if (email === "User") return "U";
    const nameParts = email.split('@')[0].split('.');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getPageTitle = () => {
    switch(location.pathname) {
      case "/": return "Dashboard";
      case "/car-check": return "Vehicle Check";
      case "/eskom-site-survey": return "Eskom Site Survey";
      case "/eskom-survey": return "Eskom Site Survey";
      case "/installation": return "Installation";
      case "/eskom-surveys": return "Eskom Surveys";
      default: return "";
    }
  };

  return (
    <header className={`bg-white border-b border-gray-200 transition-all duration-300 z-10 ${isCompact ? 'py-1' : 'py-3'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
                alt="Akhanya IT" 
                className={`transition-all duration-300 ${isCompact ? 'h-12' : 'h-16'}`}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
                }}
              />
              <div className="h-8 w-px bg-gray-300 mx-2"></div>
              <img 
                src="/eskom-logo.png" 
                alt="Eskom" 
                className={`transition-all duration-300 ${isCompact ? 'h-10' : 'h-12'}`}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/120x45?text=Eskom";
                }}
              />
            </div>
            <div className="h-8 w-px bg-gray-300 mx-4"></div>
            <div className={`text-akhanya-secondary font-bold mr-0 transition-all duration-300 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              Eskom<span>Site</span><span className="text-red-600">IQ</span>
            </div>
            <div className={`text-sm bg-akhanya text-white px-2 py-1 rounded ml-2 transition-all duration-300 ${isCompact ? 'text-xs' : 'text-sm'}`}>AI</div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size={isCompact ? "xs" : "sm"}
              onClick={() => navigate("/")}
              className={`transition-all duration-300 ${isActive("/") ? "bg-akhanya hover:bg-akhanya-dark" : ""}`}
            >
              <Home className={`mr-1 transition-all duration-300 ${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} /> Dashboard
            </Button>
            <Button
              variant={isActive("/car-check") ? "default" : "ghost"}
              size={isCompact ? "xs" : "sm"}
              onClick={() => navigate("/car-check")}
              className={`transition-all duration-300 ${isActive("/car-check") ? "bg-akhanya hover:bg-akhanya-dark" : ""}`}
            >
              <Car className={`mr-1 transition-all duration-300 ${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} /> Vehicle Check
            </Button>
            <Button
              variant={isActive("/eskom-site-survey") || isActive("/eskom-survey") ? "default" : "ghost"}
              size={isCompact ? "xs" : "sm"}
              onClick={() => navigate("/eskom-site-survey")}
              className={`transition-all duration-300 ${isActive("/eskom-site-survey") || isActive("/eskom-survey") ? "bg-akhanya hover:bg-akhanya-dark" : ""}`}
            >
              <FileSpreadsheet className={`mr-1 transition-all duration-300 ${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} /> Eskom Site Survey
            </Button>
            <Button
              variant={isActive("/installation") ? "default" : "ghost"}
              size={isCompact ? "xs" : "sm"}
              onClick={() => navigate("/installation")}
              className={`transition-all duration-300 ${isActive("/installation") ? "bg-akhanya hover:bg-akhanya-dark" : ""}`}
            >
              <HardHat className={`mr-1 transition-all duration-300 ${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} /> Installation
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <div className="text-right">
                <div className="font-medium text-akhanya">{userName}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Badge className="h-3 w-3 mr-1" />
                  Field Engineer
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`relative rounded-full transition-all duration-300 ${isCompact ? 'h-8 w-8' : 'h-10 w-10'}`}>
                  <Avatar className={`transition-all duration-300 ${isCompact ? 'h-8 w-8' : 'h-10 w-10'}`}>
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
