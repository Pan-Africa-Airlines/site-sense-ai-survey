
import React, { useEffect, useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
import VehicleCheckWizard from "@/components/VehicleCheckWizard";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vehicleCheckOpen, setVehicleCheckOpen] = useState(false);
  const [vehicleCheckProcessing, setVehicleCheckProcessing] = useState(false);
  const [vehicleCheckCompleted, setVehicleCheckCompleted] = useState(false);
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    
    // Check if vehicle check has been completed
    const vehicleCheckDone = localStorage.getItem("vehicleCheckCompleted");
    if (vehicleCheckDone === "true") {
      setVehicleCheckCompleted(true);
    } else {
      // Show vehicle check dialog on initial load if not completed
      setVehicleCheckOpen(true);
    }
  }, [navigate]);
  
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
    <>
      <NavigationBar />
      <Dashboard vehicleCheckCompleted={vehicleCheckCompleted} />
      
      {/* Vehicle check dialog */}
      <VehicleCheckWizard
        open={vehicleCheckOpen}
        onClose={() => setVehicleCheckOpen(false)}
        onConfirm={handleVehicleCheckConfirm}
        vehicle="Toyota Land Cruiser (ABC-123)"
        isProcessing={vehicleCheckProcessing}
      />
    </>
  );
};

export default Index;
