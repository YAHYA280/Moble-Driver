import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useThemeColors } from "@/hooks/useTheme";
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";

import type { Location } from "@/shared/types/geolocation";

interface LocationStatusBarProps {
  isActive: boolean;
  currentLocation: Location | null;
  onToggle: () => void;
}

export const LocationStatusBar: React.FC<LocationStatusBarProps> = ({
  isActive,
  currentLocation,
  onToggle,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 8,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    statusIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: isActive ? colors.success : colors.error,
      marginRight: 12,
    },
    activeIndicator: {
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 4,
    },
    statusText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    locationText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    textContainer: {
      flex: 1,
    },
    toggleButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: isActive ? colors.error + "15" : colors.success + "15",
    },
    toggleButtonText: {
      fontSize: 12,
      fontWeight: "600",
      color: isActive ? colors.error : colors.success,
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={[styles.statusIndicator, isActive && styles.activeIndicator]}
      />

      <View style={styles.textContainer}>
        <Text style={styles.statusText}>
          {isActive ? "Localisation active" : "Localisation inactive"}
        </Text>
        <ConditionalComponent isValid={!!(isActive && currentLocation)}>
          <Text style={styles.locationText} numberOfLines={1}>
            {currentLocation?.address || "Position en cours..."}
          </Text>
        </ConditionalComponent>
      </View>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleButtonText}>
          {isActive ? "Arrêter" : "Démarrer"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
