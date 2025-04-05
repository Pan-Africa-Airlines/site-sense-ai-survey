
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicHeader from "@/components/DynamicHeader";
import EngineerSiteList from "@/components/EngineerSiteList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

// Mock data for allocated sites
const MOCK_ALLOCATED_SITES = [
  { 
    id: 1, 
    name: "Eskom Substation Alpha", 
    priority: "high", 
    address: "123 Main Road, Johannesburg",
    scheduledDate: "2025-04-10",
    status: "pending",
    distance: 15 
  },
  { 
    id: 2, 
    name: "Power Station Beta", 
    priority: "medium", 
    address: "45 Industrial Way, Pretoria",
    scheduledDate: "2025-04-12",
    status: "in-progress",
    distance: 28 
  },
  { 
    id: 3, 
    name: "Transmission Tower Charlie", 
    priority: "low", 
    address: "78 Hill Street, Midrand",
    scheduledDate: "2025-04-15",
    status: "pending",
    distance: 7 
  },
];

const MyAllocations = () => {
  const navigate = useNavigate();
  
  const handleVehicleCheck = () => {
    navigate("/car-check");
  };

  return (
    <>
      <DynamicHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-akhanya" />
          <h1 className="text-3xl font-bold text-akhanya">My Allocations</h1>
        </div>
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-gray-800">
              Assigned Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EngineerSiteList 
              sites={MOCK_ALLOCATED_SITES} 
              onVehicleCheck={handleVehicleCheck}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MyAllocations;
