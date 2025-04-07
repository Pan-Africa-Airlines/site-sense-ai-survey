
import React, { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const UserMenu: React.FC<UserMenuProps> = ({ isCompact = false, onLogout }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("Field Engineer");
  
  useEffect(() => {
    const getUserInfo = async () => {
      // Check for authenticated session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Get metadata
        const metadata = session.user.user_metadata || {};
        const email = session.user.email || localStorage.getItem("userEmail") || "User";
        
        setUserEmail(email);
        
        // Get name from metadata or format from email
        if (metadata.name) {
          setUserName(metadata.name);
        } else {
          const formattedName = email.split('@')[0].split('.').map(name => 
            name.charAt(0).toUpperCase() + name.slice(1)
          ).join(' ');
          setUserName(formattedName);
        }
        
        // Get role from metadata
        if (metadata.role) {
          setUserRole(metadata.role);
        }
      } else {
        // Fallback to localStorage for backward compatibility
        const email = localStorage.getItem("userEmail") || "User";
        setUserEmail(email);
        
        const formattedName = email.split('@')[0].split('.').map(name => 
          name.charAt(0).toUpperCase() + name.slice(1)
        ).join(' ');
        setUserName(formattedName);
      }
    };
    
    getUserInfo();
  }, []);
  
  const getInitials = (name: string) => {
    if (name === "User") return "U";
    
    // Check if it's an email address
    if (name.includes('@')) {
      const nameParts = name.split('@')[0].split('.');
      if (nameParts.length > 1) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    
    // Handle space-separated name
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    
    return name.substring(0, 2).toUpperCase();
  };

  const avatarSize = isCompact ? 'h-10 w-10' : 'h-12 w-12';
  
  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-2 mr-2">
        <div className="text-right">
          <div className="font-medium text-white">{userName}</div>
          <div className="text-xs text-gray-300 flex items-center">
            <Badge className="h-3 w-3 mr-1" />
            {userRole}
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0 h-auto w-auto !transition-none !duration-0 hover:bg-gray-800">
            <Avatar className={avatarSize}>
              <AvatarImage src="/engineer-profile.jpg" alt="Profile" />
              <AvatarFallback className="bg-akhanya text-white">
                {getInitials(userName)}
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
