
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Home, 
  Settings, 
  LogOut, 
  BarChart3, 
  Users, 
  ClipboardList, 
  Database, 
  Cog, 
  Map,
  Menu
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  SidebarInset
} from "@/components/ui/sidebar";

const AdminNavBar: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

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

  const navItems = [
    { path: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/admin/assessments", icon: ClipboardList, label: "Assessments" },
    { path: "/admin/installations", icon: Database, label: "Installations" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/map", icon: Map, label: "Map" },
    { path: "/configuration", icon: Cog, label: "Configuration" },
  ];

  const MobileNav = () => (
    <header className="bg-gray-900 text-white sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
              alt="Akhanya IT" 
              className="h-12 brightness-0 invert" 
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
              }}
            />
            <div className="ml-2 text-white font-bold text-xl">Admin</div>
            <div className="text-sm bg-red-600 text-white px-2 py-1 rounded ml-2">BACKOFFICE</div>
          </div>
          
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-gray-900 text-white p-0 w-[250px]">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-red-600 text-white">
                          {adminUsername.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{adminUsername}</div>
                        <div className="text-xs text-gray-400">Administrator</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto py-2">
                    <div className="space-y-1 px-2">
                      {navItems.map((item) => (
                        <Button
                          key={item.path}
                          variant={isActive(item.path) ? "default" : "ghost"}
                          size="sm"
                          onClick={() => navigate(item.path)}
                          className={`w-full justify-start ${isActive(item.path) ? "bg-red-600 hover:bg-red-700" : "text-white"}`}
                        >
                          <item.icon className="w-4 h-4 mr-2" /> {item.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-800">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="w-full justify-start text-white"
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

  const DesktopNav = () => (
    <div className="flex h-screen">
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
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`w-full justify-start ${isActive(item.path) ? "bg-red-600 hover:bg-red-700" : "text-white"}`}
              >
                <item.icon className="w-4 h-4 mr-2" /> {item.label}
              </Button>
            ))}
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
    </div>
  );

  return isMobile ? <MobileNav /> : <DesktopNav />;
};

export default AdminNavBar;
