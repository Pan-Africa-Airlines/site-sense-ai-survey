
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavigationBar from "@/components/navigation/NavigationBar";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const userEmail = localStorage.getItem("userEmail") || "User";
  const userName = userEmail.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  ).join(' ');
  
  const getInitials = (email: string) => {
    if (email === "User") return "U";
    const nameParts = email.split('@')[0].split('.');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

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
                <h2 className="text-xl font-bold">{userName}</h2>
                <p className="text-gray-500 mb-3">{userEmail}</p>
                <div className="flex items-center justify-center mb-4">
                  <Badge className="bg-akhanya">Field Engineer</Badge>
                </div>
                <p className="text-sm text-gray-500">Member since January 2024</p>
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
                      <p className="text-gray-600">Network Installation, Fiber Optics, Equipment Maintenance</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-akhanya">Regions</h3>
                      <p className="text-gray-600">Gauteng, Western Cape, KwaZulu-Natal</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-akhanya">Experience</h3>
                      <p className="text-gray-600">5+ years in telecommunications infrastructure</p>
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
                      <p className="text-2xl font-bold text-akhanya">24</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-sm">Installations</p>
                      <p className="text-2xl font-bold text-akhanya">18</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-sm">Satisfaction</p>
                      <p className="text-2xl font-bold text-akhanya">96%</p>
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
