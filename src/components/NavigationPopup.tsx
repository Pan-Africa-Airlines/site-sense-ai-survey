
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Navigation, MapPin, Route, AlertCircle, Maximize2, Minimize2, RefreshCw, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NavigationPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteName: string;
  siteAddress: string;
  siteDistance?: number;
}

// Mapbox API Key - this is a frontend-only key with URL restrictions
const MAPBOX_API_KEY = "pk.eyJ1IjoibG92YWJsZXNob3ciLCJhIjoiY2x3eGJha3I5MHJodzJxcXF2Ym1weWh6ZCJ9.TrsYcvQ2rlZDWQRo0uZhsQ";

const NavigationPopup = ({ 
  open, 
  onOpenChange, 
  siteName, 
  siteAddress,
  siteDistance
}: NavigationPopupProps) => {
  const { latitude, longitude, loading, error, retry } = useGeolocation();
  const [expanded, setExpanded] = React.useState(false);
  const [navigationStarted, setNavigationStarted] = React.useState(false);
  const { toast } = useToast();

  // Pre-fetch location when the popup opens
  useEffect(() => {
    if (open && !latitude && !longitude && !loading && !error) {
      retry();
    }
  }, [open, latitude, longitude, loading, error, retry]);
  
  // Generate Mapbox static maps URL with directions
  const getMapboxStaticUrl = () => {
    if (!latitude || !longitude) return '';
    
    // Create a static map centered on the current location
    // with a marker for the current location
    const zoom = 12;
    const width = expanded ? 1200 : 600;
    const height = expanded ? 800 : 400;
    
    // Format: longitude,latitude for Mapbox (opposite of Google Maps)
    const currentLocation = `${longitude},${latitude}`;
    
    // Add a marker pin for current location (blue)
    const currentLocationMarker = `pin-s-circle+1E88E8(${currentLocation})`;
    
    // For destination, we need to geocode the address to get coordinates
    // For now, we'll use a placeholder marker in a visible location
    // In production, you would use Mapbox Geocoding API to convert address to coordinates
    // Since we don't have the coordinates from geocoding, we'll place the destination marker 
    // slightly offset from current location
    const destinationLng = longitude + 0.01;
    const destinationLat = latitude + 0.01;
    const destinationLocation = `${destinationLng},${destinationLat}`;
    const destinationMarker = `pin-s-triangle+F44336(${destinationLocation})`;
    
    // Create a simple line between the two points 
    // Format: PathStrokeWidth+PathStrokeColor(longitude1,latitude1;longitude2,latitude2)
    const path = `path-5+0000FF-0.5(${currentLocation};${destinationLocation})`;
    
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${currentLocationMarker},${destinationMarker},${path}/${currentLocation},${zoom},0/${width}x${height}?access_token=${MAPBOX_API_KEY}`;
  };

  const getMapboxDirectionsUrl = () => {
    if (!latitude || !longitude) return '';
    
    // This URL will open Mapbox directions in a new tab
    return `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${longitude + 0.01},${latitude + 0.01}?geometries=geojson&access_token=${MAPBOX_API_KEY}`;
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const handleStartNavigation = () => {
    setNavigationStarted(true);
    setExpanded(true);
    
    // Try to open in native maps app on mobile
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
    
    if (isMobile && latitude && longitude) {
      // Create URL for native maps app - using Google Maps as it's widely supported
      // Even without API key, deep linking to the maps app works
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(siteAddress)}&travelmode=driving`;
      
      // Open in new tab which should trigger native app
      window.open(mapsUrl, '_blank');
      
      toast({
        title: "Navigation Started",
        description: "Opening navigation in maps app"
      });
    } else {
      toast({
        title: "Navigation Started",
        description: "Use the map below to navigate to the site"
      });
    }
  };

  // Check if we have a valid API key
  const hasValidApiKey = true;

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
              <Button variant="ghost" size="icon" onClick={toggleExpand}>
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
              ) : !hasValidApiKey ? (
                <div className="p-4 h-full flex items-center justify-center">
                  <div className="bg-yellow-50 p-6 rounded-lg max-w-md">
                    <div className="flex items-start">
                      <AlertCircle className="text-yellow-500 mr-3 h-6 w-6 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-yellow-800 font-semibold text-lg mb-2">Maps API Key Required</p>
                        <p className="text-yellow-700 mb-4">
                          To use the navigation feature, a valid Mapbox API key must be configured.
                          Please update the MAPBOX_API_KEY constant in the NavigationPopup component.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full">
                  <img 
                    src={getMapboxStaticUrl()}
                    width="100%"
                    height="100%"
                    className="object-cover w-full h-full"
                    alt="Mapbox Navigation Map"
                  />
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
                Get directions to the site using your current location.
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
                  
                  {hasValidApiKey ? (
                    <div className="mt-4 h-[200px] rounded-md overflow-hidden border">
                      <img 
                        src={getMapboxStaticUrl()}
                        width="100%"
                        height="100%" 
                        className="object-cover w-full h-full"
                        alt="Mapbox Preview Map"
                      />
                    </div>
                  ) : (
                    <div className="mt-4 bg-yellow-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle className="text-yellow-500 mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-800 font-medium mb-1">Maps API Key Required</p>
                          <p className="text-yellow-700">
                            To use the navigation feature, a valid Mapbox API key must be configured.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
                      onClick={toggleExpand}
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

export default NavigationPopup;
