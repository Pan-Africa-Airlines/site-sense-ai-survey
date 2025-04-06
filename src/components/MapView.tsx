
import React, { useEffect, useState } from 'react';
import { Loader, Clock, Navigation } from 'lucide-react';

// Define the interface for the MapView component props
interface MapViewProps {
  engineers: Array<{
    id: number;
    name: string;
    lat: number;
    lng: number;
    status: string;
    vehicle: string;
    lastUpdate: string;
  }>;
  sites: Array<{
    id: number;
    name: string;
    lat: number;
    lng: number;
    priority: string;
    engineer: number | null;
  }>;
  selectedEngineer: number | null;
  optimizedRoutes: Record<number, any>;
  onSiteClick?: (siteId: number) => void;
  center: { lat: number; lng: number };
}

// Mapbox API Key - this is a frontend-only key with URL restrictions
const MAPBOX_API_KEY = "pk.eyJ1IjoibG92YWJsZXNob3ciLCJhIjoiY2x3eGJha3I5MHJodzJxcXF2Ym1weWh6ZCJ9.TrsYcvQ2rlZDWQRo0uZhsQ";

const MapView: React.FC<MapViewProps> = ({ 
  engineers, 
  sites, 
  selectedEngineer, 
  optimizedRoutes,
  onSiteClick,
  center 
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Initialize the map
  useEffect(() => {
    // Create a new image element to test if the map can load
    const testImage = new Image();
    testImage.onload = () => {
      setMapLoaded(true);
      setMapError(null);
    };
    testImage.onerror = () => {
      setMapError("Failed to load the map. Please check your internet connection or try again later.");
      // Set mapLoaded to true anyway so we show the error instead of loading
      setMapLoaded(true);
    };
    
    // Try to load a small thumbnail from Mapbox to test connectivity
    testImage.src = `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${center.lng},${center.lat},5/10x10?access_token=${MAPBOX_API_KEY}`;
    
    // Simulate map loading (backup if the image test is too quick)
    const timer = setTimeout(() => {
      if (!mapLoaded) {
        setMapLoaded(true);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [center, mapLoaded]);

  // Generate Mapbox static map URL for South Africa
  const getMapboxStaticUrl = () => {
    const width = 1200;
    const height = 900;
    const centerCoords = `${center.lng},${center.lat}`;
    const zoom = 5;
    
    // Add padding to ensure the map fills the container
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${centerCoords},${zoom},0/${width}x${height}?access_token=${MAPBOX_API_KEY}`;
  };

  if (!mapLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto text-akhanya mb-2" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-800 font-medium mb-2">Map Error</p>
            <p className="text-red-700">{mapError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // South Africa centered map with appropriate zoom level
  return (
    <div className="relative h-full bg-gray-100 overflow-hidden">
      {/* Map of South Africa */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: `url('${getMapboxStaticUrl()}')`
        }}
      ></div>
      
      {/* Engineer markers */}
      {engineers.map(engineer => {
        // Adjust the conversion for South African coordinates
        // These factors are calibrated for the South African map view
        const screenX = (((engineer.lng - 22) * 80) + 600);
        const screenY = (((engineer.lat + 33) * -80) + 450);
        
        return (
          <div 
            key={engineer.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 ${
              selectedEngineer === engineer.id ? 'z-30' : ''
            }`}
            style={{ left: `${screenX}px`, top: `${screenY}px` }}
          >
            <div 
              className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${
                engineer.status === 'available' ? 'bg-green-500 border-green-600' : 
                engineer.status === 'on-site' ? 'bg-blue-500 border-blue-600' : 
                'bg-amber-500 border-amber-600'
              } ${selectedEngineer === engineer.id ? 'h-12 w-12' : ''}`}
            >
              <span className="text-white font-bold text-xs">
                {engineer.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {selectedEngineer === engineer.id && (
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white py-1 px-2 rounded shadow-md text-xs whitespace-nowrap">
                {engineer.name}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Site markers */}
      {sites.map(site => {
        // Adjust the conversion for South African coordinates
        const screenX = (((site.lng - 22) * 80) + 600);
        const screenY = (((site.lat + 33) * -80) + 450);
        
        const isSelected = selectedEngineer && 
          (site.engineer === selectedEngineer) &&
          optimizedRoutes[selectedEngineer]?.route?.some((r: any) => parseInt(r.siteId) === site.id);
        
        return (
          <div 
            key={site.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer ${
              isSelected ? 'z-20' : ''
            }`}
            style={{ left: `${screenX}px`, top: `${screenY}px` }}
            onClick={() => onSiteClick && onSiteClick(site.id)}
          >
            <div 
              className={`h-6 w-6 rounded-md border flex items-center justify-center ${
                site.priority === 'high' ? 'bg-red-500 border-red-600' : 
                site.priority === 'medium' ? 'bg-amber-500 border-amber-600' : 
                'bg-green-500 border-green-600'
              } ${isSelected ? 'h-8 w-8' : ''}`}
            >
              <span className="text-white font-bold text-xs">
                {
                  isSelected && optimizedRoutes[selectedEngineer]?.route ?
                  (optimizedRoutes[selectedEngineer].route.findIndex((r: any) => parseInt(r.siteId) === site.id) + 1) :
                  ''
                }
              </span>
            </div>
            {(isSelected || (selectedEngineer && site.engineer === selectedEngineer)) && (
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white py-1 px-2 rounded shadow-md text-xs whitespace-nowrap">
                <div>{site.name}</div>
                {isSelected && optimizedRoutes[selectedEngineer]?.eta && (
                  <div className="flex items-center mt-1 text-sm text-blue-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {optimizedRoutes[selectedEngineer].route.findIndex((r: any) => parseInt(r.siteId) === site.id) >= 0 && 
                       optimizedRoutes[selectedEngineer].distances && 
                       `${optimizedRoutes[selectedEngineer].distances[optimizedRoutes[selectedEngineer].route.findIndex((r: any) => parseInt(r.siteId) === site.id)]} km`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Route lines */}
      {selectedEngineer && optimizedRoutes[selectedEngineer]?.route && (
        <svg className="absolute inset-0 z-0 h-full w-full pointer-events-none">
          {optimizedRoutes[selectedEngineer].route.map((waypoint: any, index: number, array: any[]) => {
            if (index === 0) {
              // Find the engineer position
              const engineer = engineers.find(e => e.id === selectedEngineer);
              if (!engineer) return null;
              
              // Draw line from engineer to first site
              const startX = (((engineer.lng - 22) * 80) + 600);
              const startY = (((engineer.lat + 33) * -80) + 450);
              
              const endX = (((parseFloat(waypoint.lng) - 22) * 80) + 600);
              const endY = (((parseFloat(waypoint.lat) + 33) * -80) + 450);
              
              return (
                <line 
                  key={`route-start`}
                  x1={startX} 
                  y1={startY} 
                  x2={endX} 
                  y2={endY} 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                />
              );
            }
            
            if (index < array.length) {
              const startX = (((parseFloat(array[index-1].lng) - 22) * 80) + 600);
              const startY = (((parseFloat(array[index-1].lat) + 33) * -80) + 450);
              
              const endX = (((parseFloat(waypoint.lng) - 22) * 80) + 600);
              const endY = (((parseFloat(waypoint.lat) + 33) * -80) + 450);
              
              return (
                <line 
                  key={`route-${index}`}
                  x1={startX} 
                  y1={startY} 
                  x2={endX} 
                  y2={endY} 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                />
              );
            }
            
            return null;
          })}
        </svg>
      )}
      
      {/* Distance markers on routes */}
      {selectedEngineer && optimizedRoutes[selectedEngineer]?.route && optimizedRoutes[selectedEngineer]?.distances && (
        <>
          {optimizedRoutes[selectedEngineer].route.map((waypoint: any, index: number, array: any[]) => {
            if (index === 0) {
              // Find the engineer position
              const engineer = engineers.find(e => e.id === selectedEngineer);
              if (!engineer) return null;
              
              // Calculate midpoint for distance marker
              const startX = (((engineer.lng - 22) * 80) + 600);
              const startY = (((engineer.lat + 33) * -80) + 450);
              
              const endX = (((parseFloat(waypoint.lng) - 22) * 80) + 600);
              const endY = (((parseFloat(waypoint.lat) + 33) * -80) + 450);
              
              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;
              
              return (
                <div 
                  key={`distance-start`}
                  className="absolute bg-white px-1.5 py-0.5 rounded-full text-[10px] font-medium text-blue-600 shadow-sm z-10 flex items-center"
                  style={{ 
                    left: `${midX}px`, 
                    top: `${midY}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Navigation className="h-2.5 w-2.5 mr-0.5" />
                  {optimizedRoutes[selectedEngineer].distances[0]} km
                </div>
              );
            }
            
            if (index < array.length - 1) {
              const startX = (((parseFloat(waypoint.lng) - 22) * 80) + 600);
              const startY = (((parseFloat(waypoint.lat) + 33) * -80) + 450);
              
              const endX = (((parseFloat(array[index+1].lng) - 22) * 80) + 600);
              const endY = (((parseFloat(array[index+1].lat) + 33) * -80) + 450);
              
              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;
              
              return (
                <div 
                  key={`distance-${index}`}
                  className="absolute bg-white px-1.5 py-0.5 rounded-full text-[10px] font-medium text-blue-600 shadow-sm z-10 flex items-center"
                  style={{ 
                    left: `${midX}px`, 
                    top: `${midY}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Navigation className="h-2.5 w-2.5 mr-0.5" />
                  {optimizedRoutes[selectedEngineer].distances[index+1]} km
                </div>
              );
            }
            
            return null;
          })}
        </>
      )}
      
      {/* Map controls placeholder */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
          <span className="text-xl">+</span>
        </button>
        <button className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
          <span className="text-xl">−</span>
        </button>
      </div>
      
      {/* Add attribution for Mapbox */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white bg-opacity-70 px-1 py-0.5 rounded">
        © <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">Mapbox</a>
      </div>
    </div>
  );
};

export default MapView;
