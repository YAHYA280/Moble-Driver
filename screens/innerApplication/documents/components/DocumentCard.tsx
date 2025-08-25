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
  DOCUMENT_TYPES,
  DocumentFile,
} from "../../../../shared/types/document";

interface DocumentCardProps {
  document: DocumentFile;
  onPress: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onLongPress,
  style,
}) => {
  const colors = useThemeColors();
  const documentTypeConfig = DOCUMENT_TYPES[document.type];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

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
      backgroundColor: documentTypeConfig.color + "15",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    favoriteIcon: {
      marginLeft: 8,
    },
    metadataRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    type: {
      fontSize: 13,
      color: documentTypeConfig.color,
      fontWeight: "500",
      marginRight: 12,
    },
    size: {
      fontSize: 13,
      color: colors.textTertiary,
      fontWeight: "400",
      marginRight: 12,
    },
    date: {
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
    },
    statusText: {
      fontSize: 10,
      fontWeight: "600",
      textTransform: "uppercase",
    },
    chevronContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
  });

  const getStatusConfig = () => {
    switch (document.status) {
      case "active":
        return {
          backgroundColor: colors.success + "15",
          textColor: colors.success,
          label: "Actif",
        };
      case "expired":
        return {
          backgroundColor: colors.error + "15",
          textColor: colors.error,
          label: "Expiré",
        };
      case "pending":
        return {
          backgroundColor: colors.warning + "15",
          textColor: colors.warning,
          label: "En attente",
        };
      default:
        return {
          backgroundColor: colors.textTertiary + "15",
          textColor: colors.textTertiary,
          label: "Inconnu",
        };
    }
  };

  const statusConfig = getStatusConfig();

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
          name={documentTypeConfig.icon as any}
          size={20}
          color={documentTypeConfig.color}
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {document.name}
          </Text>
          {document.isFavorite && (
            <FontAwesome
              name="star"
              size={14}
              color={colors.warning}
              style={styles.favoriteIcon}
            />
          )}
        </View>

        <View style={styles.metadataRow}>
          <Text style={styles.type}>{documentTypeConfig.label}</Text>
          <Text style={styles.size}>{formatFileSize(document.size)}</Text>
          <Text style={styles.date}>{formatDate(document.uploadDate)}</Text>
        </View>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.backgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
            {statusConfig.label}
          </Text>
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
