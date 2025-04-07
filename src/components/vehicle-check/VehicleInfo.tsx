
import React from 'react';

interface VehicleInfoProps {
  vehicle: string;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({ vehicle }) => {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-md">
      <h3 className="font-medium text-gray-900">Vehicle Information</h3>
      <p className="text-sm text-gray-500 mt-1">{vehicle}</p>
    </div>
  );
};

export default VehicleInfo;
