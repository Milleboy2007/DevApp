// contexts/themeContext.js
import React, { createContext, useContext, useState } from 'react';

// 1. Création du contexte du thème
const ThemeContext = createContext();

// 2. Création du Provider associé
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // 'light' par défaut

  // Fonction pour basculer d'un mode à l'autre
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Hook personnalisé pour consommer le thème facilement
export const useTheme = () => {
  return useContext(ThemeContext);
};