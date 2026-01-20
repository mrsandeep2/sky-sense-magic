import { FavoriteCity, SearchHistoryItem, AppSettings, TemperatureUnit } from './types';

const FAVORITES_KEY = 'skysense_favorites';
const HISTORY_KEY = 'skysense_history';
const SETTINGS_KEY = 'skysense_settings';

const MAX_HISTORY_ITEMS = 10;

// Favorites
export const getFavorites = (): FavoriteCity[] => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addFavorite = (city: string, country: string): FavoriteCity => {
  const favorites = getFavorites();
  const existing = favorites.find(f => f.city.toLowerCase() === city.toLowerCase());
  
  if (existing) {
    return existing;
  }
  
  const newFavorite: FavoriteCity = {
    id: crypto.randomUUID(),
    city,
    country,
    addedAt: Date.now(),
  };
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([newFavorite, ...favorites]));
  return newFavorite;
};

export const removeFavorite = (id: string): void => {
  const favorites = getFavorites();
  const filtered = favorites.filter(f => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
};

export const isFavorite = (city: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(f => f.city.toLowerCase() === city.toLowerCase());
};

// Search History
export const getHistory = (): SearchHistoryItem[] => {
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToHistory = (city: string, country: string): void => {
  let history = getHistory();
  
  // Remove existing entry for same city
  history = history.filter(h => h.city.toLowerCase() !== city.toLowerCase());
  
  const newEntry: SearchHistoryItem = {
    id: crypto.randomUUID(),
    city,
    country,
    searchedAt: Date.now(),
  };
  
  history = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const clearHistory = (): void => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
};

// Settings
export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : { temperatureUnit: 'C', theme: 'light' };
};

export const updateSettings = (settings: Partial<AppSettings>): AppSettings => {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
};

export const convertTemperature = (celsius: number, unit: TemperatureUnit): number => {
  if (unit === 'F') {
    return Math.round((celsius * 9/5) + 32);
  }
  return celsius;
};
