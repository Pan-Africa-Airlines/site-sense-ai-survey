
import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, User, ShieldAlert, Badge } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserMenuProps } from "./types";

const UserMenu: React.FC<UserMenuProps> = ({ isCompact = false, onLogout }) => {
  const navigate = useNavigate();
  
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

  const avatarSize = isCompact ? 'h-10 w-10' : 'h-12 w-12';
  
  return (
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
          
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
