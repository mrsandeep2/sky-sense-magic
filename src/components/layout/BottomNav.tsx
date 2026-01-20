import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Star, Brain, History } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/favorites', icon: Star, label: 'Favorites' },
  { path: '/ai-detector', icon: Brain, label: 'AI Detector' },
  { path: '/history', icon: History, label: 'History' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-card rounded-t-2xl border-t border-border/50 px-2 py-1 safe-area-pb">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center py-2 px-3"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <item.icon 
                  className={`w-5 h-5 mb-1 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
                <span 
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
