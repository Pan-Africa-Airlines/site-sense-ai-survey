
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginPageLayout from "@/components/auth/LoginPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isUserAdmin, isAdminEmail } from "@/utils/userRoles";
import { UserRole } from "@/types/user";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("engineer");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for role preselection from URL params and set up test credentials
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    
    if (roleParam === 'admin') {
      setRole('admin');
      
      // For convenience, pre-fill admin credentials
      setEmail("admin@akhanya.co.za");
      setPassword("admin123");
    }
    
    // For development: pre-fill test credentials
    if (process.env.NODE_ENV === 'development') {
      if (roleParam === 'admin' || role === 'admin') {
        setEmail("admin@akhanya.co.za");
        setPassword("admin123");
      } else {
        setEmail("siyanda@akhanya.co.za");
        setPassword("password123");
      }
    }
  }, [location, role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log(`Attempting login as ${role} with:`, email);
      
      // Development mode login for testing - bypasses Supabase auth
      if (process.env.NODE_ENV === 'development') {
        if (email === "admin@akhanya.co.za" && password === "admin123" && role === "admin") {
          console.log("Using development backdoor login for admin");
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("adminLoggedIn", "true");
          localStorage.setItem("adminUsername", email);
          
          toast.success(`Development mode: Welcome, Admin!`);
          navigate("/admin/dashboard");
          setIsLoading(false);
          return;
        } 
        
        if (email === "siyanda@akhanya.co.za" && password === "password123" && role === "engineer") {
          console.log("Using development backdoor login for engineer");
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("adminLoggedIn", "false");
          localStorage.removeItem("adminUsername");
          
          toast.success(`Development mode: Welcome, Siyanda!`);
          navigate("/dashboard");
          setIsLoading(false);
          return;
        }
      }
      
      // If not dev mode or credentials don't match, proceed with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        console.error("Authentication error:", authError);
        
        // Handle specific error codes
        if (authError.message === "Email not confirmed") {
          setErrorMessage("Please confirm your email address before logging in.");
        } else if (authError.message === "Invalid login credentials") {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage(authError.message || "Invalid credentials. Please try again.");
        }
        
        setIsLoading(false);
        return;
      }
      
      if (!authData.user) {
        console.error("No user returned after authentication");
        setErrorMessage("Login failed. Please try again.");
        setIsLoading(false);
        return;
      }
      
      // Set up common auth data in localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      
      // Check if user is admin either by email pattern or by profile specialization
      const isAdmin = await isUserAdmin(authData.user.id);
      const hasAdminEmail = isAdminEmail(email);
      const userIsAdmin = isAdmin || hasAdminEmail;
      
      // Handle login based on selected role
      if (role === "admin") {
        // Verify admin privileges if admin role was selected
        if (!userIsAdmin) {
          setErrorMessage("You don't have admin privileges");
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
        // Engineer login flow
        localStorage.setItem("adminLoggedIn", "false");
        localStorage.removeItem("adminUsername");
        
        toast.success(`Welcome, ${authData.user.email || email}!`);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPageLayout 
      title="Sign in to your account"
      description="Enter your credentials to access the platform"
    >
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-center mb-2">
          <div className="rounded-full bg-akhanya p-2.5 shadow-md">
            <Lock className="h-5 w-5 text-white" />
          </div>
        </div>
        
        {errorMessage && (
          <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
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
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold">Development Login Credentials:</div>
            <div className="text-xs mb-1">
              <span className="font-medium">Admin:</span> admin@akhanya.co.za / admin123
            </div>
            <div className="text-xs">
              <span className="font-medium">Engineer:</span> siyanda@akhanya.co.za / password123
            </div>
          </div>
        )}
      </div>
    </LoginPageLayout>
  );
};

export default Login;
