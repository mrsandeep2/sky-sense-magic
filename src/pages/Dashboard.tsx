import React from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '@/components/weather/SearchBar';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { ForecastCard } from '@/components/weather/ForecastCard';
import { LocationPrompt } from '@/components/weather/LocationPrompt';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left"
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Weather Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Search by city, area name, or pincode
        </p>
      </motion.div>

      {/* Location Permission Prompt */}
      <LocationPrompt />

      {/* Search */}
      <SearchBar />

      {/* Weather Display */}
      <WeatherCard />

      {/* Forecast */}
      <ForecastCard />
    </div>
  );
};

export default Dashboard;
