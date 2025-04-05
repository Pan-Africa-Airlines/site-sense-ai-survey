
import { useState, useEffect } from "react";

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
    loading: true,
    error: null,
    timestamp: null,
    address: null,
  });

  useEffect(() => {
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

      // Reverse geocoding to get address
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
      timeout: 10000, // Increase timeout to 10 seconds
      maximumAge: 0
    };

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
    }, 12000); // Slightly longer than the geolocation timeout

    const watchId = navigator.geolocation.watchPosition(geoSuccess, geoError, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeoutId);
    };
  }, []);

  // Add a retry function to allow users to try again
  const retry = () => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));
  };

  return { ...state, retry };
};
