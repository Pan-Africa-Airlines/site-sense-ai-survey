
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Wifi, Cable, Router, Brain, Sparkles, Lock, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import NetworkingBanner from "@/components/NetworkingBanner";

// Admin credentials
const ADMIN_CREDENTIALS = [
  { username: "admin@akhanya.co.za", password: "admin123" },
  { username: "supervisor@akhanya.co.za", password: "super123" }
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if admin login
    const isAdmin = ADMIN_CREDENTIALS.some(
      admin => admin.username === email && admin.password === password
    );

    if (isAdmin) {
      // Admin login
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUsername", email);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      
      toast({
        title: "Admin login successful",
        description: `Welcome, ${email}!`,
      });
      navigate("/admin/dashboard");
    } else if (email && password) {
      // Regular user login
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("adminLoggedIn", "false");
      localStorage.removeItem("adminUsername");
      
      toast({
        title: "Login successful",
        description: `Welcome, ${email}!`,
      });
      navigate("/");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 flex items-center gap-2 border border-gray-200 dark:border-gray-700">
          <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-300" />
          <Switch 
            checked={isDarkMode}
            onCheckedChange={toggleTheme}
            className="data-[state=checked]:bg-akhanya data-[state=checked]:border-akhanya"
          />
          <Moon className="h-5 w-5 text-gray-500 dark:text-blue-300" />
          <span className="text-xs font-medium ml-1 text-gray-800 dark:text-gray-200">
            {isDarkMode ? 'Dark' : 'Light'}
          </span>
        </div>
      </div>

      {/* Background with overlay and image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" 
             style={{backgroundImage: "url('/lovable-uploads/47596378-d2cb-4456-a4b6-34e2a2abfdba.png')"}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/20 to-gray-900/50"></div>
      </div>

      {/* Tech icons background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/6 text-blue-400 dark:text-blue-500 opacity-5 animate-pulse">
          <Server size={50} />
        </div>
        <div className="absolute top-2/3 left-1/3 text-blue-300 dark:text-blue-400 opacity-5 animate-pulse" style={{animationDelay: "1s"}}>
          <Wifi size={60} />
        </div>
        <div className="absolute top-1/5 right-1/4 text-green-400 dark:text-green-500 opacity-5 animate-pulse" style={{animationDelay: "1.5s"}}>
          <Cable size={45} />
        </div>
        <div className="absolute bottom-1/4 right-1/6 text-purple-400 dark:text-purple-500 opacity-5 animate-pulse" style={{animationDelay: "0.8s"}}>
          <Router size={55} />
        </div>
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
                    {/* Admin login hint */}
                    <div className="mt-1 text-xs">
                      Use <span className="font-semibold">admin@akhanya.co.za</span> for admin access
                    </div>
                  </CardDescription>
                </div>
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
                For demo: Use <span className="font-medium">admin@akhanya.co.za / admin123</span> for admin access 
                or any email/password for engineers
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
