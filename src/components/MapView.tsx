
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';

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

// For now, we'll create a placeholder component that will later be replaced with a real map
const MapView: React.FC<MapViewProps> = ({ 
  engineers, 
  sites, 
  selectedEngineer, 
  optimizedRoutes,
  onSiteClick,
  center 
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // In a real implementation, we would initialize a map library here (like Mapbox, Google Maps, etc.)
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

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

  // This is a placeholder for the actual map implementation
  // In a real application, you would integrate with a mapping library here
  return (
    <div className="relative h-full bg-gray-100 overflow-hidden">
      {/* Map placeholder */}
      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/28.047,-26.204,9,0/1200x900?access_token=pk.eyJ1IjoibG92YWJsZXNob3ciLCJhIjoiY2x3eGJha3I5MHJodzJxcXF2Ym1weWh6ZCJ9.TrsYcvQ2rlZDWQRo0uZhsQ')] bg-cover bg-center"></div>
      
      {/* Engineer markers */}
      {engineers.map(engineer => {
        // Convert the latitude and longitude to screen coordinates
        // This is a simplified example - in a real map, you'd use the library's methods
        const screenX = (((engineer.lng - center.lng) * 10000) + 600);
        const screenY = (((center.lat - engineer.lat) * 10000) + 450);
        
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
        // Convert the latitude and longitude to screen coordinates
        const screenX = (((site.lng - center.lng) * 10000) + 600);
        const screenY = (((center.lat - site.lat) * 10000) + 450);
        
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
                {site.name}
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
              const startX = (((engineer.lng - center.lng) * 10000) + 600);
              const startY = (((center.lat - engineer.lat) * 10000) + 450);
              
              const endX = (((parseFloat(waypoint.lng) - center.lng) * 10000) + 600);
              const endY = (((center.lat - parseFloat(waypoint.lat)) * 10000) + 450);
              
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
              const startX = (((parseFloat(array[index-1].lng) - center.lng) * 10000) + 600);
              const startY = (((center.lat - parseFloat(array[index-1].lat)) * 10000) + 450);
              
              const endX = (((parseFloat(waypoint.lng) - center.lng) * 10000) + 600);
              const endY = (((center.lat - parseFloat(waypoint.lat)) * 10000) + 450);
              
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
      
      {/* Map controls placeholder */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
          <span className="text-xl">+</span>
        </button>
        <button className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
          <span className="text-xl">−</span>
        </button>
      </div>
    </div>
  );
};

export default MapView;
