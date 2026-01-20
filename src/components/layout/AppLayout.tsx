import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useWeather } from '@/contexts/WeatherContext';

const gradientMap = {
  sunny: 'weather-gradient-sunny',
  cloudy: 'weather-gradient-cloudy',
  rainy: 'weather-gradient-rainy',
  stormy: 'weather-gradient-stormy',
  foggy: 'weather-gradient-foggy',
  default: 'weather-gradient-default',
};

export const AppLayout: React.FC = () => {
  const { weatherCondition } = useWeather();
  const gradientClass = gradientMap[weatherCondition] || gradientMap.default;

  return (
    <div className="min-h-screen relative">
      {/* Dynamic Background */}
      <motion.div 
        className={`fixed inset-0 -z-10 transition-all duration-1000 ${gradientClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={weatherCondition}
      />
      <div className="fixed inset-0 -z-10 bg-background/70 dark:bg-background/85" />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen md:ml-64 pb-24 md:pb-8">
        <div className="container max-w-4xl mx-auto px-4 py-6 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
};
