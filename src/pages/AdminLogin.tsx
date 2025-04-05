
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ShieldAlert } from "lucide-react";

// Mock admin credentials - in a real app, these would be stored securely
const ADMIN_CREDENTIALS = [
  { username: "admin", password: "admin123" },
  { username: "supervisor", password: "super123" }
];

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const isValidAdmin = ADMIN_CREDENTIALS.some(
      admin => admin.username === username && admin.password === password
    );

    if (isValidAdmin) {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUsername", username);
      toast({
        title: "Admin login successful",
        description: `Welcome, ${username}!`,
      });
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "Admin login failed",
        description: "Invalid admin credentials. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-white">
      <Card className="w-full max-w-md border-gray-200 bg-white/90 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500 p-3 rounded-full">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-800 text-center">Admin Access</CardTitle>
          <CardDescription className="text-gray-600 text-center">Enter your admin credentials to manage the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-gray-700">Password</Label>
              <Input
                id="admin-password"
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
              className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login as Admin"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-0">
          <p className="text-sm text-gray-500 text-center">
            For demo, use username: 'admin' and password: 'admin123'
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
