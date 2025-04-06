
import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import EngineerSiteList from "@/components/EngineerSiteList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleCheckWizard from "@/components/VehicleCheckWizard";
import { useToast } from "@/hooks/use-toast";

const MyAllocations = () => {
  const { toast } = useToast();
  const [vehicleCheckOpen, setVehicleCheckOpen] = useState(false);
  const [vehicleCheckProcessing, setVehicleCheckProcessing] = useState(false);
  const [vehicleCheckCompleted, setVehicleCheckCompleted] = useState(() => {
    return localStorage.getItem("vehicleCheckCompleted") === "true";
  });
  
  // Mock data for site allocations
  const sitesData = [
    {
      id: 1,
      name: "Eskom Site A42",
      priority: "high",
      address: "123 Main St, Johannesburg, 2000",
      scheduledDate: "Today, 15:00",
      status: "pending",
      distance: 12
    },
    {
      id: 2,
      name: "Maintenance Site B17",
      priority: "medium",
      address: "45 Power Ave, Pretoria, 0002",
      scheduledDate: "Tomorrow, 10:00",
      status: "pending",
      distance: 24
    },
    {
      id: 3,
      name: "Transmission Tower C5",
      priority: "low",
      address: "789 Grid Road, Sandton, 2196",
      scheduledDate: "Wed, 23 Apr, 14:30",
      status: "pending",
      distance: 8
    }
  ];
  
  const completedSites = [
    {
      id: 4,
      name: "Substation D78",
      priority: "high",
      address: "32 Electric Lane, Midrand, 1685",
      scheduledDate: "Completed on 5 Apr",
      status: "completed"
    },
    {
      id: 5,
      name: "Power Station G19",
      priority: "medium",
      address: "156 Energy Road, Centurion, 0157",
      scheduledDate: "Completed on 3 Apr",
      status: "completed"
    }
  ];
  
  const handleVehicleCheck = () => {
    setVehicleCheckOpen(true);
  };
  
  const handleVehicleCheckConfirm = () => {
    setVehicleCheckProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setVehicleCheckProcessing(false);
      setVehicleCheckOpen(false);
      setVehicleCheckCompleted(true);
      
      // Store completion in localStorage
      localStorage.setItem("vehicleCheckCompleted", "true");
      
      toast({
        title: "Vehicle Check Completed",
        description: "Your vehicle has been verified as safe for travel. You can now proceed to site assessments."
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-akhanya mb-6">My Site Allocations</h1>
        
        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending Sites</TabsTrigger>
            <TabsTrigger value="completed">Completed Sites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <EngineerSiteList 
              sites={sitesData} 
              onVehicleCheck={handleVehicleCheck}
              vehicleCheckCompleted={vehicleCheckCompleted}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <EngineerSiteList 
              sites={completedSites}
              onVehicleCheck={handleVehicleCheck}
              vehicleCheckCompleted={true}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Vehicle check dialog */}
      <VehicleCheckWizard
        open={vehicleCheckOpen}
        onClose={() => setVehicleCheckOpen(false)}
        onConfirm={handleVehicleCheckConfirm}
        vehicle="Toyota Land Cruiser (ABC-123)"
        isProcessing={vehicleCheckProcessing}
      />
    </div>
  );
};

export default MyAllocations;
