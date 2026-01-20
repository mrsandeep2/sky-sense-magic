import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Star, Brain, History, Settings } from 'lucide-react';
import logo from '@/assets/logo.png';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/favorites', icon: Star, label: 'Favorites' },
  { path: '/ai-detector', icon: Brain, label: 'AI Detector' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass-card rounded-none border-r border-border/50">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SkySense Logo" className="w-10 h-10 rounded-xl" />
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">SkySense</h1>
            <p className="text-xs text-muted-foreground">AI Weather</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <item.icon 
                className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
              <span 
                className={`relative z-10 font-medium transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          SkySense AI v1.0
        </p>
      </div>
    </aside>
  );
};
