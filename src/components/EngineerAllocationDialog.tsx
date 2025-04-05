
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, MapPin, CheckCircle } from "lucide-react";

interface EngineerAllocationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  engineer: {
    id: number;
    name: string;
    status: string;
    vehicle: string;
  };
  sites: Array<{
    id: number;
    name: string;
    priority: string;
    engineer: number | null;
  }>;
  selectedSites: number[];
  onToggleSite: (siteId: number) => void;
  isProcessing: boolean;
}

const EngineerAllocationDialog: React.FC<EngineerAllocationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  engineer,
  sites,
  selectedSites,
  onToggleSite,
  isProcessing
}) => {
  // Filter sites that don't have an engineer or are assigned to the current engineer
  const availableSites = sites.filter(site => 
    site.engineer === null || site.engineer === engineer.id
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Allocate Sites to Engineer</DialogTitle>
          <DialogDescription>
            Select sites to assign to {engineer.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-900">Engineer</h3>
            <div className="flex items-center mt-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="font-bold text-gray-700">{engineer.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <p className="font-medium">{engineer.name}</p>
                <p className="text-sm text-gray-500">{engineer.vehicle}</p>
              </div>
            </div>
          </div>
          
          <h3 className="font-medium text-gray-900 mb-2">Available Sites</h3>
          
          {availableSites.length === 0 ? (
            <p className="text-sm text-gray-500">No available sites found</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {availableSites.map(site => (
                <div 
                  key={site.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSites.includes(site.id) 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onToggleSite(site.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <MapPin className={`h-5 w-5 mr-2 mt-0.5 ${
                        selectedSites.includes(site.id) 
                          ? 'text-blue-500' 
                          : 'text-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium">{site.name}</p>
                        <Badge variant={
                          site.priority === 'high' ? 'destructive' : 
                          site.priority === 'medium' ? 'default' : 'outline'
                        } className="mt-1">
                          {site.priority} priority
                        </Badge>
                      </div>
                    </div>
                    
                    {selectedSites.includes(site.id) && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-gray-500">
            {selectedSites.length} site{selectedSites.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={onConfirm} 
              disabled={selectedSites.length === 0 || isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Allocate Sites'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EngineerAllocationDialog;
