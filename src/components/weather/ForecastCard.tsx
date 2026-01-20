import React from 'react';
import { motion } from 'framer-motion';
import { WeatherIcon } from './WeatherIcon';
import { useWeather } from '@/contexts/WeatherContext';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export const ForecastCard: React.FC = () => {
  const { forecast, getDisplayTemp, isLoading, weather } = useWeather();

  if (isLoading) {
    return <ForecastSkeleton />;
  }

  if (!weather || forecast.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="glass-card p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h3 className="text-lg font-display font-semibold text-foreground mb-4">
        5-Day Forecast
      </h3>
      
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {forecast.map((day, index) => (
            <motion.div
              key={day.date}
              className="flex-shrink-0 bg-secondary/50 rounded-xl p-4 min-w-[100px] text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <p className="text-sm font-medium text-foreground">{day.day}</p>
              <p className="text-xs text-muted-foreground">{day.date}</p>
              <div className="my-3 flex justify-center">
                <WeatherIcon condition={day.condition} size="sm" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {getDisplayTemp(day.high)}
              </p>
              <p className="text-xs text-muted-foreground">
                {getDisplayTemp(day.low)}
              </p>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
};

const ForecastSkeleton: React.FC = () => (
  <div className="glass-card p-4 md:p-6 animate-pulse">
    <div className="h-6 w-32 bg-muted rounded-lg mb-4" />
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 bg-muted rounded-xl p-4 min-w-[100px] h-28" />
      ))}
    </div>
  </div>
);
