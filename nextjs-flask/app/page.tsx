'use client';
import { Waves } from "lucide-react";
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import MapComponent from '@/components/MapComponent';
import WeatherInfoCard from "@/components/WeatherInfoCard";

export default function Home() {
  const [county, setCounty] = useState("");
  const [countyProb, setCountyProb] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="font-bold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-blue-100 flex items-center gap-2">
        <span className="bg-gradient-to-b from-red-500 via-orange-400 to-green-500 bg-clip-text text-transparent">
          Heatin-Cali
        </span>
        <span className="text-lg text-gray-500">by</span>
        <span className="text-light-blue-400 flex items-center gap-1">
          River <Waves className="w-8 h-8 text-blue-400" />
        </span>
      </h1>
      <h2>
        <span className="bg-white bg-clip-text text-transparent text-xl">
          Click on the county to get a real-time wildfire prediction
        </span>
      </h2>
      <div className="flex flex-col items-center justify-between w-full">
        <div className="z-10 w-full max-w-7xl flex flex-row items-start space-x-4 justify-center">
          {county && (
            <div className="flex-shrink-0">
              <WeatherInfoCard county={county} setCounty={setCounty} countyProb={countyProb} />
            </div>
          )}
          <div className="w-[800px] h-[600px]">
            <MapComponent setCounty={setCounty} setCountyProb={setCountyProb} />
          </div>
        </div>
      </div>
    </main>
  );
}