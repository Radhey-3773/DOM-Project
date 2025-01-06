import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'London,UK';

  try {
    const API_KEY = process.env.WEATHER_API_KEY;
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}&include=current`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();

    // Transform the API response into our desired format
    const transformedData = {
      location: {
        name: data.resolvedAddress,
        country: data.resolvedAddress.split(',').pop().trim(),
        lat: data.latitude,
        lon: data.longitude,
      },
      current: {
        temp_f: data.currentConditions.temp,
        temp_c: ((data.currentConditions.temp - 32) * 5/9).toFixed(1),
        condition: {
          text: data.currentConditions.conditions,
          icon: data.currentConditions.icon,
        },
        wind_mph: data.currentConditions.windspeed,
        wind_kph: (data.currentConditions.windspeed * 1.60934).toFixed(1),
        humidity: data.currentConditions.humidity,
        feelslike_f: data.currentConditions.feelslike,
        feelslike_c: ((data.currentConditions.feelslike - 32) * 5/9).toFixed(1),
      },
      forecast: {
        forecastday: data.days.slice(0, 5).map(day => ({
          date: day.datetime,
          day: {
            maxtemp_f: day.tempmax,
            maxtemp_c: ((day.tempmax - 32) * 5/9).toFixed(1),
            mintemp_f: day.tempmin,
            mintemp_c: ((day.tempmin - 32) * 5/9).toFixed(1),
            condition: {
              text: day.conditions,
              icon: day.icon,
            },
            daily_chance_of_rain: day.precipprob,
            humidity: day.humidity,
            wind_mph: day.windspeed,
          },
        })),
      },
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
} 