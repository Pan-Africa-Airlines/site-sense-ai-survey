
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Car, CheckCircle, Loader } from "lucide-react";

interface VehicleCheckDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicle: string;
  isProcessing: boolean;
}

const VehicleCheckDialog: React.FC<VehicleCheckDialogProps> = ({
  open,
  onClose,
  onConfirm,
  vehicle,
  isProcessing
}) => {
  const [checks, setChecks] = useState({
    tires: false,
    oil: false,
    brakes: false,
    lights: false,
    fuel: false,
    safety: false
  });
  
  const [showReminder, setShowReminder] = useState(false);
  
  const allChecksCompleted = Object.values(checks).every(value => value === true);
  
  const handleCheckChange = (check: keyof typeof checks) => {
    setChecks(prev => ({
      ...prev,
      [check]: !prev[check]
    }));
    
    if (showReminder) {
      setShowReminder(false);
    }
  };
  
  const handleConfirm = () => {
    if (!allChecksCompleted) {
      setShowReminder(true);
      return;
    }
    
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
          
          {showReminder && !allChecksCompleted && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">Please complete all safety checks before proceeding.</p>
            </div>
          )}
          
          <h3 className="font-medium text-gray-900 mb-3">Required Safety Checks</h3>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <Checkbox 
                id="check-tires" 
                checked={checks.tires} 
                onCheckedChange={() => handleCheckChange('tires')}
                className="mt-1"
              />
              <div className="ml-3">
                <Label htmlFor="check-tires" className="font-medium">Tire Pressure & Condition</Label>
                <p className="text-sm text-gray-500">Check all tires have adequate pressure and tread</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Checkbox 
                id="check-oil" 
                checked={checks.oil} 
                onCheckedChange={() => handleCheckChange('oil')}
                className="mt-1"
              />
              <div className="ml-3">
                <Label htmlFor="check-oil" className="font-medium">Engine Oil Level</Label>
                <p className="text-sm text-gray-500">Verify oil level is between minimum and maximum marks</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Checkbox 
                id="check-brakes" 
                checked={checks.brakes} 
                onCheckedChange={() => handleCheckChange('brakes')}
                className="mt-1"
              />
              <div className="ml-3">
                <Label htmlFor="check-brakes" className="font-medium">Brake Function</Label>
                <p className="text-sm text-gray-500">Test brakes and check brake fluid level</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Checkbox 
                id="check-lights" 
                checked={checks.lights} 
                onCheckedChange={() => handleCheckChange('lights')}
                className="mt-1"
              />
              <div className="ml-3">
                <Label htmlFor="check-lights" className="font-medium">Lights & Signals</Label>
                <p className="text-sm text-gray-500">Verify all lights, indicators and signals function properly</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Checkbox 
                id="check-fuel" 
                checked={checks.fuel} 
                onCheckedChange={() => handleCheckChange('fuel')}
                className="mt-1"
              />
              <div className="ml-3">
                <Label htmlFor="check-fuel" className="font-medium">Fuel Level</Label>
                <p className="text-sm text-gray-500">Ensure adequate fuel for the journey</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Checkbox 
                id="check-safety" 
                checked={checks.safety} 
                onCheckedChange={() => handleCheckChange('safety')}
                className="mt-1"
              />
              <div className="ml-3">
                <Label htmlFor="check-safety" className="font-medium">Safety Equipment</Label>
                <p className="text-sm text-gray-500">Verify presence of safety triangle, first aid kit, and other required safety equipment</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <div className="hidden sm:block">
            {allChecksCompleted && (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                All checks completed
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleConfirm}
              className="min-w-[120px]"
              disabled={isProcessing}
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

export default VehicleCheckDialog;
