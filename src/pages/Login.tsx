
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, AlertCircle } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Admin credentials for demo/fallback
const ADMIN_CREDENTIALS = [
  { username: "admin@akhanya.co.za", password: "admin123" },
  { username: "supervisor@akhanya.co.za", password: "super123" }
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        throw error;
      }

      setResetSent(true);
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
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
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Sign in to EskomSiteIQ</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Enter your credentials to access the platform
                  </CardDescription>
                </div>
                
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {errorMessage}
                    </AlertDescription>
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
                        onClick={() => setForgotPasswordOpen(true)}
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

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          {resetSent ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-green-100 p-2">
                  <div className="rounded-full bg-green-500 p-1">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-center text-sm">
                Password reset email sent to <span className="font-medium">{resetEmail}</span>.
                Please check your inbox and follow the instructions.
              </p>
              <Button 
                className="w-full" 
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setResetSent(false);
                  setResetEmail("");
                }}
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotPasswordOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
