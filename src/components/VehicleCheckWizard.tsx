
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import VoicePrompt from './VoicePrompt';
import { saveVehicleCheck } from '@/utils/dbHelpers';

import { 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  Loader, 
  ArrowRight,
  ArrowLeft,
  Gauge,
  Fuel,
  LightbulbIcon,
  Wrench,
  ShieldCheck,
  Tractor
} from "lucide-react";

type CheckItem = {
  id: keyof CheckState;
  title: string;
  description: string;
  icon: React.ReactNode;
  voicePrompt: string;
};

interface CheckState {
  tires: boolean;
  oil: boolean;
  brakes: boolean;
  lights: boolean;
  fuel: boolean;
  safety: boolean;
}

interface VehicleCheckWizardProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicle: string;
  isProcessing: boolean;
  engineerId?: string;
}

const VehicleCheckWizard: React.FC<VehicleCheckWizardProps> = ({
  open,
  onClose,
  onConfirm,
  vehicle,
  isProcessing,
  engineerId = "eng-001" // Default engineer ID if not provided
}) => {
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
  const [notes, setNotes] = useState<Record<string, string>>({});
  
  const checkItems: CheckItem[] = [
    {
      id: "tires",
      title: "Tire Pressure & Condition",
      description: "Inspect all tires for proper inflation and adequate tread depth. Look for any cuts, bulges, or uneven wear patterns.",
      icon: <Gauge className="h-10 w-10 text-blue-500" />,
      voicePrompt: "Please check all tires for proper inflation and good tread depth. Look for any cuts, bulges, or uneven wear patterns. Press confirm when complete."
    },
    {
      id: "oil",
      title: "Engine Oil Level",
      description: "Check the oil level using the dipstick. Ensure it's between the minimum and maximum markings and has a clean amber color.",
      icon: <Tractor className="h-10 w-10 text-yellow-600" />,
      voicePrompt: "Please check the engine oil level using the dipstick. Make sure it's between the minimum and maximum markings and has a clean amber color. Press confirm when complete."
    },
    {
      id: "brakes",
      title: "Brake Function",
      description: "Verify brake pedal responsiveness and check brake fluid level. The fluid should be clear and at the proper level.",
      icon: <Wrench className="h-10 w-10 text-red-500" />,
      voicePrompt: "Please verify brake pedal responsiveness and check the brake fluid level. The fluid should be clear and at the proper level. Press confirm when complete."
    },
    {
      id: "lights",
      title: "Lights & Signals",
      description: "Test all exterior lights including headlights, brake lights, turn signals, and hazard lights to ensure they function properly.",
      icon: <LightbulbIcon className="h-10 w-10 text-amber-400" />,
      voicePrompt: "Please test all exterior lights including headlights, brake lights, turn signals, and hazard lights to ensure they function properly. Press confirm when complete."
    },
    {
      id: "fuel",
      title: "Fuel Level",
      description: "Confirm you have sufficient fuel for your planned journey. Fill up if the tank is less than one-quarter full.",
      icon: <Fuel className="h-10 w-10 text-green-500" />,
      voicePrompt: "Please confirm you have sufficient fuel for your planned journey. Fill up if the tank is less than one-quarter full. Press confirm when complete."
    },
    {
      id: "safety",
      title: "Safety Equipment",
      description: "Verify presence of required safety equipment: warning triangle, first aid kit, reflective vest, and fire extinguisher.",
      icon: <ShieldCheck className="h-10 w-10 text-purple-500" />,
      voicePrompt: "Please verify the presence of all required safety equipment: warning triangle, first aid kit, reflective vest, and fire extinguisher. Press confirm when complete."
    }
  ];
  
  // Start voice prompt when the dialog opens or step changes
  useEffect(() => {
    if (open && currentStep < checkItems.length) {
      setPlayVoice(true);
    }
  }, [open, currentStep, checkItems.length]);
  
  const handleCheckItem = () => {
    setChecks(prev => ({
      ...prev,
      [checkItems[currentStep].id]: true
    }));
    
    toast({
      title: "Item Checked",
      description: `${checkItems[currentStep].title} has been confirmed`,
    });
    
    if (currentStep < checkItems.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All items checked
      toast({
        title: "Check Complete",
        description: "All vehicle checks completed successfully!",
        variant: "default" // Changed from "success" to "default"
      });
    }
  };
  
  const nextStep = () => {
    if (currentStep < checkItems.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const allChecksCompleted = Object.values(checks).every(value => value === true);
  
  const currentItem = checkItems[currentStep];
  
  const handleDialogClose = () => {
    // Cancel any ongoing speech synthesis when dialog closes
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
  };
  
  const handleConfirm = async () => {
    if (!engineerId || !allChecksCompleted) return;
    
    try {
      // Calculate status based on checks
      // For simplicity, we'll consider the status "passed" if all checks are good
      // In a real app, you might have more complex logic based on specific check results
      const checkStatus: "passed" | "fair" | "failed" = "passed";
      
      // Save check results to the database
      await saveVehicleCheck(
        engineerId,
        checkStatus, 
        vehicle,
        "All checks passed successfully", // Note
        { checks } // Details - storing the check state
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
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Car className="h-5 w-5 mr-2 text-akhanya" />
            Vehicle Safety Check
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-900">Vehicle Information</h3>
            <p className="text-sm text-gray-500 mt-1">{vehicle}</p>
          </div>
          
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Progress</span>
              <span className="text-sm font-medium">{currentStep + 1} of {checkItems.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-akhanya rounded-full h-2 transition-all duration-300" 
                style={{ width: `${((currentStep + 1) / checkItems.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Current check item */}
          {currentItem && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-4">
              <div className="flex flex-col items-center mb-4">
                {currentItem.icon}
                <h3 className="text-lg font-medium mt-3 text-center">{currentItem.title}</h3>
              </div>
              
              <p className="text-gray-600 text-center mb-4">{currentItem.description}</p>
              
              <div className="flex items-center justify-center mt-2">
                <Checkbox 
                  id={`check-${currentItem.id}`} 
                  checked={checks[currentItem.id]} 
                  onCheckedChange={() => handleCheckItem()}
                  className="mr-2 h-5 w-5"
                />
                <Label htmlFor={`check-${currentItem.id}`} className="font-medium cursor-pointer">
                  Confirm Check Complete
                </Label>
              </div>
            </div>
          )}
          
          {/* Summary when all checks completed */}
          {allChecksCompleted && (
            <div className="bg-green-50 border border-green-100 rounded-md p-4 mb-4 flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">All safety checks completed!</p>
                <p className="text-green-700 text-sm mt-1">Your vehicle is ready for the journey.</p>
              </div>
            </div>
          )}
          
          <VoicePrompt 
            text={currentItem ? currentItem.voicePrompt : ""}
            play={playVoice}
            onComplete={() => setPlayVoice(false)}
          />
        </div>
        
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            
            <Button
              variant="outline"
              onClick={nextStep}
              disabled={currentStep === checkItems.length - 1}
              size="sm"
            >
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDialogClose} size="sm">Cancel</Button>
            <Button 
              onClick={handleConfirm}
              disabled={!allChecksCompleted || isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Confirm & Start Journey'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleCheckWizard;
