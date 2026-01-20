import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MapPin } from 'lucide-react';
import { useWeather } from '@/contexts/WeatherContext';
import { Button } from '@/components/ui/button';
import { WeatherIcon } from '@/components/weather/WeatherIcon';

const Favorites: React.FC = () => {
  const { favorites, removeFromFavorites, searchCity } = useWeather();

  const handleCityClick = (city: string) => {
    searchCity(city);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Star className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Favorites
          </h1>
          <p className="text-muted-foreground">
            {favorites.length} saved {favorites.length === 1 ? 'city' : 'cities'}
          </p>
        </div>
      </motion.div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center"
        >
          <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-display font-semibold text-foreground">
            No favorites yet
          </h2>
          <p className="text-muted-foreground mt-2">
            Search for a city and tap the star to add it here
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {favorites.map((fav, index) => (
              <motion.div
                key={fav.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-5 cursor-pointer group hover:shadow-glass-lg transition-all duration-300"
                onClick={() => handleCityClick(fav.city)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {fav.city}
                      </h3>
                      <p className="text-sm text-muted-foreground">{fav.country}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(fav.id);
                    }}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <WeatherIcon condition="default" size="sm" animated={false} />
                  <span className="text-xs text-muted-foreground">
                    Tap to load weather
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Favorites;
