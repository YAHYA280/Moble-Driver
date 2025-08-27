import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
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

  const calculateDuration = (): number => {
    const startDate = new Date(demande.startDate);
    const endDate = new Date(demande.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    urgentBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      backgroundColor: colors.error + "15",
    },
    urgentText: {
      fontSize: 10,
      fontWeight: "600",
      color: colors.error,
      textTransform: "uppercase",
    },
    metadataRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    type: {
      fontSize: 13,
      color: typeConfig.color,
      fontWeight: "500",
      marginRight: 12,
    },
    dates: {
      fontSize: 13,
      color: colors.textTertiary,
      fontWeight: "400",
      marginRight: 12,
    },
    duration: {
      fontSize: 13,
      color: colors.textTertiary,
      fontWeight: "400",
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "center",
      marginLeft: 12,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginBottom: 4,
      backgroundColor: statusConfig.color + "15",
    },
    statusText: {
      fontSize: 10,
      fontWeight: "600",
      textTransform: "uppercase",
      color: statusConfig.color,
    },
    chevronContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    attachmentIndicator: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },
    attachmentText: {
      fontSize: 11,
      color: colors.textTertiary,
      marginLeft: 4,
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
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {demande.title}
          </Text>
          <ConditionalComponent isValid={!!demande.isUrgent}>
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          </ConditionalComponent>
        </View>

        <View style={styles.metadataRow}>
          <Text style={styles.type}>{typeConfig.label}</Text>
          <Text style={styles.dates}>
            {formatDate(demande.startDate)} - {formatDate(demande.endDate)}
          </Text>
          <Text style={styles.duration}>
            {calculateDuration()} jour{calculateDuration() > 1 ? "s" : ""}
          </Text>
        </View>

        <ConditionalComponent isValid={demande.attachments.length > 0}>
          <View style={styles.attachmentIndicator}>
            <FontAwesome
              name="paperclip"
              size={10}
              color={colors.textTertiary}
            />
            <Text style={styles.attachmentText}>
              {demande.attachments.length} pièce
              {demande.attachments.length > 1 ? "s" : ""} jointe
              {demande.attachments.length > 1 ? "s" : ""}
            </Text>
          </View>
        </ConditionalComponent>
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
