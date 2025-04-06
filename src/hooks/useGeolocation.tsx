
import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  timestamp: number | null;
  address: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false, // Start as false and only set to true when explicitly requested
    error: null,
    timestamp: null,
    address: null,
  });

  // Memoize location fetching function to prevent recreating it on every render
  const fetchLocation = useCallback(() => {
    // Only set loading if we're actually going to fetch
    setState(prev => ({
      ...prev,
      loading: true,
      error: null, // Clear any previous errors
    }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by your browser"
      }));
      return;
    }

    const geoSuccess = (position: GeolocationPosition) => {
      setState(prev => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        loading: false,
        timestamp: position.timestamp,
        error: null, // Clear any previous errors
      }));

      // Reverse geocoding to get address - do this in the background after setting location
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
        .then(response => response.json())
        .then(data => {
          setState(prev => ({
            ...prev,
            address: data.display_name || null,
          }));
        })
        .catch(error => {
          console.error("Error getting address:", error);
          // Don't set state error here, as we already have coordinates
        });
    };

    const geoError = (error: GeolocationPositionError) => {
      let errorMessage = error.message;
      
      // Provide more user-friendly error messages
      if (error.code === 1) {
        errorMessage = "Location access denied. Please enable location permissions in your browser settings.";
      } else if (error.code === 2) {
        errorMessage = "Location unavailable. Please try again in a different area or with better signal.";
      } else if (error.code === 3) {
        errorMessage = "Location request timed out. Please check your GPS is enabled and try again.";
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 8000, // Reduce timeout for faster fallback
      maximumAge: 60000 // Accept positions up to 1 minute old for faster response
    };

    // Use getCurrentPosition instead of watchPosition for a one-time fast location grab
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, options);
    
    // Add a backup timeout in case geolocation API hangs
    const timeoutId = setTimeout(() => {
      setState(prev => {
        // Only set timeout error if we're still loading
        if (prev.loading) {
          return {
            ...prev,
            loading: false,
            error: "Location request timed out. Please ensure location services are enabled and try again."
          };
        }
        return prev;
      });
    }, 10000); // Slightly longer than the geolocation timeout

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Don't automatically fetch location on mount - let the component request it explicitly
  
  return { 
    ...state, 
    retry: fetchLocation // Expose the fetch function as retry
  };
};
