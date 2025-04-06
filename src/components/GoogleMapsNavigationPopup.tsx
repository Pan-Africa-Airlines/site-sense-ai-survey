
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Navigation, MapPin, Route, AlertCircle, Maximize2, Minimize2, RefreshCw, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoogleMapsNavigationPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteName: string;
  siteAddress: string;
  siteDistance?: number;
}

const GoogleMapsNavigationPopup: React.FC<GoogleMapsNavigationPopupProps> = ({ 
  open, 
  onOpenChange, 
  siteName, 
  siteAddress,
  siteDistance
}: GoogleMapsNavigationPopupProps) => {
  const { latitude, longitude, loading, error, retry } = useGeolocation();
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  // Pre-fetch location and set up Google Maps URL when the popup opens
  useEffect(() => {
    if (open && !loading && !error && latitude && longitude) {
      const encodedAddress = encodeURIComponent(siteAddress);
      const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodedAddress}&travelmode=driving`;
      setGoogleMapsUrl(url);
    } else if (open && !latitude && !longitude && !loading && !error) {
      retry();
    }
  }, [open, latitude, longitude, siteAddress, loading, error, retry]);

  const handleStartNavigation = () => {
    if (googleMapsUrl) {
      // Open Google Maps in a new tab
      window.open(googleMapsUrl, '_blank');
      
      toast({
        title: "Navigation Started",
        description: "Opening Google Maps navigation"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={expanded ? "max-w-[90vw] h-[90vh] p-0" : "sm:max-w-md"}>
        {expanded ? (
          <div className="h-full flex flex-col">
            <div className="p-3 flex justify-between items-center border-b">
              <h3 className="font-semibold flex items-center">
                <Navigation className="mr-2 h-5 w-5 text-akhanya" />
                Navigate to {siteName}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setExpanded(false)}>
                <Minimize2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-grow">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-akhanya"></div>
                </div>
              ) : error ? (
                <div className="p-4 h-full flex items-center justify-center">
                  <div className="bg-red-50 p-6 rounded-lg max-w-md">
                    <div className="flex items-start">
                      <AlertCircle className="text-red-500 mr-3 h-6 w-6 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-semibold text-lg mb-2">Location Error</p>
                        <p className="text-red-700 mb-4">{error}</p>
                        <Button 
                          onClick={retry} 
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Retry Location
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : googleMapsUrl ? (
                <iframe 
                  src={googleMapsUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Navigation"
                ></iframe>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Preparing navigation...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Navigation className="mr-2 h-5 w-5 text-akhanya" />
                Navigate to {siteName}
              </DialogTitle>
              <DialogDescription>
                Get directions to the site using Google Maps.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {loading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-akhanya"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="text-red-500 mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium mb-1">Location Error</p>
                      <p className="text-red-700 mb-3">{error}</p>
                      <Button 
                        onClick={retry} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry Location
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                  
                  <div className="mt-4 bg-blue-50 p-4 rounded-md">
                    <p className="text-blue-800 text-sm">
                      Use Google Maps for turn-by-turn navigation to this site. Click "Start Navigation" 
                      to open Google Maps in a new tab or window.
                    </p>
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                {!error && !loading && (
                  <>
                    <Button
                      onClick={() => setExpanded(true)}
                      variant="outline"
                      className="border-akhanya text-akhanya hover:bg-akhanya/10"
                    >
                      <Maximize2 className="mr-2 h-4 w-4" />
                      Full Screen
                    </Button>
                    <Button
                      onClick={handleStartNavigation}
                      className="bg-akhanya hover:bg-akhanya/80"
                    >
                      <Compass className="mr-2 h-4 w-4" />
                      Start Navigation
                    </Button>
                  </>
                )}
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GoogleMapsNavigationPopup;
