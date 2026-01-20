import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudFog, Cloudy } from 'lucide-react';
import { WeatherCondition } from '@/lib/types';
import { motion } from 'framer-motion';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const iconColorMap: Record<WeatherCondition, string> = {
  sunny: 'text-amber-400',
  cloudy: 'text-slate-400',
  rainy: 'text-blue-400',
  stormy: 'text-purple-500',
  foggy: 'text-slate-300',
  default: 'text-blue-400',
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  size = 'md',
  animated = true 
}) => {
  const sizeClass = sizeMap[size];
  const colorClass = iconColorMap[condition];
  
  const iconMap: Record<WeatherCondition, React.ReactNode> = {
    sunny: <Sun className={`${sizeClass} ${colorClass}`} />,
    cloudy: <Cloud className={`${sizeClass} ${colorClass}`} />,
    rainy: <CloudRain className={`${sizeClass} ${colorClass}`} />,
    stormy: <CloudLightning className={`${sizeClass} ${colorClass}`} />,
    foggy: <CloudFog className={`${sizeClass} ${colorClass}`} />,
    default: <Cloudy className={`${sizeClass} ${colorClass}`} />,
  };

  if (!animated) {
    return <>{iconMap[condition]}</>;
  }

  const getAnimation = () => {
    switch (condition) {
      case 'sunny':
        return {
          rotate: [0, 15, -15, 0],
          scale: [1, 1.1, 1],
        };
      case 'cloudy':
        return {
          x: [0, 5, -5, 0],
        };
      case 'rainy':
        return {
          y: [0, 3, 0],
        };
      case 'stormy':
        return {
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
        };
      case 'foggy':
        return {
          opacity: [1, 0.7, 1],
        };
      default:
        return {
          scale: [1, 1.02, 1],
        };
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      transition={{
        duration: condition === 'stormy' ? 0.5 : condition === 'sunny' ? 3 : 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="inline-flex"
    >
      {iconMap[condition]}
    </motion.div>
  );
};
