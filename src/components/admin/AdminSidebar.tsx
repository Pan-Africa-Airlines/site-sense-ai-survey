
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
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
    { path: "/configuration", icon: Cog, label: "Configuration" },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4 flex items-center">
          <img 
            src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
            alt="Akhanya IT" 
            className="h-8 brightness-0 invert" 
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/120x45?text=Akhanya";
            }}
          />
          <div className="ml-2 text-sidebar-foreground font-bold text-lg">Admin</div>
          <div className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded">BACKOFFICE</div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                onClick={() => navigate(item.path)}
                isActive={isActive(item.path)}
                tooltip={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-red-600 text-white">
                  {adminUsername.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{adminUsername}</div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
