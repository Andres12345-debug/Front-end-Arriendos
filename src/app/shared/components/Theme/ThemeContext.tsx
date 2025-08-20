// src/context/ThemeContext.tsx
import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { createTheme, ThemeProvider, PaletteMode, CssBaseline } from '@mui/material';

type ThemeContextType = {
  mode: PaletteMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext debe usarse dentro de ThemeContextProvider');
  return ctx;
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(
    (localStorage.getItem('themeMode') as PaletteMode) || 'light'
  );

  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('themeMode')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
          main: "#e16614ff", // azul personalizado
        },
         secondary: {
          main: "#d31900", // azul personalizado
        },
        text: {
          primary: mode === "light" ? "#1a1a1a" : "#ffffff" + " !important",   // color principal del texto
          secondary: mode === "light" ? "#e16614ff" : "#cccccc" + " !important", // color secundario del texto
          disabled: mode === "light" ? "#0b7206ff" : "#777777" + " !important",  // color de texto deshabilitado
        },
        },
        zIndex:{
            appBar: 1100,
            modal: 1300
        },
        typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 700 },
        h4: { fontSize: '1.5rem', fontWeight: 500 },
        body1: { fontSize: '1rem', lineHeight: 1.6 },
      }


      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
