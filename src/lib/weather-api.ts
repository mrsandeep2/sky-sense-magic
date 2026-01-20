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
  'delhi': {
    city: 'Delhi',
    country: 'IN',
    temperature: 28,
    feelsLike: 32,
    condition: 'sunny',
    conditionLabel: 'Clear',
    humidity: 45,
    windSpeed: 8,
    sunrise: '05:45',
    sunset: '18:30',
    icon: 'sunny',
  },
  'bangalore': {
    city: 'Bangalore',
    country: 'IN',
    temperature: 24,
    feelsLike: 25,
    condition: 'cloudy',
    conditionLabel: 'Partly Cloudy',
    humidity: 68,
    windSpeed: 12,
    sunrise: '06:00',
    sunset: '18:15',
    icon: 'cloudy',
  },
};

// Pincode to city mapping (demo data)
const pincodeMapping: Record<string, string> = {
  '10001': 'new york',
  '10002': 'new york',
  '10003': 'new york',
  'sw1a': 'london',
  'e1': 'london',
  'w1': 'london',
  '75001': 'paris',
  '75002': 'paris',
  '100-0001': 'tokyo',
  '400001': 'mumbai',
  '400002': 'mumbai',
  '110001': 'delhi',
  '110002': 'delhi',
  '560001': 'bangalore',
  '560002': 'bangalore',
  '94102': 'san francisco',
  '94103': 'san francisco',
  '2000': 'sydney',
  '2001': 'sydney',
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

// Check if query is a pincode/postal code
const isPincode = (query: string): boolean => {
  const cleaned = query.replace(/[\s-]/g, '').toLowerCase();
  return /^\d{4,6}$/.test(cleaned) || /^[a-z]{1,2}\d{1,2}[a-z]?$/i.test(cleaned);
};

// Resolve query to city name
const resolveQuery = (query: string): string => {
  const cleaned = query.replace(/[\s-]/g, '').toLowerCase();
  
  // Check if it's a pincode
  if (pincodeMapping[cleaned]) {
    return pincodeMapping[cleaned];
  }
  
  // Check partial pincode match
  for (const [pincode, city] of Object.entries(pincodeMapping)) {
    if (pincode.startsWith(cleaned) || cleaned.startsWith(pincode)) {
      return city;
    }
  }
  
  return query.toLowerCase().trim();
};

export const searchWeather = async (query: string): Promise<{ weather: WeatherData; forecast: ForecastDay[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const resolvedCity = resolveQuery(query);
  const weatherData = demoWeatherData[resolvedCity];
  
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
    city: query.charAt(0).toUpperCase() + query.slice(1),
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

// Search by coordinates (reverse geocoding simulation)
export const searchWeatherByCoords = async (lat: number, lon: number): Promise<{ weather: WeatherData; forecast: ForecastDay[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Demo location mapping based on approximate coordinates
  let city = 'Your Location';
  let country = 'XX';
  
  // Approximate location detection (demo)
  if (lat >= 51.4 && lat <= 51.6 && lon >= -0.3 && lon <= 0.1) {
    return searchWeather('london');
  } else if (lat >= 40.6 && lat <= 40.9 && lon >= -74.1 && lon <= -73.8) {
    return searchWeather('new york');
  } else if (lat >= 35.5 && lat <= 35.8 && lon >= 139.5 && lon <= 140.0) {
    return searchWeather('tokyo');
  } else if (lat >= 48.8 && lat <= 49.0 && lon >= 2.2 && lon <= 2.5) {
    return searchWeather('paris');
  } else if (lat >= 18.9 && lat <= 19.3 && lon >= 72.7 && lon <= 73.0) {
    return searchWeather('mumbai');
  } else if (lat >= 28.4 && lat <= 28.9 && lon >= 76.8 && lon <= 77.5) {
    return searchWeather('delhi');
  } else if (lat >= 12.8 && lat <= 13.2 && lon >= 77.4 && lon <= 77.8) {
    return searchWeather('bangalore');
  } else if (lat >= -34.0 && lat <= -33.7 && lon >= 150.9 && lon <= 151.4) {
    return searchWeather('sydney');
  } else if (lat >= 37.7 && lat <= 37.9 && lon >= -122.5 && lon <= -122.3) {
    return searchWeather('san francisco');
  } else if (lat >= 25.0 && lat <= 25.4 && lon >= 55.1 && lon <= 55.5) {
    return searchWeather('dubai');
  }
  
  // Generate random data for unknown locations
  const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomTemp = Math.floor(Math.random() * 30) + 5;
  
  const generatedWeather: WeatherData = {
    city: 'Current Location',
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
