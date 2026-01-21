import { WeatherData, ForecastDay, WeatherCondition } from './types';

const API_KEY = '90b3f05d7e95335cc53b2f1f0b452601';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const mapCondition = (weatherId: number): WeatherCondition => {
  if (weatherId >= 200 && weatherId < 300) return 'stormy';
  if (weatherId >= 300 && weatherId < 600) return 'rainy';
  if (weatherId >= 600 && weatherId < 700) return 'default';
  if (weatherId >= 700 && weatherId < 800) return 'foggy';
  if (weatherId === 800) return 'sunny';
  if (weatherId > 800) return 'cloudy';
  return 'default';
};

const formatTime = (timestamp: number, timezone: number): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const getDayName = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const parseWeatherResponse = (data: any): WeatherData => {
  const condition = mapCondition(data.weather[0].id);
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition,
    conditionLabel: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    sunrise: formatTime(data.sys.sunrise, data.timezone),
    sunset: formatTime(data.sys.sunset, data.timezone),
    icon: condition,
  };
};

const parseForecastResponse = (data: any): ForecastDay[] => {
  const dailyData: Record<string, any[]> = {};
  
  // Group by day
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  // Get next 5 days (skip today)
  const days = Object.entries(dailyData).slice(1, 6);
  
  return days.map(([date, items]) => {
    const temps = items.map((item: any) => item.main.temp);
    const high = Math.round(Math.max(...temps));
    const low = Math.round(Math.min(...temps));
    const midItem = items[Math.floor(items.length / 2)];
    const condition = mapCondition(midItem.weather[0].id);
    
    return {
      date,
      day: getDayName(midItem.dt),
      high,
      low,
      condition,
      icon: condition,
    };
  });
};

export const searchWeather = async (query: string): Promise<{ weather: WeatherData; forecast: ForecastDay[] }> => {
  try {
    // Try searching by city name first, then by zip code
    let weatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`;
    let forecastUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`;
    
    // Check if it looks like a pincode/zip code (mostly numbers)
    const isPincode = /^\d{4,6}$/.test(query.trim());
    if (isPincode) {
      weatherUrl = `${BASE_URL}/weather?zip=${query.trim()}&appid=${API_KEY}&units=metric`;
      forecastUrl = `${BASE_URL}/forecast?zip=${query.trim()}&appid=${API_KEY}&units=metric`;
    }

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ]);

    if (!weatherRes.ok) {
      throw new Error('City not found');
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    return {
      weather: parseWeatherResponse(weatherData),
      forecast: parseForecastResponse(forecastData),
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data. Please check the city name or pincode.');
  }
};

export const searchWeatherByCoords = async (lat: number, lon: number): Promise<{ weather: WeatherData; forecast: ForecastDay[] }> => {
  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
    ]);

    if (!weatherRes.ok) {
      throw new Error('Location not found');
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    return {
      weather: parseWeatherResponse(weatherData),
      forecast: parseForecastResponse(forecastData),
    };
  } catch (error) {
    throw new Error('Failed to fetch weather for your location.');
  }
};

export const getWeatherSuggestion = (condition: WeatherCondition): string => {
  const suggestions: Record<WeatherCondition, string> = {
    sunny: "☀️ Use sunscreen and stay hydrated!",
    cloudy: "🧥 A light jacket is recommended.",
    rainy: "☔ Don't forget your umbrella!",
    stormy: "⚡ Stay indoors if possible.",
    foggy: "🌫️ Drive carefully, visibility is low.",
    default: "🌤️ Have a great day!",
  };
  return suggestions[condition];
};
