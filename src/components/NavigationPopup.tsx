
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Navigation, MapPin, Route, AlertCircle } from "lucide-react";

interface NavigationPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteName: string;
  siteAddress: string;
  siteDistance?: number;
}

const NavigationPopup = ({ 
  open, 
  onOpenChange, 
  siteName, 
  siteAddress,
  siteDistance
}: NavigationPopupProps) => {
  const { latitude, longitude, loading, error } = useGeolocation();

  const handleOpenGoogleMaps = () => {
    if (latitude && longitude) {
      // Open Google Maps with directions from current location to destination
      // Note: We don't have the exact site coordinates, so we're using the address
      const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(siteAddress)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Navigation className="mr-2 h-5 w-5 text-akhanya" />
            Navigate to {siteName}
          </DialogTitle>
          <DialogDescription>
            Get directions to the site using your current location.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-akhanya"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-3 rounded-md flex items-start">
              <AlertCircle className="text-red-500 mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Location Error</p>
                <p className="text-red-600 text-sm">{error}</p>
                <p className="text-red-600 text-sm mt-2">Please enable location services and try again.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex items-center text-blue-700 font-medium mb-1">
                  <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                  Destination
                </div>
                <p className="text-blue-800">{siteAddress}</p>
                {siteDistance && (
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <Route className="mr-1 h-4 w-4" />
                    <span>Approximately {siteDistance} km away</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center text-gray-700 font-medium mb-1">
                  <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                  Your Location
                </div>
                <p className="text-gray-800">
                  {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOpenGoogleMaps}
            disabled={loading || !!error}
            className="bg-akhanya hover:bg-akhanya/80"
          >
            <Navigation className="mr-2 h-4 w-4" />
            Open Navigation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NavigationPopup;
