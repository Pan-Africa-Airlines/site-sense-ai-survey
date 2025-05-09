
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginPageLayout from "@/components/auth/LoginPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Auto-fill in development mode
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setEmail("admin@akhanya.co.za");
      setPassword("admin123");
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log(`Attempting admin login with:`, email);
      
      // In development mode, bypass password check
      if (process.env.NODE_ENV === 'development') {
        handleDevLogin(email);
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
      
      // Check if the user is an admin
      const { data: profileData } = await supabase
        .from('engineer_profiles')
        .select('specializations')
        .eq('email', email)
        .maybeSingle();
      
      if (!profileData || !profileData.specializations.includes('Administrator')) {
        setErrorMessage("This account is not authorized as an administrator");
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUsername", email);
      
      toast.success(`Welcome, Administrator!`);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDevLogin = (userEmail: string) => {
    try {
      console.log("Development mode: Direct login for admin:", userEmail);
      
      if (userEmail !== "admin@akhanya.co.za") {
        console.log("Not an admin email");
        setErrorMessage("Invalid admin email");
        setIsLoading(false);
        return;
      }
      
      // Store authentication info in localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUsername", userEmail);
      
      toast.success("Welcome, Administrator!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error in handleDevLogin:", error);
      setErrorMessage("An unexpected error occurred during login.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPageLayout 
      title="Administrator Login"
      description="Enter your credentials to access the admin portal"
    >
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-center mb-2">
          <div className="rounded-full bg-red-500 p-2.5 shadow-md">
            <ShieldCheck className="h-5 w-5 text-white" />
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
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
            <Input
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
              <Button variant="link" className="text-xs text-red-600 p-0 h-auto">
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
          
          <Button 
            type="submit" 
            className="w-full mt-2 bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/30 rounded-md" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in as Administrator"}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Are you an engineer? {" "}
          </span>
          <Button 
            variant="link" 
            className="text-sm p-0 text-red-600 hover:text-red-700"
            onClick={() => navigate("/login")}
          >
            Sign in as Engineer
          </Button>
        </div>
      </div>
    </LoginPageLayout>
  );
};

export default AdminLogin;
