import React, {createContext, useContext} from 'react';
import {THEMES, Theme, ThemeName} from './themes';

const ThemeContext = createContext<Theme>(THEMES.dabbirha);

export const ThemeProvider: React.FC<{name?: ThemeName; children: React.ReactNode}> = ({name, children}) => (
  <ThemeContext.Provider value={THEMES[name ?? 'dabbirha'] ?? THEMES.dabbirha}>{children}</ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
