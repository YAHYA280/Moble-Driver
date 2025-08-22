// screens/innerApplication/documents/components/StorageIndicator.tsx

import { FontAwesome } from "@expo/vector-icons";
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
    if (storageInfo.usedPercentage >= 90) return "#ffffff";
    if (storageInfo.usedPercentage >= 70) return "#ffffff";
    return "#ffffff";
  };

  const getProgressBarBackground = () => {
    if (storageInfo.usedPercentage >= 90) return "rgba(239, 68, 68, 0.3)";
    if (storageInfo.usedPercentage >= 70) return "rgba(245, 158, 11, 0.3)";
    return "rgba(255, 255, 255, 0.3)";
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 4,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: `0 4px 20px ${colors.primary}40`,
        },
      }),
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    storageSize: {
      fontSize: 24,
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: 0.5,
    },
    cloudIcon: {
      padding: 8,
    },
    progressContainer: {
      height: 6,
      backgroundColor: getProgressBarBackground(),
      borderRadius: 3,
      overflow: "hidden",
      marginBottom: 12,
    },
    progressBar: {
      height: "100%",
      backgroundColor: getProgressColor(),
      borderRadius: 3,
    },
    bottomRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    usageText: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.9)",
      fontWeight: "500",
      flex: 1,
    },
    percentageContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    percentageText: {
      fontSize: 12,
      color: "#ffffff",
      fontWeight: "600",
      marginLeft: 4,
    },
    warningContainer: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    warningText: {
      fontSize: 12,
      color: "#ffffff",
      marginLeft: 8,
      flex: 1,
    },
  });

  const renderWarningMessage = () => {
    if (storageInfo.usedPercentage >= 90) {
      return (
        <View style={styles.warningContainer}>
          <FontAwesome name="exclamation-triangle" size={14} color="#ffffff" />
          <Text style={styles.warningText}>
            Stockage presque plein ! Libérez de l'espace.
          </Text>
        </View>
      );
    }
    if (storageInfo.usedPercentage >= 70) {
      return (
        <View style={styles.warningContainer}>
          <FontAwesome name="info-circle" size={14} color="#ffffff" />
          <Text style={styles.warningText}>
            Stockage à {storageInfo.usedPercentage}% - Pensez à libérer de
            l'espace.
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Top Row - Size and Cloud Icon */}
      <View style={styles.topRow}>
        <Text style={styles.storageSize}>
          {formatFileSize(storageInfo.usedSpace)} /{" "}
          {formatFileSize(storageInfo.totalSpace)}
        </Text>
        <View style={styles.cloudIcon}>
          <FontAwesome name="cloud" size={20} color="#ffffff" />
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${Math.min(storageInfo.usedPercentage, 100)}%` },
          ]}
        />
      </View>

      {/* Bottom Row - Usage and Percentage */}
      <View style={styles.bottomRow}>
        <Text style={styles.usageText}>
          Stockage utilisé à {storageInfo.usedPercentage}%
        </Text>
        <View style={styles.percentageContainer}>
          <FontAwesome
            name={storageInfo.usedPercentage >= 90 ? "warning" : "check-circle"}
            size={10}
            color="#ffffff"
          />
          <Text style={styles.percentageText}>
            {100 - storageInfo.usedPercentage}% libre
          </Text>
        </View>
      </View>

      {/* Warning Message */}
      {renderWarningMessage()}
    </View>
  );
};
