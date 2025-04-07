import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Menu, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AdminNavItems } from "@/components/admin/AdminNavItems";
import BCXLogo from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";

interface MobileAdminNavProps {
  adminUsername: string;
  handleLogout: () => void;
  isActive: (path: string) => boolean;
  navItems: {
    path: string;
    icon: React.ElementType;
    label: string;
  }[];
}

const MobileAdminNav: React.FC<MobileAdminNavProps> = ({
  adminUsername,
  handleLogout,
  isActive,
  navItems
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
              alt="Akhanya IT" 
              className="h-8 mr-2 brightness-0 invert" 
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
              }}
            />
            <div className="text-white font-bold text-lg">Admin</div>
            <div className="text-sm bg-red-600 text-white px-2 py-1 rounded ml-2">BACKOFFICE</div>
          </div>
          
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-sidebar-foreground">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-sidebar text-sidebar-foreground p-0 w-[280px]">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-sidebar-border">
                    <div className="flex flex-col space-y-4">
                      <BCXLogo className="h-10 w-full brightness-0 invert" />
                      <Separator className="bg-sidebar-border" />
                      <img 
                        src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
                        alt="Akhanya IT" 
                        className="h-6 brightness-0 invert" 
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
                        }}
                      />
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-red-600 text-white">
                            {adminUsername.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{adminUsername}</div>
                          <div className="text-xs text-sidebar-foreground/70">Administrator</div>
                        </div>
                      </div>
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
                  
                  <div className="p-4 border-t border-sidebar-border">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLogout}
                      className="w-full justify-start bg-sidebar-accent text-sidebar-foreground border-sidebar-border"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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

export default MobileAdminNav;
