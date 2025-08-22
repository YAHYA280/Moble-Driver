// screens/innerApplication/documents/components/DocumentCard.tsx

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

// screens/innerApplication/documents/components/FolderCard.tsx

interface FolderCardProps {
  folder: any;
  onPress: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onPress,
  onLongPress,
  style,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      width: "48%",
      aspectRatio: 1.2,
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
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
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      backgroundColor: (folder.color || colors.primary) + "15",
    },
    name: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 4,
    },
    count: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FontAwesome
          name={(folder.icon as any) || "folder"}
          size={24}
          color={folder.color || colors.primary}
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {folder.name}
      </Text>
      <Text style={styles.count}>
        {folder.documentsCount} document{folder.documentsCount !== 1 ? "s" : ""}
      </Text>
    </TouchableOpacity>
  );
};

// screens/innerApplication/documents/components/StorageIndicator.tsx

interface StorageIndicatorProps {
  storageInfo: any;
}

export const StorageIndicator: React.FC<StorageIndicatorProps> = ({
  storageInfo,
}) => {
  const colors = useThemeColors();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getProgressColor = () => {
    if (storageInfo.usedPercentage >= 90) return colors.error;
    if (storageInfo.usedPercentage >= 70) return colors.warning;
    return colors.primary;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    percentage: {
      fontSize: 16,
      fontWeight: "700",
      color: getProgressColor(),
    },
    progressContainer: {
      height: 8,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: 8,
    },
    progressBar: {
      height: "100%",
      backgroundColor: getProgressColor(),
      borderRadius: 4,
    },
    details: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    usage: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    total: {
      fontSize: 14,
      color: colors.textTertiary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stockage utilisé</Text>
        <Text style={styles.percentage}>{storageInfo.usedPercentage}%</Text>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${Math.min(storageInfo.usedPercentage, 100)}%` },
          ]}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.usage}>
          {formatFileSize(storageInfo.usedSpace)} utilisés
        </Text>
        <Text style={styles.total}>
          sur {formatFileSize(storageInfo.totalSpace)}
        </Text>
      </View>
    </View>
  );
};

// screens/innerApplication/documents/components/DocumentsHeader.tsx

interface DocumentsHeaderProps {
  foldersCount: number;
  documentsCount: number;
  onAddFolder: () => void;
  onUploadDocument: () => void;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  foldersCount,
  documentsCount,
  onAddFolder,
  onUploadDocument,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    countsContainer: {
      flex: 1,
    },
    count: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    actionsContainer: {
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.primary + "15",
    },
    actionText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 6,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.countsContainer}>
          <Text style={styles.count}>
            {foldersCount} dossier{foldersCount !== 1 ? "s" : ""}
          </Text>
          <Text style={styles.count}>
            {documentsCount} document{documentsCount !== 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onAddFolder}>
            <FontAwesome name="folder-o" size={14} color={colors.primary} />
            <Text style={styles.actionText}>Dossier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onUploadDocument}
          >
            <FontAwesome name="plus" size={14} color={colors.primary} />
            <Text style={styles.actionText}>Document</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
