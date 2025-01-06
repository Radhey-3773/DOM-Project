'use client';
import { useState } from 'react';
import WeatherDisplay from './components/WeatherDisplay';

export default function Home() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        Weather Forecast
      </h1>
      <WeatherDisplay 
        location={location}
        setLocation={setLocation}
        weather={weather}
        setWeather={setWeather}
      />
    </div>
  );
}
