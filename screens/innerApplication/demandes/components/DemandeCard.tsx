import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import {
  DEMANDE_STATUS,
  DEMANDE_TYPES,
  Demande,
} from "../../../../shared/types/demande";

interface DemandeCardProps {
  demande: Demande;
  onPress: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
}

export const DemandeCard: React.FC<DemandeCardProps> = ({
  demande,
  onPress,
  onLongPress,
  style,
}) => {
  const colors = useThemeColors();
  const typeConfig = DEMANDE_TYPES[demande.type];
  const statusConfig = DEMANDE_STATUS[demande.status];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: typeConfig.color + "15",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 6,
    },
    dates: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "center",
      marginLeft: 12,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: statusConfig.color + "15",
      marginBottom: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      color: statusConfig.color,
    },
    chevronContainer: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome
          name={typeConfig.icon as any}
          size={20}
          color={typeConfig.color}
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {demande.title}
        </Text>
        <Text style={styles.dates}>
          {formatDate(demande.startDate)} - {formatDate(demande.endDate)}
        </Text>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{statusConfig.label}</Text>
        </View>

        <View style={styles.chevronContainer}>
          <FontAwesome
            name="chevron-right"
            size={12}
            color={colors.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
