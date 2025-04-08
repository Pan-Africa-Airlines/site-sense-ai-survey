
import React from "react";
import NavigationBar from "@/components/navigation/NavigationBar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfessionalInfo from "@/components/profile/ProfessionalInfo";
import PerformanceStats from "@/components/profile/PerformanceStats";
import { useEngineerProfile } from "@/hooks/useEngineerProfile";

const Profile = () => {
  const { isLoading, engineerProfile, userEmail, userName } = useEngineerProfile();

  return (
    <>
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-akhanya">Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileHeader 
              isLoading={isLoading} 
              userName={userName} 
              userEmail={userEmail} 
              engineerProfile={engineerProfile} 
            />
          </div>
          
          <div className="md:col-span-2">
            <div className="space-y-6">
              <ProfessionalInfo 
                isLoading={isLoading} 
                engineerProfile={engineerProfile} 
              />
              
              <PerformanceStats 
                isLoading={isLoading} 
                engineerProfile={engineerProfile} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
