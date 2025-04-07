
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { saveVehicleCheck } from '@/utils/db';
import { CheckItemId } from './checkItems';

export interface CheckState {
  tires: boolean;
  oil: boolean;
  brakes: boolean;
  lights: boolean;
  fuel: boolean;
  safety: boolean;
}

export function useVehicleCheck(engineerId: string, vehicle: string, onConfirm: () => void) {
  const { toast } = useToast();
  const [checks, setChecks] = useState<CheckState>({
    tires: false,
    oil: false,
    brakes: false,
    lights: false,
    fuel: false,
    safety: false
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [playVoice, setPlayVoice] = useState(false);
  
  const handleCheckItem = (itemId: CheckItemId) => {
    setChecks(prev => ({
      ...prev,
      [itemId]: true
    }));
    
    toast({
      title: "Item Checked",
      description: `${itemId.charAt(0).toUpperCase() + itemId.slice(1)} has been confirmed`,
    });
  };
  
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  const allChecksCompleted = Object.values(checks).every(value => value === true);
  
  const handleConfirm = async () => {
    if (!engineerId || !allChecksCompleted) return;
    
    try {
      // Calculate status based on checks
      const checkStatus: "passed" | "fair" | "failed" = "passed";
      
      // Save check results to the database
      await saveVehicleCheck(
        engineerId,
        checkStatus, 
        vehicle,
        "All checks passed successfully", 
        { checks }
      );
      
      // Continue with the original onConfirm callback
      onConfirm();
      
      toast({
        title: "Vehicle Check Saved",
        description: "Your vehicle check has been recorded",
      });
    } catch (error) {
      console.error("Error saving vehicle check:", error);
      toast({
        title: "Error",
        description: "Failed to save vehicle check",
        variant: "destructive"
      });
    }
  };

  // Start voice prompt when step changes
  useEffect(() => {
    setPlayVoice(true);
  }, [currentStep]);
  
  return {
    checks,
    currentStep,
    playVoice,
    allChecksCompleted,
    handleCheckItem,
    nextStep,
    prevStep,
    handleConfirm,
    setPlayVoice
  };
}
