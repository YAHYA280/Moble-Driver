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
import { TimeSlot, TimeSlotData } from "../../../../shared/types/routeSheet";

interface TimeSlotCardProps {
  timeSlot: TimeSlotData;
  startTime: string;
  endTime: string;
  onToggleActive: () => void;
  onStartTimePress: () => void;
  onEndTimePress: () => void;
  style?: ViewStyle;
}

export const TimeSlotCard: React.FC<TimeSlotCardProps> = ({
  timeSlot,
  startTime,
  endTime,
  onToggleActive,
  onStartTimePress,
  onEndTimePress,
  style,
}) => {
  const colors = useThemeColors();

  const getTimeSlotColor = (slot: TimeSlot) => {
    switch (slot) {
      case "Matin":
        return "#22c55e";
      case "Midi":
        return "#f59e0b";
      case "Après-midi":
        return "#3b82f6";
      case "Soir":
        return "#8b5cf6";
      default:
        return colors.primary;
    }
  };

  const slotColor = getTimeSlotColor(timeSlot.timeSlot);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 16,
      overflow: "hidden",
      borderWidth: timeSlot.isActive ? 2 : 1,
      borderColor: timeSlot.isActive ? slotColor : colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: timeSlot.isActive
        ? slotColor + "10"
        : colors.backgroundTertiary,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeSlotName: {
      fontSize: 16,
      fontWeight: "600",
      color: timeSlot.isActive ? slotColor : colors.text,
      marginLeft: 8,
    },
    toggleButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: timeSlot.isActive ? slotColor : colors.border,
      backgroundColor: timeSlot.isActive ? slotColor : "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      padding: 16,
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    timeContainer: {
      flex: 1,
      marginHorizontal: 4,
    },
    timeLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      fontWeight: "500",
    },
    timeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.backgroundSecondary,
    },
    timeText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    disabledContent: {
      opacity: 0.5,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleActive}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <FontAwesome
            name="clock-o"
            size={16}
            color={timeSlot.isActive ? slotColor : colors.textSecondary}
          />
          <Text style={styles.timeSlotName}>{timeSlot.timeSlot}</Text>
        </View>
        <TouchableOpacity style={styles.toggleButton} onPress={onToggleActive}>
          <ConditionalComponent isValid={timeSlot.isActive}>
            <FontAwesome name="check" size={12} color="white" />
          </ConditionalComponent>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Content */}
      <ConditionalComponent isValid={timeSlot.isActive}>
        <View
          style={[styles.content, !timeSlot.isActive && styles.disabledContent]}
        >
          <View style={styles.timeRow}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>Départ - {timeSlot.timeSlot}</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={onStartTimePress}
              >
                <Text style={styles.timeText}>{startTime}</Text>
                <FontAwesome
                  name="clock-o"
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>Fin - {timeSlot.timeSlot}</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={onEndTimePress}
              >
                <Text style={styles.timeText}>{endTime}</Text>
                <FontAwesome
                  name="clock-o"
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ConditionalComponent>
    </View>
  );
};
