
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Admin credentials for demo/fallback
const ADMIN_CREDENTIALS = [
  { username: "admin@akhanya.co.za", password: "admin123" },
  { username: "supervisor@akhanya.co.za", password: "super123" }
];

interface LoginFormProps {
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Try Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // Check for Supabase auth success
      if (!authError && authData.user) {
        // Get user role from metadata or profiles
        const { data: profileData, error: profileError } = await supabase
          .from("engineer_profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();
          
        let isAdmin = false;
        
        // Check if user has admin role in specializations
        if (!profileError && profileData && profileData.specializations) {
          isAdmin = profileData.specializations.some(
            (role: string) => role.toLowerCase().includes('admin') || role.toLowerCase().includes('supervisor')
          );
        }
        
        // Set login info in local storage
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userEmail", email);
        
        if (isAdmin) {
          localStorage.setItem("adminLoggedIn", "true");
          localStorage.setItem("adminUsername", email);
          
          toast({
            title: "Admin login successful",
            description: `Welcome, ${email}!`,
          });
          navigate("/admin/dashboard");
        } else {
          localStorage.setItem("adminLoggedIn", "false");
          localStorage.removeItem("adminUsername");
          
          toast({
            title: "Engineer login successful",
            description: `Welcome, ${email}!`,
          });
          navigate("/dashboard");
        }
      } 
      // If Supabase auth fails, try fallback admin credentials
      else if (authError) {
        console.log("Supabase auth failed, trying fallback admin credentials");
        
        const isAdmin = ADMIN_CREDENTIALS.some(
          admin => admin.username === email && admin.password === password
        );

        if (isAdmin) {
          localStorage.setItem("adminLoggedIn", "true");
          localStorage.setItem("adminUsername", email);
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userEmail", email);
          
          toast({
            title: "Admin login successful",
            description: `Welcome, ${email}!`,
          });
          navigate("/admin/dashboard");
        } else {
          // For demo, allow any users to login as engineers with any credentials
          if (email && password) {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userEmail", email);
            localStorage.setItem("adminLoggedIn", "false");
            localStorage.removeItem("adminUsername");
            
            toast({
              title: "Engineer login successful",
              description: `Welcome, ${email}!`,
            });
            navigate("/dashboard");
          } else {
            setErrorMessage("Please enter both email and password.");
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 mt-2">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
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
          <Button 
            variant="link" 
            className="text-xs text-akhanya p-0 h-auto"
            type="button"
            onClick={onForgotPassword}
          >
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
  );
};

export default LoginForm;
