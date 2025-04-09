
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
    // If already submitting, prevent duplicate submissions
    if (isSubmitting) {
      toast.info("Please wait, a user creation is already in progress");
      return null;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Creating new user with data:", data);
      
      // Check if the user already exists in our system
      const { data: existingUsers, error: searchError } = await supabase
        .from("engineer_profiles")
        .select("id, email")
        .eq("email", data.email)
        .maybeSingle();
      
      if (searchError) {
        console.error("Error checking for existing user:", searchError);
      }
      
      // If the user already exists, return that user instead of trying to create a new one
      if (existingUsers) {
        toast.info(`User with email ${data.email} already exists`);
        return {
          id: existingUsers.id,
          name: data.name,
          email: data.email,
          role: data.role,
          status: "active",
          experience: data.experience || "New",
          regions: data.regions,
        };
      }
      
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
        
        // Handle rate limiting errors with a more user-friendly message
        if (authError.status === 429) {
          throw new Error("Too many requests. Please wait a moment before trying again.");
        }
        
        throw authError;
      }
      
      const userId = authData?.user?.id;
      
      if (!userId) {
        throw new Error("Failed to get user ID from auth response");
      }
      
      // Determine if this is an admin user
      const isAdmin = data.role === "Administrator";
      
      // Create the engineer profile with the role in specializations
      const { data: newEngineer, error } = await supabase
        .from("engineer_profiles")
        .insert({
          id: userId,
          name: data.name,
          email: data.email,
          specializations: [data.role], // Store role as a specialization
          regions: isAdmin ? ["All Regions"] : data.regions,
          experience: data.experience || "New",
          average_rating: 0,
          total_reviews: 0,
        })
        .select();
      
      if (error) {
        console.error("Error creating engineer profile:", error);
        throw error;
      }
      
      // Log the user creation
      await supabase
        .from("system_logs")
        .insert({
          user_id: userId,
          user_name: data.name,
          action: isAdmin ? "admin_user_created" : "user_created",
          details: { 
            email: data.email, 
            role: data.role,
            created_by: "admin"
          }
        });
      
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
        
        toast.success(`User ${data.name} created successfully`);
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
