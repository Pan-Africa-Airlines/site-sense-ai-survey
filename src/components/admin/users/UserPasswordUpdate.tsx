<<<<<<< HEAD
=======

>>>>>>> bf288f660887b7b919c729c72da5a4d83813a915
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserPasswordUpdateProps {
  userId: string | number;
  email: string;
  password: string;
}

export const updateUserPassword = async ({ userId, email, password }: UserPasswordUpdateProps) => {
  // Don't try to use hooks outside of React components
  // Create toast objects where this function is called

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
        throw new Error("Could not update password or send password reset email");
      }
      
      // Return information about what happened
      return { passwordReset: true, message: "Password reset email sent" };
    }
    
    // Return success information
    return { updated: true, message: "Password updated successfully" };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
