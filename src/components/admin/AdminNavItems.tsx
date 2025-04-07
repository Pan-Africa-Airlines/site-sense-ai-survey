import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ClipboardCheck,
  Wrench,
  MapPin,
  UserCheck,
  Settings,
  Users,
} from "lucide-react";

export const AdminNavItems: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <Button
        variant={currentPath === "/admin/dashboard" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/dashboard")}
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      <Button
        variant={currentPath === "/admin/assessments" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/assessments")}
      >
        <ClipboardCheck className="mr-2 h-4 w-4" />
        Assessments
      </Button>
      <Button
        variant={currentPath === "/admin/installations" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/installations")}
      >
        <Wrench className="mr-2 h-4 w-4" />
        Installations
      </Button>
      <Button
        variant={currentPath === "/admin/map" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/map")}
      >
        <MapPin className="mr-2 h-4 w-4" />
        Map
      </Button>
      <Button
        variant={currentPath === "/admin/site-allocation" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/site-allocation")}
      >
        <Users className="mr-2 h-4 w-4" />
        Site Allocation
      </Button>
      <Button
        variant={currentPath === "/admin/users" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/users")}
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Users
      </Button>
      <Button
        variant={currentPath === "/configuration" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/configuration")}
      >
        <Settings className="mr-2 h-4 w-4" />
        Configuration
      </Button>
    </>
  );
};
