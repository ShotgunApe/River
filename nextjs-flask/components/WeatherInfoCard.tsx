import React from 'react';
import { X } from 'lucide-react';

interface WeatherInfoCardProps {
  county: string;
  setCounty: (county: string) => void;
}

const WeatherInfoCard: React.FC<WeatherInfoCardProps> = ({ county, setCounty }) => {
  // Mock data - replace with actual API data
  const weatherData = {
    temperature: "75°F",
    wind: "12 mph",
    currentFireRisk: "Moderate",
    fiveDayForecast: [
      { day: "Day 1", risk: "Low" },
      { day: "Day 2", risk: "Moderate" },
      { day: "Day 3", risk: "High" },
      { day: "Day 4", risk: "Moderate" },
      { day: "Day 5", risk: "Low" }
    ]
  };

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
        
        <div className="space-y-2">
          <div className="p-2">
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="text-lg font-medium">{weatherData.temperature}</p>
          </div>
          
          <div className="p-2">
            <p className="text-sm text-gray-500">Wind Speed</p>
            <p className="text-lg font-medium">{weatherData.wind}</p>
          </div>
          
          <div className="p-2">
            <p className="text-sm text-gray-500">Current Fire Risk</p>
            <p className="text-lg font-medium">{weatherData.currentFireRisk}</p>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">5-Day Fire Risk Forecast</p>
            <div className="grid grid-cols-5 gap-1">
              {weatherData.fiveDayForecast.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs text-gray-500">Day {index + 1}</p>
                  <p className="text-sm font-medium">{day.risk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfoCard;

