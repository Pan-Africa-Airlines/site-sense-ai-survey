
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
import { createEngineerProfile } from "@/utils/dbHelpers/engineerProfiles";

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

  const ensureUserProfile = async (userId: string, userEmail: string, isAdmin: boolean) => {
    try {
      const { data: existingProfile, error: profileError } = await supabase
        .from('engineer_profiles')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error checking for existing user profile:", profileError);
        return;
      }
      
      if (existingProfile) {
        console.log("User profile already exists:", existingProfile);
        return existingProfile;
      }
      
      const formattedName = userEmail.split('@')[0].split('.').map(name => 
        name.charAt(0).toUpperCase() + name.slice(1)
      ).join(' ');
      
      const defaultProfile = {
        id: userId,
        name: formattedName,
        email: userEmail,
        specializations: isAdmin ? ["Administrator"] : ["Field Engineer"],
        regions: isAdmin ? ["All Regions"] : ["Gauteng"],
        experience: "New",
        average_rating: 0,
        total_reviews: 0
      };
      
      console.log("Creating new user profile:", defaultProfile);
      const profile = await createEngineerProfile(defaultProfile);
      
      console.log("User profile created successfully");
      return profile;
    } catch (error) {
      console.error("Error ensuring user profile:", error);
      return null;
    }
  };

  const bypassEmailVerification = async (userEmail: string, userPassword: string) => {
    try {
      console.log("Development mode: Attempting to bypass email verification for:", userEmail);
      
      if (process.env.NODE_ENV === 'development') {
        // Development bypass for predefined test users
        const testUsers = {
          admin: { email: "admin@akhanya.co.za", password: "admin123", isAdmin: true },
          siyanda: { email: "siyanda@akhanya.co.za", password: "password123", isAdmin: false },
          andile: { email: "andile@akhanya.co.za", password: "andile123", isAdmin: false }
        };
        
        let matchFound = false;
        let userData = null;
        
        // Check if credentials match any test user
        Object.entries(testUsers).forEach(([name, data]) => {
          if (userEmail === data.email && userPassword === data.password) {
            console.log(`Development login match found for ${name}`);
            matchFound = true;
            userData = data;
          }
        });
        
        if (matchFound && userData) {
          const { data: existingProfile, error: profileError } = await supabase
            .from('engineer_profiles')
            .select('*')
            .eq('email', userEmail)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error checking for existing profile:", profileError);
          }
          
          const userId = existingProfile?.id || crypto.randomUUID();
          
          if (!existingProfile) {
            await ensureUserProfile(userId, userEmail, userData.isAdmin);
          }
          
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userEmail", userEmail);
          
          if (userData.isAdmin) {
            localStorage.setItem("adminLoggedIn", "true");
            localStorage.setItem("adminUsername", userEmail);
            toast.success(`Welcome, Admin!`);
            navigate("/admin/dashboard");
          } else {
            localStorage.setItem("adminLoggedIn", "false");
            localStorage.removeItem("adminUsername");
            const userName = userEmail.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
            toast.success(`Welcome, ${userName}!`);
            navigate("/dashboard");
          }
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error bypassing email verification:", error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log(`Attempting login as ${role} with:`, email);
      
      // In development mode, try to bypass Supabase auth for test users
      if (process.env.NODE_ENV === 'development') {
        const bypassed = await bypassEmailVerification(email, password);
        if (bypassed) {
          setIsLoading(false);
          return;
        }
      }
      
      // If bypass didn't work or we're not in development, try regular auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        console.error("Authentication error:", authError);
        
        if (authError.message === "Email not confirmed") {
          if (process.env.NODE_ENV === 'development') {
            setErrorMessage("Email not confirmed. In development mode, you can click 'Sign in' again to bypass this check.");
            const bypassed = await bypassEmailVerification(email, password);
            if (bypassed) {
              setIsLoading(false);
              return;
            }
          } else {
            setErrorMessage("Please confirm your email address before logging in.");
          }
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
      
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      
      const isAdmin = await isUserAdmin(authData.user.id);
      const hasAdminEmail = isAdminEmail(email);
      const userIsAdmin = isAdmin || hasAdminEmail;
      
      await ensureUserProfile(authData.user.id, email, userIsAdmin);
      
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
        navigate("/dashboard");
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
            <div className="text-xs mb-1">
              <span className="font-medium">Engineer:</span> siyanda@akhanya.co.za / password123
            </div>
            <div className="text-xs">
              <span className="font-medium">Custom:</span> andile@akhanya.co.za / andile123
            </div>
          </div>
        )}
      </div>
    </LoginPageLayout>
  );
};

export default Login;
