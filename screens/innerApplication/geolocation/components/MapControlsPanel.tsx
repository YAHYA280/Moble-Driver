import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useThemeColors } from "@/hooks/useTheme";

import type { MapSettings } from "@/shared/types/geolocation";

interface MapControlsPanelProps {
  settings: MapSettings;
  onSettingsChange: (settings: Partial<MapSettings>) => void;
  onClose: () => void;
}

export const MapControlsPanel: React.FC<MapControlsPanelProps> = ({
  settings,
  onSettingsChange,
  onClose,
}) => {
  const colors = useThemeColors();

  const mapTypes = [
    { key: "roadmap", label: "Route", icon: "map" },
    { key: "satellite", label: "Satellite", icon: "globe" },
    { key: "hybrid", label: "Hybride", icon: "layers" },
    { key: "terrain", label: "Relief", icon: "triangle" },
  ] as const;

  const ToggleSwitch: React.FC<{
    value: boolean;
    onValueChange: (value: boolean) => void;
  }> = ({ value, onValueChange }) => (
    <TouchableOpacity
      style={[styles.toggleButton, value && styles.activeToggleButton]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View
        style={[styles.toggleIndicator, value && styles.activeToggleIndicator]}
      />
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 8px rgba(0, 0, 0, 0.3)"
            : "0 4px 8px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    section: {
      marginBottom: 16,
    },
    lastSection: {
      marginBottom: 0,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    mapTypeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 8,
    },
    mapTypeButton: {
      flex: 1,
      minWidth: "45%",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: "transparent",
    },
    activeMapTypeButton: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary + "30",
    },
    mapTypeIcon: {
      marginRight: 8,
    },
    mapTypeText: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
      flex: 1,
    },
    activeMapTypeText: {
      color: colors.primary,
      fontWeight: "600",
    },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    lastToggleRow: {
      borderBottomWidth: 0,
      paddingBottom: 0,
    },
    toggleLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      flex: 1,
    },
    toggleButton: {
      width: 50,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.backgroundSecondary,
      justifyContent: "center",
      paddingHorizontal: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeToggleButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    toggleIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
        },
      }),
    },
    activeToggleIndicator: {
      alignSelf: "flex-end",
      backgroundColor: "white",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Options de la carte</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type de carte</Text>
        <View style={styles.mapTypeGrid}>
          {mapTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.mapTypeButton,
                settings.mapType === type.key && styles.activeMapTypeButton,
              ]}
              onPress={() => onSettingsChange({ mapType: type.key })}
              activeOpacity={0.7}
            >
              <Ionicons
                name={type.icon as any}
                size={16}
                color={
                  settings.mapType === type.key
                    ? colors.primary
                    : colors.textSecondary
                }
                style={styles.mapTypeIcon}
              />
              <Text
                style={[
                  styles.mapTypeText,
                  settings.mapType === type.key && styles.activeMapTypeText,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Affichage</Text>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Mode nuit</Text>
          <ToggleSwitch
            value={settings.nightMode}
            onValueChange={(value) => onSettingsChange({ nightMode: value })}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Trafic en temps réel</Text>
          <ToggleSwitch
            value={settings.showTraffic}
            onValueChange={(value) => onSettingsChange({ showTraffic: value })}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Points d'intérêt</Text>
          <ToggleSwitch
            value={settings.showPOI}
            onValueChange={(value) => onSettingsChange({ showPOI: value })}
          />
        </View>

        <View style={[styles.toggleRow, styles.lastToggleRow]}>
          <Text style={styles.toggleLabel}>Suivi automatique</Text>
          <ToggleSwitch
            value={settings.autoFollow}
            onValueChange={(value) => onSettingsChange({ autoFollow: value })}
          />
        </View>
      </View>
    </View>
  );
};
