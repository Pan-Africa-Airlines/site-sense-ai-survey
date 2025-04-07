
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AdminNavItems } from "@/components/admin/AdminNavItems";

interface DesktopAdminNavProps {
  adminUsername: string;
  handleLogout: () => void;
  isActive: (path: string) => boolean;
  navItems: {
    path: string;
    icon: React.ElementType;
    label: string;
  }[];
}

const DesktopAdminNav: React.FC<DesktopAdminNavProps> = ({
  adminUsername,
  handleLogout,
  isActive,
  navItems
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-white w-64 flex flex-col z-40">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
              alt="Akhanya IT" 
              className="h-8 brightness-0 invert" 
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
              }}
            />
            <div className="ml-2 text-white font-bold text-lg">Admin</div>
          </div>
          <div className="text-xs bg-red-600 text-white px-2 py-1 rounded">BACKOFFICE</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <div className="space-y-1 px-2">
          <AdminNavItems 
            navItems={navItems} 
            isActive={isActive} 
            onClick={(path) => navigate(path)} 
          />
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-red-600 text-white">
                {adminUsername.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">{adminUsername}</div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="w-full justify-start text-white"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default DesktopAdminNav;
