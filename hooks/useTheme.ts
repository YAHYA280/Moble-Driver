import { useColorScheme } from "react-native";

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    // Main brand colors (unchanged)
    primary: "#746cd4",
    primaryDark: "#5E56B3",
    primaryLight: "#9B95E8",
    secondary: "#6366f1",
    accent: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    success: "#22c55e",
    info: "#06b6d4",

    // Background colors (black/white swap)
    background: isDark ? "#0D0D0D" : "#ffffff",
    backgroundSecondary: isDark ? "#1a1a1a" : "#f8f9fa",
    backgroundTertiary: isDark ? "#2a2a2a" : "#fefeff",
    surface: isDark ? "#1a1a1a" : "#ffffff",
    surfaceSecondary: isDark ? "#2a2a2a" : "#f8f9fa",

    // Text colors (black/white swap)
    text: isDark ? "#ffffff" : "#2c2c2c",
    textSecondary: isDark ? "#e5e5e5" : "#666666",
    textTertiary: isDark ? "#cccccc" : "#81919a",
    textMuted: isDark ? "#999999" : "#666666",
    textDisabled: isDark ? "#666666" : "#999999",

    // Border colors (adjusted for dark mode)
    border: isDark ? "#333333" : "#e2e8f0",
    borderLight: isDark ? "#444444" : "#edf1f3",
    borderSecondary: isDark ? "#555555" : "#f0f0f0",

    // Icon colors (black/white swap)
    icon: isDark ? "#ffffff" : "#2c2c2c",
    iconSecondary: isDark ? "#cccccc" : "#666666",
    iconMuted: isDark ? "#999999" : "#81919a",

    // Card and component colors
    card: isDark ? "#1a1a1a" : "#ffffff",
    cardSecondary: isDark ? "#2a2a2a" : "#fefeff",

    // Input colors
    input: isDark ? "#2a2a2a" : "#ffffff",
    inputBorder: isDark ? "#444444" : "#edf1f3",
    inputBorderFocused: "#746cd4",
    inputPlaceholder: isDark ? "#999999" : "#81919a",

    // Shadow colors
    shadow: isDark ? "#000000" : "#000000",
    shadowLight: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)",

    // Status bar
    statusBar: isDark ? "light-content" : "dark-content",

    // Tab bar colors
    tabBarBackground: isDark ? "#1a1a1a" : "#ffffff",
    tabBarBorder: isDark ? "#333333" : "#e2e8f0",

    // Navigation colors
    headerBackground: isDark ? "#1a1a1a" : "#fefeff",

    isDark,
  };
};
