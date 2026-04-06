import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 group"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
