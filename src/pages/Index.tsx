
import React, { useEffect, useState } from "react";
import NavigationBar from "@/components/navigation/NavigationBar";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Check for legacy login method (for backward compatibility)
          const loggedIn = localStorage.getItem("loggedIn");
          if (!loggedIn) {
            navigate("/login");
            return;
          }
        } else {
          // Save user email to localStorage for components that rely on it
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userEmail", session.user.email);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast("Authentication error. Please log in again.");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akhanya"></div>
    </div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <Dashboard />
    </div>
  );
};

export default Index;
