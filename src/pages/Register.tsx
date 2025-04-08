
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match. Please make sure your passwords match.");
        setIsLoading(false);
        return;
      }
      
      console.log("Attempting to register user with email:", formData.email);
      
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          }
        }
      });
      
      if (error) {
        toast.error(error.message || "Registration failed");
        console.error("Registration error:", error);
      } else {
        const userId = data.user?.id;
        
        if (userId) {
          console.log("User registered successfully with ID:", userId);
          
          // The trigger we created will automatically add this user to the users table with engineer role
          
          // Create an engineer profile for the new user
          const { error: profileError } = await supabase
            .from('engineer_profiles')
            .insert({
              id: userId,
              name: formData.name,
              email: formData.email,
              specializations: ['Field Engineer'],
              regions: [],
              experience: 'New',
              average_rating: 0,
              total_reviews: 0
            });
            
          if (profileError) {
            console.error("Error creating engineer profile:", profileError);
            toast.error("Account created but profile setup failed. Please contact support.");
          } else {
            toast.success("Registration successful! You can now log in with your credentials.");
            navigate("/login");
          }
        } else {
          toast.warning("Registration process started. Please check your email to confirm your account.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("There was a problem creating your account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
            <CardHeader className="space-y-1 pb-4 text-center">
              <CardTitle className="text-2xl font-bold text-akhanya">Create an Account</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Sign up to access the Eskom site assessment platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-akhanya hover:bg-akhanya-dark transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Register"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="text-center w-full">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Already have an account?</span>
                <Link to="/login" className="text-akhanya ml-1 text-sm font-medium hover:underline">
                  Sign in
                </Link>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
