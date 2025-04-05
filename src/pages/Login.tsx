
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
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        <Switch 
          checked={isDarkMode}
          onCheckedChange={toggleTheme}
          className="data-[state=checked]:bg-gray-600"
        />
        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMzMzMzMiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTloLTJ2LTRoMnY0ek00NCAyN2gtMnYtNGgydjR6TTQgMjdIMnYtNGgydjR6bTAtOUgydi00aDJ2NHptMC05SDJ2LTRoMnY0ek0xMyA0aDJ2NGgtMlY0em0wIDloMnY0aC0ydi00em0wIDloMnY0aC0ydi00em0wIDloMnY0aC0ydi00em0wIDloMnY0aC0ydi00eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/6 text-blue-400 dark:text-blue-500 opacity-20 animate-pulse">
          <Server size={50} />
        </div>
        <div className="absolute top-2/3 left-1/3 text-blue-300 dark:text-blue-400 opacity-15 animate-pulse" style={{animationDelay: "1s"}}>
          <Wifi size={60} />
        </div>
        <div className="absolute top-1/5 right-1/4 text-green-400 dark:text-green-500 opacity-20 animate-pulse" style={{animationDelay: "1.5s"}}>
          <Cable size={45} />
        </div>
        <div className="absolute bottom-1/4 right-1/6 text-purple-400 dark:text-purple-500 opacity-15 animate-pulse" style={{animationDelay: "0.8s"}}>
          <Router size={55} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 z-10 mt-[-80px]">
        <div className="flex flex-col items-center justify-center gap-8">
          <Card className="w-full max-w-lg border-gray-200 bg-white/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1 pb-2">
              <div className="flex flex-col items-center mb-6 mt-2">
                <img 
                  src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
                  alt="Akhanya IT" 
                  className="h-52 mb-3 drop-shadow-xl transition-all duration-300 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x120?text=Akhanya";
                  }}
                />
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                  <img 
                    src="/lovable-uploads/d67b70d4-e9cc-436f-a32c-4063e2443190.png" 
                    alt="BCX" 
                    className="h-8 mx-2"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/80x40?text=BCX";
                    }}
                  />
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                  <img 
                    src="/lovable-uploads/79b9a4a2-93ea-4150-a0ff-fe05f4ae326a.png" 
                    alt="Eskom" 
                    className="h-14"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/120x45?text=Eskom";
                    }}
                  />
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                </div>
              </div>
              <div className="flex items-center justify-center mb-2">
                <div className="bg-akhanya p-3 rounded-full">
                  <Lock className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-800 text-center">Sign in</CardTitle>
              <CardDescription className="text-gray-600 text-center">Enter your credentials to access the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
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
                    className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-akhanya hover:bg-akhanya-dark transition-all duration-300 shadow-lg hover:shadow-akhanya/50" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500 text-center">
                For demo, use any email and password
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
