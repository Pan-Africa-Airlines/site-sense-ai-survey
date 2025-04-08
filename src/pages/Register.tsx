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

  // ... keep existing code (return statement with the registration form)
};

export default Register;
