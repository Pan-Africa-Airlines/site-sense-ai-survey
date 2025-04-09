
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a user has admin role by looking at their specializations
 * @param userId The ID of the user to check
 * @returns Boolean indicating if the user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    // For development mode: allow admin emails to bypass DB check
    if (process.env.NODE_ENV === 'development') {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email || '';
      
      if (isAdminEmail(userEmail)) {
        console.log("Development mode: Admin email detected, bypassing DB check");
        return true;
      }
    }
    
    // Check engineer_profiles for admin specialization
    const { data, error } = await supabase
      .from('engineer_profiles')
      .select('specializations')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    if (!data) {
      console.log("No profile found for user", userId);
      return false;
    }
    
    return data.specializations && 
           Array.isArray(data.specializations) && 
           data.specializations.includes('Administrator');
  } catch (error) {
    console.error("Error in isUserAdmin:", error);
    return false;
  }
}

/**
 * Checks if a user has admin role by checking email pattern
 * This is a backup solution if the database check fails
 * @param email The email to check
 * @returns Boolean indicating if the email looks like an admin email
 */
export function isAdminEmail(email: string): boolean {
  // Check if the email contains 'admin' or is from the organization domain
  return email.includes('admin') || email.endsWith('@akhanya.co.za');
}
