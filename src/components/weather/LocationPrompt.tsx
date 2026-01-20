import React from 'react';
import { MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWeather } from '@/contexts/WeatherContext';

export const LocationPrompt: React.FC = () => {
  const { locationStatus, requestLocation } = useWeather();
  const [dismissed, setDismissed] = React.useState(false);

  // Only show if location hasn't been requested yet
  if (dismissed || locationStatus !== 'idle') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="glass-card rounded-2xl p-4 mb-6 border border-primary/20"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">Enable Location</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Allow location access to automatically get weather for your current area
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={requestLocation}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Allow Location
              </Button>
              <Button
                onClick={() => setDismissed(true)}
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
