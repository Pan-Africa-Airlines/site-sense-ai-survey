
import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";
import { UserRole } from "@/types/user";

export const useLoginUtils = () => {
  /**
   * Handle development mode login with hardcoded credentials
   * @returns boolean indicating if login was successful
   */
  const handleDevModeLogin = useCallback((
    email: string, 
    password: string, 
    role: UserRole,
    navigate: NavigateFunction
  ): boolean => {
    // Only allow in development mode
    if (process.env.NODE_ENV !== 'development') {
      return false;
    }
    
    if (email === "admin@akhanya.co.za" && password === "admin123" && role === "admin") {
      console.log("Using development backdoor login for admin");
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUsername", email);
      
      toast.success(`Development mode: Welcome, Admin!`);
      navigate("/admin/dashboard");
      return true;
    } 
    
    if (email === "siyanda@akhanya.co.za" && password === "password123" && role === "engineer") {
      console.log("Using development backdoor login for engineer");
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("adminLoggedIn", "false");
      localStorage.removeItem("adminUsername");
      
      toast.success(`Development mode: Welcome, Siyanda!`);
      navigate("/dashboard");
      return true;
    }
    
    return false;
  }, []);

  return {
    handleDevModeLogin
  };
};
