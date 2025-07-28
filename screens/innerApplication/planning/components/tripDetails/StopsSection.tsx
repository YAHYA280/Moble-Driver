// screens/innerApplication/planning/components/tripDetails/StopsSection.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";

interface StopsSectionProps {
  onMapPress: () => void;
}

const styles = StyleSheet.create({
  arretsSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  arretsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  arretsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  showRoadButton: {
    backgroundColor: "#746cd4",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  showRoadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  routeIcon: {
    marginRight: 8,
  },
});

export const StopsSection: React.FC<StopsSectionProps> = ({ onMapPress }) => {
  const { colors } = useTheme();

  const dynamicStyles = {
    arretsSection: {
      ...styles.arretsSection,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: { elevation: 3 },
      }),
    },
    arretsTitle: {
      ...styles.arretsTitle,
      color: colors.text,
    },
  };

  return (
    <View style={dynamicStyles.arretsSection}>
      <View style={styles.arretsHeader}>
        <FontAwesome
          name="map"
          size={18}
          color="#746cd4"
          style={styles.routeIcon}
        />
        <Text style={dynamicStyles.arretsTitle}>Arrêts</Text>
      </View>

      <TouchableOpacity
        style={styles.showRoadButton}
        onPress={onMapPress}
        activeOpacity={0.8}
      >
        <Text style={styles.showRoadButtonText}>
          Voir l&apos;itinéraire sur la carte
        </Text>
      </TouchableOpacity>
    </View>
  );
};
