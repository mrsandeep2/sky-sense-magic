import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Sunrise, Sunset, Star, StarOff } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { useWeather } from '@/contexts/WeatherContext';
import { Button } from '@/components/ui/button';

export const WeatherCard: React.FC = () => {
  const { 
    weather, 
    isLoading, 
    error, 
    getDisplayTemp, 
    addToFavorites, 
    removeFromFavorites, 
    isInFavorites,
    favorites
  } = useWeather();

  if (isLoading) {
    return <WeatherCardSkeleton />;
  }

  if (error) {
    return (
      <motion.div 
        className="glass-card p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-destructive font-medium">{error}</p>
      </motion.div>
    );
  }

  if (!weather) {
    return (
      <motion.div 
        className="glass-card p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <WeatherIcon condition="default" size="xl" />
        <h2 className="mt-4 text-xl font-display font-semibold text-foreground">
          Search for a city
        </h2>
        <p className="mt-2 text-muted-foreground">
          Enter a city name to see the weather
        </p>
      </motion.div>
    );
  }

  const isFav = isInFavorites(weather.city);
  const favEntry = favorites.find(f => f.city.toLowerCase() === weather.city.toLowerCase());

  const handleFavoriteToggle = () => {
    if (isFav && favEntry) {
      removeFromFavorites(favEntry.id);
    } else {
      addToFavorites(weather.city, weather.country);
    }
  };

  return (
    <motion.div 
      className="glass-card p-6 md:p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      key={weather.city}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.h2 
            className="text-2xl md:text-3xl font-display font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {weather.city}
          </motion.h2>
          <p className="text-muted-foreground">{weather.country}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteToggle}
          className="hover:bg-amber-500/10"
        >
          {isFav ? (
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          ) : (
            <StarOff className="w-6 h-6 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Main Temperature */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <WeatherIcon condition={weather.condition} size="xl" />
          <div>
            <motion.p 
              className="text-5xl md:text-6xl font-display font-bold text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {getDisplayTemp(weather.temperature)}
            </motion.p>
            <p className="text-muted-foreground mt-1">
              Feels like {getDisplayTemp(weather.feelsLike)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-medium text-foreground">{weather.conditionLabel}</p>
        </div>
      </div>

      {/* Details Grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DetailCard 
          icon={<Droplets className="w-5 h-5 text-blue-400" />}
          label="Humidity"
          value={`${weather.humidity}%`}
        />
        <DetailCard 
          icon={<Wind className="w-5 h-5 text-teal-400" />}
          label="Wind"
          value={`${weather.windSpeed} km/h`}
        />
        <DetailCard 
          icon={<Sunrise className="w-5 h-5 text-amber-400" />}
          label="Sunrise"
          value={weather.sunrise}
        />
        <DetailCard 
          icon={<Sunset className="w-5 h-5 text-orange-400" />}
          label="Sunset"
          value={weather.sunset}
        />
      </motion.div>
    </motion.div>
  );
};

const DetailCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="bg-secondary/50 rounded-xl p-3 md:p-4">
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <p className="text-lg font-semibold text-foreground">{value}</p>
  </div>
);

const WeatherCardSkeleton: React.FC = () => (
  <div className="glass-card p-6 md:p-8 space-y-6 animate-pulse">
    <div className="flex justify-between">
      <div>
        <div className="h-8 w-32 bg-muted rounded-lg" />
        <div className="h-4 w-16 bg-muted rounded-lg mt-2" />
      </div>
      <div className="h-10 w-10 bg-muted rounded-full" />
    </div>
    <div className="flex items-center gap-4">
      <div className="h-24 w-24 bg-muted rounded-full" />
      <div>
        <div className="h-14 w-32 bg-muted rounded-lg" />
        <div className="h-4 w-24 bg-muted rounded-lg mt-2" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-muted rounded-xl" />
      ))}
    </div>
  </div>
);
