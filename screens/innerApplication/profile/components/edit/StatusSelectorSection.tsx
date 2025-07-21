import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";

interface StatusSelectorSectionProps {
  status: string;
  onPress: () => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {},
    statusLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    statusButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.inputBorder,
      backgroundColor: colors.input,
      minHeight: 56,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.2 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 4px rgba(0, 0, 0, 0.2)"
            : "0 2px 4px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    statusContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    statusIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    statusTextContainer: {
      flex: 1,
    },
    statusText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
    },
    statusDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    chevronContainer: {
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
    },
  });

const getStatusColor = (status: string) => {
  switch (status) {
    case "Actif":
      return "#4CAF50";
    case "En congé":
      return "#FF9800";
    case "Inactif":
      return "#F44336";
    default:
      return "#666";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Actif":
      return "checkmark-circle";
    case "En congé":
      return "time";
    case "Inactif":
      return "close-circle";
    default:
      return "radio-button-off";
  }
};

const getStatusDescription = (status: string) => {
  switch (status) {
    case "Actif":
      return "Disponible pour les trajets";
    case "En congé":
      return "Temporairement indisponible";
    case "Inactif":
      return "Non disponible";
    default:
      return "";
  }
};

export const StatusSelectorSection: React.FC<StatusSelectorSectionProps> = ({
  status,
  onPress,
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.statusLabel}>Statut de disponibilité</Text>
      <TouchableOpacity
        style={styles.statusButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.statusContent}>
          <View
            style={[
              styles.statusIconContainer,
              {
                backgroundColor: getStatusColor(status) + "20",
              },
            ]}
          >
            <Ionicons
              name={getStatusIcon(status) as any}
              size={18}
              color={getStatusColor(status)}
            />
          </View>

          <View style={styles.statusTextContainer}>
            <Text style={styles.statusText}>{status}</Text>
            <Text style={styles.statusDescription}>
              {getStatusDescription(status)}
            </Text>
          </View>
        </View>

        <View style={styles.chevronContainer}>
          <FontAwesome
            name="chevron-down"
            size={12}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
