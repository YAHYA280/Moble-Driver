import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import React from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";

interface UploadProgressProps {
  progress: number;
  fileName?: string;
  isUploading: boolean;
  style?: ViewStyle;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  fileName,
  isUploading,
  style,
}) => {
  const colors = useThemeColors();
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
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
      marginBottom: 8,
    },
    progressText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    progressPercentage: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    fileName: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    statusText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: "center",
    },
  });

  return (
    <ConditionalComponent isValid={isUploading}>
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.progressText}>Upload en cours...</Text>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>

        <ConditionalComponent isValid={!!fileName}>
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName}
          </Text>
        </ConditionalComponent>

        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        </View>

        <Text style={styles.statusText}>
          {progress < 100
            ? "Téléchargement en cours..."
            : "Traitement final..."}
        </Text>
      </View>
    </ConditionalComponent>
  );
};
