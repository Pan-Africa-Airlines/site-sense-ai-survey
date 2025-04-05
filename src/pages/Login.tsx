import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Wifi, Cable, Router, Brain, Sparkles } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {/* Background design elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-akhanya opacity-5 rounded-full"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-akhanya opacity-5 rounded-full"></div>
        
        {/* Network icon elements */}
        <div className="absolute top-1/4 left-1/6 text-akhanya opacity-10">
          <Server size={40} />
        </div>
        <div className="absolute top-2/3 left-1/3 text-akhanya opacity-10">
          <Wifi size={50} />
        </div>
        <div className="absolute top-1/5 right-1/4 text-akhanya opacity-10">
          <Cable size={35} />
        </div>
        <div className="absolute bottom-1/4 right-1/6 text-akhanya opacity-10">
          <Router size={45} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Branding and Features Section */}
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/lovable-uploads/cb7b4983-dd7e-4498-8586-fbd7f8b6dc3d.png" 
                alt="Akhanya IT" 
                className="h-12"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/80x30?text=Akhanya";
                }}
              />
              <div className="h-8 w-px bg-gray-300"></div>
              <img 
                src="/eskom-logo.png" 
                alt="Eskom" 
                className="h-10"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/80x30?text=Eskom";
                }}
              />
            </div>
            
            <h1 className="text-4xl font-bold text-akhanya mb-4">SiteSense</h1>
            <p className="text-lg text-gray-600 mb-8">
              AI-powered network infrastructure monitoring and management platform
            </p>
            
            {/* Feature highlights */}
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-akhanya-light p-2 rounded-full">
                  <Brain className="h-5 w-5 text-akhanya" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">AI-Powered Insights</h3>
                  <p className="text-gray-500">Advanced analytics for predictive maintenance and optimization</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-akhanya-light p-2 rounded-full">
                  <Server className="h-5 w-5 text-akhanya" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Infrastructure Monitoring</h3>
                  <p className="text-gray-500">Real-time visibility into network health and performance</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-akhanya-light p-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-akhanya" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Smart Recommendations</h3>
                  <p className="text-gray-500">AI-guided solutions for optimal network performance</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Login Form */}
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-akhanya">Sign in</CardTitle>
              <CardDescription>Enter your credentials to access the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
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
                  />
                </div>
                <Button type="submit" className="w-full bg-akhanya hover:bg-akhanya-dark" disabled={isLoading}>
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
