import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// Admin credentials for demo/fallback
const ADMIN_CREDENTIALS = [
  { username: "admin@akhanya.co.za", password: "admin123" },
  { username: "supervisor@akhanya.co.za", password: "super123" }
];

type UserRole = "engineer" | "admin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("engineer");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check for role preselection from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'admin') {
      setRole('admin');
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Admin login flow
      if (role === "admin") {
        // First try Supabase auth for admins
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        // If Supabase auth fails or user doesn't exist, try fallback admin credentials
        if (authError || !authData.user) {
          console.log("Supabase auth failed, trying fallback admin credentials");
          
          const isAdmin = ADMIN_CREDENTIALS.some(
            admin => admin.username === email && admin.password === password
          );

          if (isAdmin) {
            // Using local storage for demo purposes
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
            toast({
              title: "Admin login failed",
              description: "Invalid admin credentials. Please try again.",
              variant: "destructive",
            });
          }
        } else {
          // Successful Supabase admin auth
          localStorage.setItem("adminLoggedIn", "true");
          localStorage.setItem("adminUsername", email);
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userEmail", email);
          
          toast({
            title: "Admin login successful",
            description: `Welcome, ${authData.user.email || email}!`,
          });
          navigate("/admin/dashboard");
        }
      } 
      // Engineer login flow
      else {
        // Try Supabase auth for engineers
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        // For demo purposes, allow any credentials to work for engineers
        if (authError || !authData.user) {
          console.log("Auth failed but allowing login for demo purposes");
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
            toast({
              title: "Login failed",
              description: "Please enter both email and password.",
              variant: "destructive",
            });
          }
        } else {
          // Successful Supabase engineer auth
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userEmail", authData.user.email || email);
          localStorage.setItem("adminLoggedIn", "false");
          localStorage.removeItem("adminUsername");
          
          toast({
            title: "Engineer login successful",
            description: `Welcome, ${authData.user.email || email}!`,
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Background with overlay and image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90 dark:from-gray-950/90 dark:via-gray-900/90 dark:to-black/90">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" 
             style={{backgroundImage: "url('/lovable-uploads/47596378-d2cb-4456-a4b6-34e2a2abfdba.png')"}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/20 to-gray-900/50"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md border-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
            <CardHeader className="space-y-1 pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between gap-4 mb-4">
                <img 
                  src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
                  alt="Akhanya IT" 
                  className="h-16 drop-shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/160x60?text=Akhanya";
                  }}
                />
                <img 
                  src="https://www.eskom.co.za/wp-content/uploads/2021/08/Eskom-logo.png" 
                  alt="Eskom" 
                  className="h-14"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/140x56?text=Eskom";
                  }}
                />
              </div>
              <div className="flex justify-center mt-1 mb-2">
                <img 
                  src="/lovable-uploads/d67b70d4-e9cc-436f-a32c-4063e2443190.png" 
                  alt="BCX" 
                  className="h-20"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/200x80?text=BCX";
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-center mb-2">
                  <div className="rounded-full bg-akhanya p-2.5 shadow-md">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-center space-y-1.5">
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Sign in to your account</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Enter your credentials to access the platform
                  </CardDescription>
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
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 pt-4 pb-6 px-8">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Powered by Akhanya IT Innovations
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
