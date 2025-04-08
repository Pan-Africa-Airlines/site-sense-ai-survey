
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentEngineerProfile } from "@/utils/dbHelpers/engineerHelpers";
import { toast } from "sonner";

export const useEngineerProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [engineerProfile, setEngineerProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("User");
  const [userName, setUserName] = useState("User");
  
  useEffect(() => {
    const fetchEngineerProfile = async () => {
      try {
        setIsLoading(true);
        
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user info from auth
          const user = session.user;
          const userEmail = user.email || localStorage.getItem("userEmail") || "";
          setUserEmail(userEmail);
          
          // Format user name from email or metadata
          const metadata = user.user_metadata || {};
          const formattedName = metadata.name || userEmail.split('@')[0].split('.').map(name => 
            name.charAt(0).toUpperCase() + name.slice(1)
          ).join(' ');
          setUserName(formattedName);
          
          // Use getCurrentEngineerProfile which handles auth user
          console.log("Fetching engineer profile for authenticated user");
          const profile = await getCurrentEngineerProfile();
          console.log("Retrieved profile:", profile);
          
          if (profile) {
            setEngineerProfile(profile);
          } else {
            // Create a default profile if none exists
            const defaultProfile = {
              id: user.id,
              name: formattedName,
              email: userEmail,
              specializations: ["Field Engineer"],
              regions: ["Gauteng"],
              experience: "Member since 2024",
              assessments_count: 0,
              installations_count: 0,
              average_rating: 0
            };
            setEngineerProfile(defaultProfile);
            
            // Notify user that we're using default data
            toast("Using default profile data. Profile will be updated with real data as you use the app.");
          }
        } else {
          // Fallback to localStorage for backward compatibility
          const email = localStorage.getItem("userEmail") || "User";
          setUserEmail(email);
          
          const formattedName = email.split('@')[0].split('.').map(name => 
            name.charAt(0).toUpperCase() + name.slice(1)
          ).join(' ');
          setUserName(formattedName);
          
          // Set a default profile when no auth session
          setEngineerProfile({
            name: formattedName,
            specializations: ["Field Engineer"],
            regions: ["Gauteng"],
            experience: "Member since 2024"
          });
        }
      } catch (error) {
        console.error("Error fetching engineer profile:", error);
        toast("Could not load profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEngineerProfile();
  }, []);
  
  return {
    isLoading,
    engineerProfile,
    userEmail,
    userName
  };
};
