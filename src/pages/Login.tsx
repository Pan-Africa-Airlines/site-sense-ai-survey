
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you would validate credentials with a backend
      // For demo, we accept any non-empty values
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store login state
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      
      toast.success("Login successful!");
      navigate("/car-check");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="/akhanya-logo.png" 
              alt="Akhanya IT" 
              className="h-12"
              onError={(e) => {
                // Fallback if image not found
                e.currentTarget.src = "https://via.placeholder.com/120x50?text=Akhanya+IT";
              }}
            />
            <img 
              src="/eskom-logo.png" 
              alt="Eskom" 
              className="h-12"
              onError={(e) => {
                // Fallback if image not found
                e.currentTarget.src = "https://via.placeholder.com/120x50?text=Eskom";
              }}
            />
          </div>
          <h2 className="text-3xl font-bold text-akhanya">SiteSense</h2>
          <p className="text-sm text-gray-600 mt-1">Powered by Akhanya IT & BCX</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl text-akhanya">Sign in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="technician@akhanya.co.za"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-akhanya-purple hover:bg-akhanya-dark"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Forgot password? Contact your administrator
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
