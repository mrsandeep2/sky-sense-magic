import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeatherData, ForecastDay, WeatherCondition, FavoriteCity, SearchHistoryItem, AppSettings } from '@/lib/types';
import { searchWeather } from '@/lib/weather-api';
import { 
  getFavorites, addFavorite, removeFavorite, isFavorite,
  getHistory, addToHistory, clearHistory,
  getSettings, updateSettings, convertTemperature
} from '@/lib/storage';

interface WeatherContextType {
  // Weather data
  weather: WeatherData | null;
  forecast: ForecastDay[];
  isLoading: boolean;
  error: string | null;
  weatherCondition: WeatherCondition;
  
  // Search
  searchCity: (city: string) => Promise<void>;
  
  // Favorites
  favorites: FavoriteCity[];
  addToFavorites: (city: string, country: string) => void;
  removeFromFavorites: (id: string) => void;
  isInFavorites: (city: string) => boolean;
  
  // History
  history: SearchHistoryItem[];
  clearSearchHistory: () => void;
  
  // Settings
  settings: AppSettings;
  toggleTemperatureUnit: () => void;
  toggleTheme: () => void;
  
  // Helpers
  getDisplayTemp: (temp: number) => string;
  
  // AI Detection
  setWeatherFromAI: (condition: WeatherCondition) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('default');
  
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ temperatureUnit: 'C', theme: 'light' });

  useEffect(() => {
    setFavorites(getFavorites());
    setHistory(getHistory());
    const savedSettings = getSettings();
    setSettings(savedSettings);
    
    // Apply theme
    if (savedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const searchCity = async (city: string) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await searchWeather(city);
      setWeather(result.weather);
      setForecast(result.forecast);
      setWeatherCondition(result.weather.condition);
      addToHistory(result.weather.city, result.weather.country);
      setHistory(getHistory());
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      setWeather(null);
      setForecast([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorites = (city: string, country: string) => {
    addFavorite(city, country);
    setFavorites(getFavorites());
  };

  const handleRemoveFromFavorites = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  const isInFavorites = (city: string) => isFavorite(city);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const toggleTemperatureUnit = () => {
    const newUnit = settings.temperatureUnit === 'C' ? 'F' : 'C';
    const updated = updateSettings({ temperatureUnit: newUnit });
    setSettings(updated);
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    const updated = updateSettings({ theme: newTheme });
    setSettings(updated);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getDisplayTemp = (temp: number): string => {
    const converted = convertTemperature(temp, settings.temperatureUnit);
    return `${converted}°${settings.temperatureUnit}`;
  };

  const setWeatherFromAI = (condition: WeatherCondition) => {
    setWeatherCondition(condition);
  };

  return (
    <WeatherContext.Provider
      value={{
        weather,
        forecast,
        isLoading,
        error,
        weatherCondition,
        searchCity,
        favorites,
        addToFavorites: handleAddToFavorites,
        removeFromFavorites: handleRemoveFromFavorites,
        isInFavorites,
        history,
        clearSearchHistory: handleClearHistory,
        settings,
        toggleTemperatureUnit,
        toggleTheme,
        getDisplayTemp,
        setWeatherFromAI,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
