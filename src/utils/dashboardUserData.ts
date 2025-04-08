
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets authenticated user info, falling back to local storage if needed
 */
export const getAuthenticatedUserInfo = async () => {
  // Get authenticated session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.log("No authenticated session found");
    return {
      isAuthenticated: false,
      userId: "fallback-user-id",
      userName: "Test Engineer",
      userEmail: "test.engineer@example.com",
      metadata: {}
    };
  }
  
  // Get user info from auth
  const user = session.user;
  console.log("Authenticated user:", user.id);
  
  // Get metadata
  const metadata = user.user_metadata || {};
  const userEmail = user.email || localStorage.getItem("userEmail") || "john.doe@example.com";
  const userName = metadata.name || userEmail.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  ).join(' ');
  
  return {
    isAuthenticated: true,
    userId: user.id,
    userName,
    userEmail,
    metadata
  };
};
