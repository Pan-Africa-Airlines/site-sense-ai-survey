
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
          
          console.log("Fetching engineer profile for authenticated user:", user.id);
          console.log("Using formatted name:", formattedName);
          
          // Use getCurrentEngineerProfile which handles auth user
          const profile = await getCurrentEngineerProfile();
          console.log("Retrieved profile:", profile);
          
          if (profile) {
            // Update engineer profile with current user name if it's using default
            if (profile.name === "Test Engineer" || !profile.name || profile.name.includes("Unknown")) {
              console.log("Updating profile with real user name:", formattedName);
              const { data: updatedProfile, error } = await supabase
                .from('engineer_profiles')
                .update({ name: formattedName })
                .eq('id', user.id)
                .select()
                .single();
                
              if (error) {
                console.error("Error updating profile name:", error);
                setEngineerProfile(profile);
              } else {
                console.log("Profile updated with real name:", updatedProfile);
                setEngineerProfile(updatedProfile);
              }
            } else {
              setEngineerProfile(profile);
            }
          } else {
            // Create a default profile if none exists
            const defaultProfile = {
              id: user.id,
              name: formattedName, // Use the formatted name, not "Test Engineer"
              email: userEmail,
              specializations: ["Field Engineer"],
              regions: ["Gauteng"],
              experience: "Member since 2024",
              assessments_count: 0,
              installations_count: 0,
              average_rating: 0
            };
            
            console.log("Creating default profile with name:", formattedName);
            
            // Actually insert this profile into the database
            const { data: insertedProfile, error } = await supabase
              .from('engineer_profiles')
              .insert(defaultProfile)
              .select()
              .single();
              
            if (error) {
              console.error("Error creating engineer profile:", error);
              setEngineerProfile(defaultProfile);
            } else {
              console.log("Created new profile:", insertedProfile);
              setEngineerProfile(insertedProfile);
            }
            
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
            name: formattedName, // Use formatted name
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
