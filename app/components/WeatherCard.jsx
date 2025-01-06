import Image from 'next/image';

export default function WeatherCard({ data, filter }) {
  if (!data) return null;

  const getWeatherIcon = (icon) => {
    // Map Visual Crossing icons to online weather icons
    const iconMap = {
      'clear-day': 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png',
      'clear-night': 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png',
      'partly-cloudy-day': 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png',
      'partly-cloudy-night': 'https://cdn-icons-png.flaticon.com/512/3313/3313998.png',
      'cloudy': 'https://cdn-icons-png.flaticon.com/512/414/414927.png',
      'rain': 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png',
      'snow': 'https://cdn-icons-png.flaticon.com/512/642/642102.png',
      'wind': 'https://cdn-icons-png.flaticon.com/512/959/959711.png',
      'fog': 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png',
      // Metric icons
      'humidity': 'https://cdn-icons-png.flaticon.com/512/727/727790.png',
      'wind-metric': 'https://cdn-icons-png.flaticon.com/512/959/959711.png',
      'rain-chance': 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png'
    };
    return iconMap[icon] || iconMap['clear-day']; // Default to clear-day if icon not found
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      weekday: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date),
      shortWeekday: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
      day: new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date),
      month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
    };
  };
  
  const renderWeatherData = () => {
    switch (filter) {
      case 'hourly':
        return <div>Hourly forecast not available</div>;

      case 'daily':
      case 'weekly':
        return data.forecast.forecastday.map((forecast, index) => {
          const date = formatDate(forecast.date);
          return (
            <div key={index} className="weather-card flex flex-col items-center p-4">
              <div className="flex flex-col items-center mb-3">
                <span className="text-lg font-semibold">
                  {filter === 'daily' ? date.shortWeekday : date.weekday}
                </span>
                <span className="text-sm text-[var(--secondary)]">
                  {date.month} {date.day}
                </span>
              </div>
              
              <div className="relative w-20 h-20 mb-3">
                <Image
                  src={getWeatherIcon(forecast.day.condition.icon)}
                  alt={forecast.day.condition.text}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  unoptimized // Add this for external images
                />
              </div>

              <div className="flex gap-2 mb-2">
                <span className="text-lg font-semibold">{Math.round(forecast.day.maxtemp_c)}°</span>
                <span className="text-lg text-[var(--secondary)]">{Math.round(forecast.day.mintemp_c)}°</span>
              </div>

              <span className="text-sm text-center text-[var(--secondary)] mb-3">
                {forecast.day.condition.text}
              </span>

              <div className="w-full grid grid-cols-2 gap-2 text-xs text-[var(--secondary)]">
                <div className="flex items-center gap-1">
                  <Image 
                    src={getWeatherIcon('humidity')}
                    alt="humidity" 
                    width={16} 
                    height={16}
                    className="opacity-60"
                    unoptimized
                  />
                  <span>{forecast.day.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Image 
                    src={getWeatherIcon('wind-metric')}
                    alt="wind" 
                    width={16} 
                    height={16}
                    className="opacity-60"
                    unoptimized
                  />
                  <span>{Math.round(forecast.day.wind_mph * 1.60934)} km/h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Image 
                    src={getWeatherIcon('rain-chance')}
                    alt="rain chance" 
                    width={16} 
                    height={16}
                    className="opacity-60"
                    unoptimized
                  />
                  <span>{forecast.day.daily_chance_of_rain}%</span>
                </div>
              </div>
            </div>
          );
        });

      default:
        return <div>Select a time period</div>;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {renderWeatherData()}
    </div>
  );
} 