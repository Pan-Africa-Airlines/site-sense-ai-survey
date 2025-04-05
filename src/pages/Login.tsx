
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Wifi, Cable, Router, Brain, Sparkles, Lock, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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

    if (email && password) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
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
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        <Switch 
          checked={isDarkMode}
          onCheckedChange={toggleTheme}
          className="data-[state=checked]:bg-gray-600"
        />
        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </div>

      {/* Background with overlay and image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" 
             style={{backgroundImage: "url('/lovable-uploads/2aff538a-e780-4ee1-8585-46294ea82699.png')"}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/20 to-gray-900/50"></div>
      </div>

      {/* Tech icons background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/6 text-blue-400 dark:text-blue-500 opacity-10 animate-pulse">
          <Server size={50} />
        </div>
        <div className="absolute top-2/3 left-1/3 text-blue-300 dark:text-blue-400 opacity-10 animate-pulse" style={{animationDelay: "1s"}}>
          <Wifi size={60} />
        </div>
        <div className="absolute top-1/5 right-1/4 text-green-400 dark:text-green-500 opacity-10 animate-pulse" style={{animationDelay: "1.5s"}}>
          <Cable size={45} />
        </div>
        <div className="absolute bottom-1/4 right-1/6 text-purple-400 dark:text-purple-500 opacity-10 animate-pulse" style={{animationDelay: "0.8s"}}>
          <Router size={55} />
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md border-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
            <CardHeader className="space-y-1 pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-center mb-4">
                <img 
                  src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
                  alt="Akhanya IT" 
                  className="h-24 mb-5 drop-shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x120?text=Akhanya";
                  }}
                />
                <img 
                  src="/lovable-uploads/d67b70d4-e9cc-436f-a32c-4063e2443190.png" 
                  alt="BCX" 
                  className="h-16 mb-3"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/80x40?text=BCX";
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
                  <CardDescription className="text-gray-500 dark:text-gray-400">Enter your credentials to access the platform</CardDescription>
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
                For demo purposes, use any email and password
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
