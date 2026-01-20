export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  conditionLabel: string;
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  icon: string;
}

export interface ForecastDay {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  icon: string;
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy' | 'default';

export interface FavoriteCity {
  id: string;
  city: string;
  country: string;
  addedAt: number;
}

export interface SearchHistoryItem {
  id: string;
  city: string;
  country: string;
  searchedAt: number;
}

export type TemperatureUnit = 'C' | 'F';

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  theme: 'light' | 'dark';
}

export interface AIDetectionResult {
  label: WeatherCondition;
  confidence: number;
  suggestion: string;
}
