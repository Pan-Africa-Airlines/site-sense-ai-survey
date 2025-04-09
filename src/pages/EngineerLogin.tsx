import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginPageLayout from "@/components/auth/LoginPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    
    if (roleParam === 'admin') {
      setRole('admin');
      
      setEmail("admin@akhanya.co.za");
      setPassword("admin123");
    }
    
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

  const getTestUsers = () => {
    return {
      admin: { email: "admin@akhanya.co.za", password: "admin123", isAdmin: true },
      siyanda: { email: "siyanda@akhanya.co.za", password: "password123", isAdmin: false },
      andile: { email: "andile@akhanya.co.za", password: "andile123", isAdmin: false },
      john: { email: "john.doe@example.com", password: "test123", isAdmin: false },
      jane: { email: "jane.smith@example.com", password: "test123", isAdmin: false }
    };
  };

  const handleDevLogin = (userEmail: string) => {
    try {
      console.log("Development mode: Direct login for:", userEmail);
      
      // Get test users to check admin status
      const testUsers = getTestUsers();
      
      // Find matching user by email
      const matchingUser = Object.values(testUsers).find(
        user => user.email === userEmail
      );
      
      if (!matchingUser) {
        console.log("No matching test user found");
        setErrorMessage("Invalid email. Please use one of the test emails listed below.");
        setIsLoading(false);
        return false;
      }
      
      console.log(`Development login successful for: ${userEmail}`);
      
      // Store authentication info in localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", userEmail);
      
      if (matchingUser.isAdmin) {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminUsername", userEmail);
        toast.success(`Welcome, Admin!`);
        // Make sure we're actually navigating
        navigate("/admin/dashboard");
      } else {
        localStorage.setItem("adminLoggedIn", "false");
        localStorage.removeItem("adminUsername");
        const userName = userEmail.split('@')[0].split('.').map(n => 
          n.charAt(0).toUpperCase() + n.slice(1)
        ).join(' ');
        toast.success(`Welcome, ${userName}!`);
        // Make sure we're actually navigating
        navigate("/engineer-dashboard");
      }
      
      return true;
    } catch (error) {
      console.error("Error in handleDevLogin:", error);
      setErrorMessage("An unexpected error occurred during login.");
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log(`Attempting login as ${role} with:`, email);
      
      // In development mode, bypass password check entirely
      if (process.env.NODE_ENV === 'development') {
        const success = handleDevLogin(email);
        if (!success) {
          setIsLoading(false);
        }
        return;
      }
      
      // Regular Supabase auth flow for production
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        console.error("Authentication error:", authError);
        setErrorMessage("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }
      
      if (!authData.user) {
        console.error("No user returned after authentication");
        setErrorMessage("Login failed. Please try again.");
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      
      const isAdmin = await isUserAdmin(authData.user.id);
      const hasAdminEmail = isAdminEmail(email);
      const userIsAdmin = isAdmin || hasAdminEmail;
      
      if (role === "admin") {
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
        localStorage.setItem("adminLoggedIn", "false");
        localStorage.removeItem("adminUsername");
        
        toast.success(`Welcome, ${authData.user.email || email}!`);
        navigate("/engineer-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const selectTestUser = (userEmail: string) => {
    // Auto-login when a test user is clicked in development mode
    if (process.env.NODE_ENV === 'development') {
      // Set email first (for UI consistency)
      setEmail(userEmail);
      
      // Check if this is an admin email and update role if needed
      const testUsers = getTestUsers();
      const matchingUser = Object.values(testUsers).find(
        user => user.email === userEmail
      );
      
      if (matchingUser?.isAdmin) {
        setRole('admin');
      } else {
        setRole('engineer');
      }
      
      // Login immediately
      setIsLoading(true);
      handleDevLogin(userEmail);
    } else {
      // In production, just select the email
      setEmail(userEmail);
      setPassword(""); 
      setErrorMessage(null);
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
          
          {process.env.NODE_ENV !== 'development' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                <Button variant="link" className="text-xs text-akhanya p-0 h-auto">
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 pr-10"
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full mt-2 bg-akhanya hover:bg-akhanya-dark transition-all duration-300 shadow-lg hover:shadow-akhanya/30 rounded-md" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : (process.env.NODE_ENV === 'development' ? "Enter App" : "Sign in")}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            className="text-sm text-akhanya"
            onClick={() => navigate("/engineer-dashboard")}
          >
            Go to Engineer Dashboard
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold">Quick Access Development Mode:</div>
            {Object.entries(getTestUsers()).map(([name, user]) => (
              <div 
                key={name} 
                className="text-xs mb-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded flex items-center"
                onClick={() => selectTestUser(user.email)}
              >
                <span className={`font-medium ${user.isAdmin ? 'text-red-500' : 'text-green-500'} mr-1`}>
                  {user.isAdmin ? '🔑 Admin:' : '👷 Engineer:'}
                </span> 
                <span className="hover:underline">{user.email}</span>
              </div>
            ))}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Click on any email to log in directly
            </div>
          </div>
        )}
      </div>
    </LoginPageLayout>
  );
};

export default Login;
