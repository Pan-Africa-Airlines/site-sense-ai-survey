
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Car, Loader, ArrowRight, ArrowLeft } from "lucide-react";
import VoicePrompt from '../VoicePrompt';
import { checkItems } from './checkItems';
import { useVehicleCheck } from './useVehicleCheck';
import ProgressIndicator from './ProgressIndicator';
import VehicleInfo from './VehicleInfo';
import CheckItem from './CheckItem';
import CompletionSummary from './CompletionSummary';

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
  const {
    checks,
    currentStep,
    playVoice,
    allChecksCompleted,
    handleCheckItem,
    nextStep,
    prevStep,
    handleConfirm,
    setPlayVoice
  } = useVehicleCheck(engineerId, vehicle, onConfirm);
  
  const handleDialogClose = () => {
    // Cancel any ongoing speech synthesis when dialog closes
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
  };
  
  const currentItem = currentStep < checkItems.length ? checkItems[currentStep] : null;
  
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
          <VehicleInfo vehicle={vehicle} />
          
          <ProgressIndicator 
            currentStep={currentStep} 
            totalSteps={checkItems.length} 
          />
          
          {/* Current check item */}
          {currentItem && (
            <CheckItem 
              id={currentItem.id}
              title={currentItem.title}
              description={currentItem.description}
              icon={currentItem.icon}
              checked={checks[currentItem.id]}
              onCheckedChange={() => handleCheckItem(currentItem.id)}
            />
          )}
          
          {/* Summary when all checks completed */}
          {allChecksCompleted && <CompletionSummary />}
          
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
