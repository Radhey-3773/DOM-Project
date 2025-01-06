'use client';
import { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';
import WeatherFilter from './WeatherFilter';

export default function WeatherDisplay({ location, setLocation, weather, setWeather }) {
  const [filter, setFilter] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to get weather data using coordinates
    const getWeatherByCoords = async (lat, lon) => {
      console.log('Fetching weather for coordinates:', { lat, lon }); // Debug log
      try {
        const response = await fetch(`/api/weather?location=${lat},${lon}`);
        console.log('API Response status:', response.status); // Debug log
        
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data = await response.json();
        console.log('Weather data received:', data); // Debug log
        
        setWeather(data);
        setLocation(data.location.name);
      } catch (err) {
        console.error('Error in getWeatherByCoords:', err); // Debug log
        setError('Error fetching weather data');
      } finally {
        setLoading(false);
      }
    };

    // Function to handle geolocation success
    const handleSuccess = (position) => {
      console.log('Geolocation success:', position.coords); // Debug log
      const { latitude, longitude } = position.coords;
      getWeatherByCoords(latitude, longitude);
    };

    // Function to handle geolocation error
    const handleError = (error) => {
      console.error('Geolocation error:', error); // Debug log
      setError('Unable to get your location. Please enter a city manually.');
      setLoading(false);
    };

    console.log('Requesting geolocation...'); // Debug log
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } else {
      console.error('Geolocation not supported'); // Debug log
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Debug render
  console.log('Render state:', { loading, error, weather, location }); // Debug log

  if (loading) {
    return <div className="text-center">Loading weather data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="weather-display w-full max-w-4xl">
      <WeatherFilter 
        location={location}
        setLocation={setLocation}
        setWeather={setWeather}
      />
      
      {weather && (
        <div className="space-y-8">
          {/* Current Weather */}
          <div className="current-weather weather-card p-8">
            <h2 className="text-2xl font-semibold mb-6">Current Weather in {weather.location.name}</h2>
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-4">{Math.round(weather.current.temp_c)}°C</div>
              <div className="text-xl text-[var(--secondary)] mb-6">{weather.current.condition.text}</div>
              <div className="grid grid-cols-3 gap-6 text-sm w-full max-w-md">
                <div className="flex flex-col items-center p-3 rounded-lg bg-[var(--card-border)]">
                  <span className="text-[var(--secondary)] mb-1">Feels like</span>
                  <span className="font-medium">{Math.round(weather.current.feelslike_c)}°C</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-[var(--card-border)]">
                  <span className="text-[var(--secondary)] mb-1">Humidity</span>
                  <span className="font-medium">{weather.current.humidity}%</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-[var(--card-border)]">
                  <span className="text-[var(--secondary)] mb-1">Wind</span>
                  <span className="font-medium">{Math.round(weather.current.wind_kph)} km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex gap-3 justify-center my-8">
            {['hourly', 'daily', 'weekly'].map((period) => (
              <button 
                key={period}
                onClick={() => setFilter(period)}
                className={`px-6 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                  filter === period 
                    ? 'glass-button text-white' 
                    : 'bg-[var(--card-bg)] hover:bg-[var(--card-border)]'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Weather Cards */}
          <WeatherCard data={weather} filter={filter} />
        </div>
      )}
    </div>
  );
} 