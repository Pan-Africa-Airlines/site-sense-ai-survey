
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isUserAdmin, isAdminEmail } from "@/utils/userRoles";
import { UserRole } from "@/types/user";
import { useLoginUtils } from "@/hooks/useLoginUtils";

interface LoginFormProps {
  initialRole?: UserRole;
  initialEmail?: string;
  initialPassword?: string;
}

const LoginForm = ({ 
  initialRole = "engineer", 
  initialEmail = "", 
  initialPassword = "" 
}: LoginFormProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>(initialRole);
  const navigate = useNavigate();
  const { handleDevModeLogin } = useLoginUtils();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", email, "as", role);
      
      // Try development mode login first
      const devLoginSuccessful = handleDevModeLogin(email, password, role, navigate);
      if (devLoginSuccessful) {
        setIsLoading(false);
        return;
      }
      
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error("Authentication error:", authError);
        toast.error(authError.message || "Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        console.error("No user returned after authentication");
        toast.error("Login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Set up common auth data in localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      
      // Check if admin role is requested
      if (role === "admin") {
        // Check if user has admin privileges
        const isAdmin = await isUserAdmin(authData.user.id);
        
        // Also check email pattern as fallback
        const hasAdminEmail = isAdminEmail(email);
        
        if (!isAdmin && !hasAdminEmail) {
          toast.error("You don't have admin privileges");
          await supabase.auth.signOut();
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("userEmail");
          setIsLoading(false);
          return;
        }
        
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminUsername", email);
        
        toast.success(`Welcome, ${authData.user.email || email}!`);
        navigate("/admin/dashboard");
      } else {
        // Normal user login flow
        localStorage.setItem("adminLoggedIn", "false");
        localStorage.removeItem("adminUsername");
        
        toast.success(`Welcome, ${authData.user.email || email}!`);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-center mb-2">
        <div className="rounded-full bg-akhanya p-2.5 shadow-md">
          <Lock className="h-5 w-5 text-white" />
        </div>
      </div>
      <form onSubmit={handleLogin} className="space-y-4 mt-2">
        <div className="space-y-2">
          <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Login as</Label>
          <Select
            defaultValue={role}
            value={role}
            onValueChange={(value: string) => setRole(value as UserRole)}
          >
            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engineer">Engineer</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
          <Input
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
            <Button variant="link" className="text-xs text-akhanya p-0 h-auto">
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full mt-2 bg-akhanya hover:bg-akhanya-dark transition-all duration-300 shadow-lg hover:shadow-akhanya/30 rounded-md" 
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
