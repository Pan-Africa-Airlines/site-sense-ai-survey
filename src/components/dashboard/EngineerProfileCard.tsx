
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EngineerProfile } from "@/types/dashboard";

interface EngineerProfileCardProps {
  engineerProfile: EngineerProfile;
}

const EngineerProfileCard: React.FC<EngineerProfileCardProps> = ({ engineerProfile }) => {
  return (
    <Card className="overflow-hidden col-span-1 h-full">
      <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl font-bold">
              {engineerProfile.name.split(' ').map(name => name[0]).join('').toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-semibold">{engineerProfile.name}</h3>
          <p className="text-gray-500">{engineerProfile.experience} experience</p>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Rating</span>
            <span className="font-semibold flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              {engineerProfile.average_rating.toFixed(1)} ({engineerProfile.total_reviews})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Regions</span>
            <span className="font-semibold">{engineerProfile.regions?.join(', ')}</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Specializations</h4>
          <div className="flex flex-wrap gap-1">
            {engineerProfile.specializations?.map((spec, index) => (
              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngineerProfileCard;
