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
    { path: "/configuration", icon: Cog, label: "Configuration" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="space-y-2">
        <div className="p-4 flex flex-col items-center gap-3">
          <BCXLogo className="h-12 w-full brightness-0 invert" />
          <SidebarSeparator />
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
          <div className="flex items-center gap-2 mt-2 w-full justify-between">
            <div className="text-sidebar-foreground font-bold text-lg">Admin Panel</div>
            <div className="text-xs bg-red-600 text-white px-2 py-1 rounded">BACKOFFICE</div>
          </div>
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
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-9 w-9 border-2 border-white/10">
              <AvatarFallback className="bg-red-600 text-white">
                {adminUsername.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium text-sidebar-foreground">{adminUsername}</div>
              <div className="text-xs text-sidebar-foreground/70">Administrator</div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start bg-sidebar-accent text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent/80"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
