import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subText: string;
  border: string;
  inputBg: string;
  primary: string;
  danger: string;
  success: string;
  completedText: string;
}

export const lightTheme: ThemeColors = {
  background: '#f4f6f8',
  card: '#ffffff',
  text: '#212529',
  subText: '#6c757d',
  border: '#e0e0e0',
  inputBg: '#ffffff',
  primary: '#007bff',
  danger: '#dc3545',
  success: '#28a745',
  completedText: '#a0aec0',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f8f9fa',
  subText: '#adb5bd',
  border: '#333333',
  inputBg: '#2a2a2a',
  primary: '#3793ff',
  danger: '#ff4d4f',
  success: '#49aa52',
  completedText: '#6c757d',
};

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
