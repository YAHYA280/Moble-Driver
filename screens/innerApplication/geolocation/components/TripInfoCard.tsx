// screens/innerApplication/geolocation/components/TripInfoCard.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Trip } from "../../../../shared/types/geolocation";

interface TripInfoCardProps {
  trip: Trip;
  isMinimized?: boolean;
  onDetailsPress?: () => void;
  onNavigatePress?: () => void;
  onMinimizeToggle?: () => void;
}

export const TripInfoCard: React.FC<TripInfoCardProps> = ({
  trip,
  isMinimized = false,
  onDetailsPress,
  onNavigatePress,
  onMinimizeToggle,
}) => {
  const colors = useThemeColors();
  const slideAnim = useRef(new Animated.Value(isMinimized ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isMinimized ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [isMinimized, slideAnim]);

  const getStatusColor = () => {
    switch (trip.status) {
      case "En cours":
        return colors.success;
      case "A venir":
        return colors.info;
      case "Termine":
        return colors.textSecondary;
      case "Annule":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (trip.status) {
      case "En cours":
        return "play-circle";
      case "A venir":
        return "time";
      case "Termine":
        return "checkmark-circle";
      case "Annule":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const nextPoint = trip.points.find(
    (p) => p.type === (trip.status === "En cours" ? "destination" : "pickup")
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 8,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    minimizedContainer: {
      borderRadius: 12,
    },
    content: {
      padding: 16,
    },
    minimizedContent: {
      paddingVertical: 12,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    minimizedHeader: {
      marginBottom: 0,
    },
    titleContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    minimizedTitle: {
      fontSize: 14,
      marginBottom: 0,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: getStatusColor() + "15",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    minimizedStatusContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: getStatusColor(),
      marginLeft: 4,
    },
    minimizedStatusText: {
      fontSize: 10,
    },
    minimizeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    detailsSection: {
      overflow: "hidden",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    infoIcon: {
      marginRight: 8,
      width: 20,
      textAlign: "center",
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
    },
    actionsRow: {
      flexDirection: "row",
      marginTop: 12,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
    },
    primaryActionButton: {
      backgroundColor: colors.primary,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 6,
    },
    primaryActionButtonText: {
      color: "white",
    },
  });

  const animatedHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 60], // Adjust these values based on your content
  });

  return (
    <Animated.View
      style={[
        styles.container,
        isMinimized && styles.minimizedContainer,
        { height: animatedHeight },
      ]}
    >
      <View style={[styles.content, isMinimized && styles.minimizedContent]}>
        {/* Header */}
        <View style={[styles.header, isMinimized && styles.minimizedHeader]}>
          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, isMinimized && styles.minimizedTitle]}
              numberOfLines={1}
            >
              {trip.title}
            </Text>
            <ConditionalComponent
              isValid={!isMinimized && !!trip.customerInfo?.name}
            >
              <Text style={styles.subtitle} numberOfLines={1}>
                {trip.customerInfo?.name}
              </Text>
            </ConditionalComponent>
          </View>

          <View style={styles.rightContainer}>
            <View
              style={[
                styles.statusContainer,
                isMinimized && styles.minimizedStatusContainer,
              ]}
            >
              <Ionicons
                name={getStatusIcon() as any}
                size={isMinimized ? 12 : 14}
                color={getStatusColor()}
              />
              <Text
                style={[
                  styles.statusText,
                  isMinimized && styles.minimizedStatusText,
                ]}
              >
                {trip.status}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.minimizeButton}
              onPress={onMinimizeToggle}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isMinimized ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Details Section - Hidden when minimized */}
        <ConditionalComponent isValid={!isMinimized}>
          <Animated.View
            style={[
              styles.detailsSection,
              {
                opacity: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              },
            ]}
          >
            {/* Trip Info */}
            <View style={styles.infoRow}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.textSecondary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Début: {trip.startTime} • Durée: {trip.estimatedDuration}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="speedometer-outline"
                size={16}
                color={colors.textSecondary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Distance: {trip.distance} km</Text>
            </View>

            <ConditionalComponent isValid={!!nextPoint}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.textSecondary}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoText} numberOfLines={1}>
                  {nextPoint?.type === "pickup" ? "Ramassage" : "Destination"}:{" "}
                  {nextPoint?.address}
                </Text>
              </View>
            </ConditionalComponent>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onDetailsPress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.actionButtonText}>Détails</Text>
              </TouchableOpacity>

              <ConditionalComponent
                isValid={
                  trip.status === "En cours" || trip.status === "A venir"
                }
              >
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryActionButton]}
                  onPress={onNavigatePress}
                  activeOpacity={0.7}
                >
                  <Ionicons name="navigate" size={16} color="white" />
                  <Text
                    style={[
                      styles.actionButtonText,
                      styles.primaryActionButtonText,
                    ]}
                  >
                    Navigation
                  </Text>
                </TouchableOpacity>
              </ConditionalComponent>
            </View>
          </Animated.View>
        </ConditionalComponent>
      </View>
    </Animated.View>
  );
};
