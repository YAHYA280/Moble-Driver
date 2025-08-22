// screens/innerApplication/documents/components/StorageIndicator.tsx

import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { StorageInfo } from "../../../../shared/types/document";

interface StorageIndicatorProps {
  storageInfo: StorageInfo;
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
