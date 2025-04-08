
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";
import LoginPageLayout from "@/components/auth/LoginPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { isUserAdmin, isAdminEmail } from "@/utils/userRoles";
import { useLoginUtils } from "@/hooks/useLoginUtils";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleDevModeLogin } = useLoginUtils();

  useEffect(() => {
    // Pre-fill credentials for easy login in development
    if (process.env.NODE_ENV === 'development') {
      setEmail("admin@akhanya.co.za");
      setPassword("admin123");
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting admin login with:", email);
      
      // Try development mode login first
      const devLoginSuccessful = handleDevModeLogin(email, password, "admin", navigate);
      if (devLoginSuccessful) {
        setIsLoading(false);
        return;
      }
      
      // First try Supabase authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        console.error("Authentication error:", authError);
        toast.error("Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }
      
      if (!authData.user) {
        console.error("No user returned after authentication");
        toast.error("Login failed. Please try again.");
        setIsLoading(false);
        return;
      }
      
      // Verify that the user has the admin role
      const isAdmin = await isUserAdmin(authData.user.id);
      const hasAdminEmail = isAdminEmail(email);
                      
      if (!isAdmin && !hasAdminEmail) {
        console.error("User does not have admin role");
        // Sign out the user as they don't have proper admin rights
        await supabase.auth.signOut();
        toast.error("You don't have admin privileges");
        setIsLoading(false);
        return;
      }
      
      // User is authenticated and has admin role
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUsername", email);
      
      toast.success(`Welcome, ${authData.user.email || email}!`);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPageLayout 
      title="Admin Access"
      description="Enter your admin credentials to manage the system"
    >
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-red-500 p-3 rounded-full">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
        </div>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-gray-700 dark:text-gray-300">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login as Admin"}
          </Button>
        </form>
      </div>
    </LoginPageLayout>
  );
};

export default AdminLogin;
