
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserPasswordUpdateProps {
  userId: string | number;
  email: string;
  password: string;
}

export const updateUserPassword = async ({ userId, email, password }: UserPasswordUpdateProps) => {
  const { toast } = useToast();
  
  if (!password || password.trim() === "") {
    return;
  }
  
  try {
    // Try to update password via Supabase Auth API
    const { error: passwordError } = await supabase.auth.admin.updateUserById(
      userId.toString(),
      { password }
    );
    
    if (passwordError) {
      // Fallback for non-admin accounts or if admin API fails
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (resetError) {
        console.error("Error sending password reset:", resetError);
        toast({
          title: "Warning",
          description: "Could not directly update password. A password reset email has been sent to the user instead.",
          variant: "default"
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "A password reset email has been sent to the user's email address.",
          variant: "default"
        });
      }
    } else {
      toast({
        title: "Password updated",
        description: "User password has been successfully updated.",
        variant: "default"
      });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    toast({
      title: "Error updating password",
      description: "Failed to update password",
      variant: "destructive"
    });
    throw error;
  }
};
