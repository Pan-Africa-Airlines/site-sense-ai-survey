
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavigationBar from "@/components/navigation/NavigationBar";
import { Badge } from "@/components/ui/badge";
import { getEngineerProfileById } from "@/utils/dbHelpers/engineerProfiles";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
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
          
          // Generate unique ID based on email - using user.id from auth
          const engId = user.id || userEmail.toLowerCase().replace(/[^a-z0-9]/g, '-');
          
          // Fetch engineer profile
          const profile = await getEngineerProfileById(engId);
          setEngineerProfile(profile);
        } else {
          // Fallback to localStorage for backward compatibility
          const email = localStorage.getItem("userEmail") || "User";
          setUserEmail(email);
          
          const formattedName = email.split('@')[0].split('.').map(name => 
            name.charAt(0).toUpperCase() + name.slice(1)
          ).join(' ');
          setUserName(formattedName);
          
          // Try to fetch profile using email-based ID as fallback
          const emailBasedId = email.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const profile = await getEngineerProfileById(emailBasedId);
          setEngineerProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching engineer profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEngineerProfile();
  }, []);
  
  const getInitials = (email: string) => {
    if (email === "User") return "U";
    const nameParts = email.split('@')[0].split('.');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <>
        <NavigationBar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-akhanya">Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Personal information and status</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Skeleton className="h-32 w-32 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48 mb-3" />
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-4 w-40" />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-akhanya">Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Personal information and status</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="/engineer-profile.jpg" alt={userName} />
                  <AvatarFallback className="bg-akhanya text-white text-2xl">
                    {getInitials(userEmail)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{engineerProfile?.name || userName}</h2>
                <p className="text-gray-500 mb-3">{userEmail}</p>
                <div className="flex items-center justify-center mb-4">
                  <Badge className="bg-akhanya">
                    {engineerProfile?.specializations && engineerProfile.specializations.length > 0 
                      ? engineerProfile.specializations[0] 
                      : "Field Engineer"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {engineerProfile?.experience || "Member since January 2024"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-akhanya">Specializations</h3>
                      <p className="text-gray-600">
                        {engineerProfile?.specializations && engineerProfile.specializations.length > 0 
                          ? engineerProfile.specializations.join(', ') 
                          : "Network Installation, Fiber Optics, Equipment Maintenance"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-akhanya">Regions</h3>
                      <p className="text-gray-600">
                        {engineerProfile?.regions && engineerProfile.regions.length > 0 
                          ? engineerProfile.regions.join(', ') 
                          : "Gauteng, Western Cape, KwaZulu-Natal"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-akhanya">Experience</h3>
                      <p className="text-gray-600">
                        {engineerProfile?.experience || "5+ years in telecommunications infrastructure"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-sm">Assessments</p>
                      <p className="text-2xl font-bold text-akhanya">
                        {engineerProfile?.assessments_count || "24"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-sm">Installations</p>
                      <p className="text-2xl font-bold text-akhanya">
                        {engineerProfile?.installations_count || "18"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-sm">Satisfaction</p>
                      <p className="text-2xl font-bold text-akhanya">
                        {engineerProfile?.average_rating 
                          ? `${Math.round((engineerProfile.average_rating / 5) * 100)}%` 
                          : "96%"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
