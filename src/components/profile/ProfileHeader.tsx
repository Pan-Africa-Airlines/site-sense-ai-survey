
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileHeaderProps {
  isLoading: boolean;
  userName: string;
  userEmail: string;
  engineerProfile: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  isLoading, 
  userName, 
  userEmail, 
  engineerProfile 
}) => {
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
    );
  }

  return (
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
  );
};

export default ProfileHeader;
