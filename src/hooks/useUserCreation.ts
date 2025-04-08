
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  regions: string[];
  experience?: string;
}

interface UseUserCreationReturn {
  createUser: (data: UserFormData) => Promise<any>;
  isSubmitting: boolean;
  error: Error | null;
}

export const useUserCreation = (): UseUserCreationReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createUser = async (data: UserFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Creating new user with data:", data);
      
      // Use signUp to create the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      });
      
      if (authError) {
        console.error("Error creating auth user:", authError);
        throw authError;
      }
      
      const userId = authData?.user?.id;
      
      if (!userId) {
        throw new Error("Failed to get user ID from auth response");
      }
      
      // Create the engineer profile with the role in specializations
      // The role will be stored in the specializations array
      const { data: newEngineer, error } = await supabase
        .from("engineer_profiles")
        .insert({
          id: userId,
          name: data.name,
          email: data.email,
          specializations: [data.role], // Store role as a specialization
          regions: data.regions,
          experience: data.experience || "New",
          average_rating: 0,
          total_reviews: 0,
        })
        .select();
      
      if (error) {
        console.error("Error creating engineer profile:", error);
        throw error;
      }
      
      if (newEngineer && newEngineer.length > 0) {
        const newUser = {
          id: newEngineer[0].id,
          name: newEngineer[0].name,
          email: newEngineer[0].email,
          role: data.role,
          status: "active",
          experience: newEngineer[0].experience,
          regions: newEngineer[0].regions,
        };
        
        toast.success("User created successfully");
        return newUser;
      }
      
      throw new Error("Failed to create user profile");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user");
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createUser,
    isSubmitting,
    error
  };
};
