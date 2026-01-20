import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Thermometer, Moon, Sun, Trash2, LogOut, AlertCircle } from 'lucide-react';
import { useWeather } from '@/contexts/WeatherContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings: React.FC = () => {
  const { settings, toggleTemperatureUnit, toggleTheme, clearSearchHistory } = useWeather();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your experience
          </p>
        </div>
      </motion.div>

      {/* Settings Cards */}
      <div className="space-y-4">
        {/* Temperature Unit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Temperature Unit</h3>
                <p className="text-sm text-muted-foreground">
                  {settings.temperatureUnit === 'C' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${settings.temperatureUnit === 'C' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                °C
              </span>
              <Switch
                checked={settings.temperatureUnit === 'F'}
                onCheckedChange={toggleTemperatureUnit}
              />
              <span className={`text-sm ${settings.temperatureUnit === 'F' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                °F
              </span>
            </div>
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                {settings.theme === 'light' ? (
                  <Sun className="w-5 h-5 text-purple-500" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-500" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  {settings.theme === 'light' ? 'Light mode' : 'Dark mode'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className={`w-4 h-4 ${settings.theme === 'light' ? 'text-foreground' : 'text-muted-foreground'}`} />
              <Switch
                checked={settings.theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
              <Moon className={`w-4 h-4 ${settings.theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`} />
            </div>
          </div>
        </motion.div>

        {/* Clear History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Clear History</h3>
                <p className="text-sm text-muted-foreground">
                  Delete all search history
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-card">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Clear Search History
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your search history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearSearchHistory}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>

        {/* Sign Out (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Sign Out</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </div>
        </motion.div>
      </div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-muted-foreground pt-4"
      >
        <p>SkySense AI v1.0</p>
        <p className="mt-1">Made with ❤️ using Lovable</p>
      </motion.div>
    </div>
  );
};

export default Settings;
