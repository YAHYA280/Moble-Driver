import { StatusBar } from "expo-status-bar";
import React, { createContext, ReactNode, useContext } from "react";
import { useThemeColors } from "../hooks/useTheme";

interface ThemeContextType {
  colors: ReturnType<typeof useThemeColors>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colors = useThemeColors();

  return (
    <ThemeContext.Provider value={{ colors, isDark: colors.isDark }}>
      <StatusBar style={colors.isDark ? "light" : "dark"} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
