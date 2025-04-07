
import React from "react";
import { Button } from "@/components/ui/button";

interface AdminNavItemsProps {
  navItems: {
    path: string;
    icon: React.ElementType;
    label: string;
  }[];
  isActive: (path: string) => boolean;
  onClick: (path: string) => void;
}

export const AdminNavItems: React.FC<AdminNavItemsProps> = ({ 
  navItems, 
  isActive, 
  onClick 
}) => {
  return (
    <>
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "default" : "ghost"}
          size="sm"
          onClick={() => onClick(item.path)}
          className={`w-full justify-start ${isActive(item.path) ? "bg-red-600 hover:bg-red-700" : "text-white"}`}
        >
          <item.icon className="w-4 h-4 mr-2" /> {item.label}
        </Button>
      ))}
    </>
  );
};
