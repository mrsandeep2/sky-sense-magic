import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWeather } from '@/contexts/WeatherContext';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const { searchCity, isLoading } = useWeather();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await searchCity(query);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 text-base glass-card border-0 focus:ring-2 focus:ring-primary/50"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          size="lg"
          disabled={isLoading || !query.trim()}
          className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Search'
          )}
        </Button>
      </div>
    </motion.form>
  );
};
