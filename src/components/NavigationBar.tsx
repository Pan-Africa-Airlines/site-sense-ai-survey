import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Car, HardHat, ChevronRight, Settings, LogOut, User, ShieldAlert, Badge, FileSpreadsheet } from "lucide-react";
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
import BCXLogo from "@/components/ui/logo";

interface NavigationBarProps {
  isCompact?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isCompact = false }) => {
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
      case "/car-checkup": return "Vehicle Check";
      case "/eskom-survey/new": return "Eskom Site Survey";
      case "/installation": return "Installation";
      case "/eskom-surveys": return "Eskom Surveys";
      case "/my-allocations": return "My Allocations";
      default: 
        if (location.pathname.startsWith("/eskom-survey/")) return "Eskom Site Survey";
        return "";
    }
  };

  const headerHeight = isCompact ? 'h-24!' : 'h-28!';
  const logoHeight = isCompact ? 'h-16' : 'h-20';
  const eskLogo = isCompact ? 'h-11' : 'h-14';
  const textSize = isCompact ? 'text-base' : 'text-lg';
  const iconSize = isCompact ? 'w-4 h-4' : 'w-5 h-5';
  const avatarSize = isCompact ? 'h-10 w-10' : 'h-12 w-12';
  
  const breadcrumbHeight = 'h-12';

  return (
    <header className="bg-black border-b border-gray-700 !transition-none !duration-0 z-10 text-white">
      <div className={`${headerHeight} w-full !transition-none !duration-0`}>
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <BCXLogo className={logoHeight} />
                <div className="h-12 w-px bg-gray-600 mx-2"></div>
                <img 
                  src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
                  alt="Akhanya IT" 
                  className={`${eskLogo} w-auto`}
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
                  }}
                />
                <div className="h-12 w-px bg-gray-600 mx-2"></div>
                <img 
                  src="/eskom-logo.png" 
                  alt="Eskom" 
                  className={`${eskLogo} w-auto`}
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/120x45?text=Eskom";
                  }}
                />
              </div>
              <div className="h-12 w-px bg-gray-600 mx-4"></div>
              <div className={`text-white font-bold ${textSize}`}>
                Eskom<span>Site</span><span className="text-red-600">IQ</span>
              </div>
              <div className={`text-xs bg-red-600 text-white px-2 py-1 rounded ml-2`}>AI</div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/")}
                className={`!transition-none !duration-0 ${isActive("/") ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
              >
                <Home className={`mr-1 ${iconSize}`} /> Dashboard
              </Button>
              <Button
                variant={isActive("/car-checkup") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/car-checkup")}
                className={`!transition-none !duration-0 ${isActive("/car-checkup") ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
              >
                <Car className={`mr-1 ${iconSize}`} /> Vehicle Check
              </Button>
              <Button
                variant={location.pathname.startsWith("/eskom-survey") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/eskom-survey/new")}
                className={`!transition-none !duration-0 ${location.pathname.startsWith("/eskom-survey") ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
              >
                <FileSpreadsheet className={`mr-1 ${iconSize}`} /> Eskom Survey
              </Button>
              <Button
                variant={isActive("/installation") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/installation")}
                className={`!transition-none !duration-0 ${isActive("/installation") ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
              >
                <HardHat className={`mr-1 ${iconSize}`} /> Installation
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 mr-2">
                <div className="text-right">
                  <div className="font-medium text-white">{userName}</div>
                  <div className="text-xs text-gray-300 flex items-center">
                    <Badge className="h-3 w-3 mr-1" />
                    Field Engineer
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-auto w-auto !transition-none !duration-0 hover:bg-gray-800">
                    <Avatar className={avatarSize}>
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
      </div>
      
      {location.pathname !== "/" && (
        <div className={`bg-gray-900 border-t border-gray-700 border-b border-gray-700 ${breadcrumbHeight} !transition-none !duration-0`}>
          <div className="container mx-auto px-4 h-full flex items-center">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate("/")} className="!transition-none !duration-0 text-gray-300 hover:text-white">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">{getPageTitle()}</BreadcrumbPage>
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
