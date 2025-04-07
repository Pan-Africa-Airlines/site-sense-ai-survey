
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { 
  BarChart3, 
  ClipboardList,
  Database, 
  Users, 
  Cog, 
  Map,
  MapPin,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BCXLogo from "@/components/ui/logo";

interface AdminSidebarProps {
  handleLogout: () => void;
  adminUsername: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ handleLogout, adminUsername }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/admin/assessments", icon: ClipboardList, label: "Assessments" },
    { path: "/admin/installations", icon: Database, label: "Installations" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/map", icon: Map, label: "Map" },
    { path: "/admin/site-allocation", icon: MapPin, label: "Site Allocation" },
    { path: "/admin/configuration", icon: Cog, label: "Configuration" },
  ];

  return (
    <Sidebar className="border-r border-gray-300 shadow-md bg-gradient-to-b from-gray-900 to-black">
      <SidebarHeader className="space-y-2">
        <div className="p-5 flex flex-col items-center gap-4">
          {/* BCX Logo */}
          <BCXLogo className="h-12 w-full brightness-0 invert" />
          
          {/* Add Separator */}
          <SidebarSeparator className="bg-gray-600" />
          
          {/* Akhanya Logo */}
          <div className="flex items-center justify-center w-full">
            <img 
              src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
              alt="Akhanya IT" 
              className="h-8 brightness-0 invert" 
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
              }}
            />
          </div>
          
          {/* Admin Label */}
          <div className="flex items-center gap-2 mt-1 w-full justify-between">
            <div className="text-white font-bold text-xl">Admin Panel</div>
            <div className="text-xs bg-red-600 text-white px-2 py-1 rounded-md">BACKOFFICE</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex items-center justify-center h-full">
        <SidebarMenu className="w-full mt-[-120px]">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                onClick={() => navigate(item.path)}
                isActive={isActive(item.path)}
                tooltip={item.label}
                className={`text-base py-3 ${isActive(item.path) ? 'bg-gray-800 text-white font-medium' : 'text-gray-300 hover:text-white'}`}
              >
                <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4 bg-gray-800 p-3 rounded-lg">
            <Avatar className="h-10 w-10 border-2 border-gray-700 shadow-sm bg-red-600">
              <AvatarFallback className="text-white text-lg">
                {adminUsername.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-base font-medium text-white">{adminUsername}</div>
              <div className="text-sm text-gray-400">Administrator</div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600 text-base py-5 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
