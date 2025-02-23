import React from 'react';
import { X } from 'lucide-react';

interface WeatherInfoCardProps {
  county: string;
  countyProb: any;
  setCounty: (county: string) => void;
}

const WeatherInfoCard: React.FC<WeatherInfoCardProps> = ({ county, countyProb, setCounty }) => {

  return (
    <div className="bg-white w-96 rounded-lg shadow-lg relative p-6">
      <button 
        onClick={() => setCounty("")}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
      
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">{county} County</h2>
          
          <div className="p-2">
            <p className="text-sm text-gray-500">Current Fire Risk</p>
            <p className="text-lg font-medium">{countyProb["prediction_probability"]*100 + "%"}</p>
          </div>
        </div>
      </div>
  );
};

export default WeatherInfoCard;

