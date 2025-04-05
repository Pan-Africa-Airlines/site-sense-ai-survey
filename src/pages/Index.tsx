
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicHeader from "@/components/DynamicHeader";
import Dashboard from "./Dashboard";
import NetworkingBanner from "@/components/NetworkingBanner";
import EngineerSiteList from "@/components/EngineerSiteList";

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

const Index = () => {
  const navigate = useNavigate();
  const [showAllocatedSites, setShowAllocatedSites] = useState(true);
  
  const handleVehicleCheck = () => {
    navigate("/car-check");
  };

  return (
    <>
      <DynamicHeader />
      <NetworkingBanner 
        title="EskomSiteIQ Network Monitoring" 
        subtitle="AI-powered real-time insights for your network infrastructure"
      />
      
      {showAllocatedSites && (
        <div className="container mx-auto px-4 py-6">
          <EngineerSiteList 
            sites={MOCK_ALLOCATED_SITES} 
            onVehicleCheck={handleVehicleCheck}
          />
        </div>
      )}
      
      <Dashboard />
    </>
  );
};

export default Index;
