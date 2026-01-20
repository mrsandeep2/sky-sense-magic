import { WeatherData, ForecastDay, WeatherCondition } from './types';

const API_KEY = 'demo'; // Using demo data for now
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Map OpenWeatherMap conditions to our simplified conditions
const mapCondition = (weatherId: number): WeatherCondition => {
  if (weatherId >= 200 && weatherId < 300) return 'stormy';
  if (weatherId >= 300 && weatherId < 600) return 'rainy';
  if (weatherId >= 600 && weatherId < 700) return 'rainy';
  if (weatherId >= 700 && weatherId < 800) return 'foggy';
  if (weatherId === 800) return 'sunny';
  if (weatherId > 800) return 'cloudy';
  return 'default';
};

// Demo data for development
const demoWeatherData: Record<string, WeatherData> = {
  'london': {
    city: 'London',
    country: 'GB',
    temperature: 12,
    feelsLike: 10,
    condition: 'cloudy',
    conditionLabel: 'Partly Cloudy',
    humidity: 78,
    windSpeed: 15,
    sunrise: '06:45',
    sunset: '18:30',
    icon: 'cloudy',
  },
  'new york': {
    city: 'New York',
    country: 'US',
    temperature: 18,
    feelsLike: 16,
    condition: 'sunny',
    conditionLabel: 'Clear Sky',
    humidity: 55,
    windSpeed: 8,
    sunrise: '05:55',
    sunset: '19:45',
    icon: 'sunny',
  },
  'tokyo': {
    city: 'Tokyo',
    country: 'JP',
    temperature: 22,
    feelsLike: 24,
    condition: 'sunny',
    conditionLabel: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    sunrise: '04:30',
    sunset: '18:55',
    icon: 'sunny',
  },
  'paris': {
    city: 'Paris',
    country: 'FR',
    temperature: 15,
    feelsLike: 13,
    condition: 'rainy',
    conditionLabel: 'Light Rain',
    humidity: 82,
    windSpeed: 20,
    sunrise: '06:15',
    sunset: '20:10',
    icon: 'rainy',
  },
  'dubai': {
    city: 'Dubai',
    country: 'AE',
    temperature: 38,
    feelsLike: 42,
    condition: 'sunny',
    conditionLabel: 'Hot & Sunny',
    humidity: 35,
    windSpeed: 6,
    sunrise: '05:40',
    sunset: '19:05',
    icon: 'sunny',
  },
  'mumbai': {
    city: 'Mumbai',
    country: 'IN',
    temperature: 32,
    feelsLike: 36,
    condition: 'stormy',
    conditionLabel: 'Thunderstorm',
    humidity: 88,
    windSpeed: 25,
    sunrise: '06:10',
    sunset: '18:45',
    icon: 'stormy',
  },
  'sydney': {
    city: 'Sydney',
    country: 'AU',
    temperature: 20,
    feelsLike: 19,
    condition: 'cloudy',
    conditionLabel: 'Overcast',
    humidity: 70,
    windSpeed: 18,
    sunrise: '06:55',
    sunset: '17:15',
    icon: 'cloudy',
  },
  'san francisco': {
    city: 'San Francisco',
    country: 'US',
    temperature: 16,
    feelsLike: 14,
    condition: 'foggy',
    conditionLabel: 'Foggy',
    humidity: 90,
    windSpeed: 10,
    sunrise: '06:00',
    sunset: '20:30',
    icon: 'foggy',
  },
};

const generateForecast = (baseTemp: number, condition: WeatherCondition): ForecastDay[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'rainy', 'sunny', 'cloudy'];
  const today = new Date();
  
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i + 1);
    const variation = Math.floor(Math.random() * 6) - 3;
    const dayCondition = i === 0 ? condition : conditions[i];
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      day: days[date.getDay()],
      high: baseTemp + variation + 3,
      low: baseTemp + variation - 3,
      condition: dayCondition,
      icon: dayCondition,
    };
  });
};

export const searchWeather = async (city: string): Promise<{ weather: WeatherData; forecast: ForecastDay[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const normalizedCity = city.toLowerCase().trim();
  const weatherData = demoWeatherData[normalizedCity];
  
  if (weatherData) {
    return {
      weather: weatherData,
      forecast: generateForecast(weatherData.temperature, weatherData.condition),
    };
  }
  
  // Generate random data for unknown cities
  const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomTemp = Math.floor(Math.random() * 30) + 5;
  
  const generatedWeather: WeatherData = {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: 'XX',
    temperature: randomTemp,
    feelsLike: randomTemp - 2,
    condition: randomCondition,
    conditionLabel: randomCondition.charAt(0).toUpperCase() + randomCondition.slice(1),
    humidity: Math.floor(Math.random() * 40) + 50,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    sunrise: '06:00',
    sunset: '18:30',
    icon: randomCondition,
  };
  
  return {
    weather: generatedWeather,
    forecast: generateForecast(randomTemp, randomCondition),
  };
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
