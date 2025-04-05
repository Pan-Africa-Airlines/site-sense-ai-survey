
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Settings, LogOut, BarChart3, Users, ClipboardList, Database } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const AdminNavBar: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUsername");
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel."
    });
    navigate("/admin/login");
  };
  
  const adminUsername = localStorage.getItem("adminUsername") || "Admin";

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
                alt="Akhanya IT" 
                className="h-16 brightness-0 invert" 
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
                }}
              />
              <div className="h-8 w-px bg-gray-700 mx-2"></div>
              <img 
                src="/eskom-logo.png" 
                alt="Eskom" 
                className="h-12 brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/120x45?text=Eskom";
                }}
              />
            </div>
            <div className="h-8 w-px bg-gray-700 mx-4"></div>
            <div className="text-white font-bold text-2xl mr-2">Admin Panel</div>
            <div className="text-sm bg-red-600 text-white px-2 py-1 rounded">BACKOFFICE</div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={isActive("/admin/dashboard") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/admin/dashboard")}
              className={isActive("/admin/dashboard") ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <BarChart3 className="w-4 h-4 mr-1" /> Dashboard
            </Button>
            <Button
              variant={isActive("/admin/assessments") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/admin/assessments")}
              className={isActive("/admin/assessments") ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <ClipboardList className="w-4 h-4 mr-1" /> Assessments
            </Button>
            <Button
              variant={isActive("/admin/installations") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/admin/installations")}
              className={isActive("/admin/installations") ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <Database className="w-4 h-4 mr-1" /> Installations
            </Button>
            <Button
              variant={isActive("/admin/users") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/admin/users")}
              className={isActive("/admin/users") ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <Users className="w-4 h-4 mr-1" /> Users
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-300 hidden md:block">{adminUsername}</div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-red-600 text-white">
                      {adminUsername.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
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
    </header>
  );
};

export default AdminNavBar;
