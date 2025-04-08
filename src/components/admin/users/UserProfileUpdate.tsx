
import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "@/hooks/useUserCreation";

interface UserProfileUpdateProps {
  userId: string | number;
  formData: UserFormData;
  prevExperience?: string;
}

export const updateUserProfile = async ({ userId, formData, prevExperience }: UserProfileUpdateProps) => {
  // Update engineer profile
  const { data: updatedEngineer, error } = await supabase
    .from("engineer_profiles")
    .update({
      name: formData.name,
      email: formData.email,
      specializations: [formData.role],
      regions: formData.regions,
      experience: formData.experience || prevExperience
    })
    .eq("id", userId.toString())
    .select();
  
  if (error) {
    console.error("Error updating engineer profile:", error);
    throw error;
  }
  
  return updatedEngineer;
};
