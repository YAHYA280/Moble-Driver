// screens/innerApplication/calendar/components/AppointmentCard.tsx
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
import { AppointmentTypeDot } from "../../../../shared/components/ui/AppointmentTypeDot";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_COLORS,
  APPOINTMENT_TYPE_LABELS,
  Appointment,
} from "../../../../shared/types/calendar";

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
  style?: ViewStyle;
  showDate?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
  style,
  showDate = false,
}) => {
  const colors = useThemeColors();

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    return `${day}/${month}`;
  };

  const getStatusColor = () => {
    switch (appointment.status) {
      case "confirme":
        return colors.success;
      case "prevu":
        return colors.warning;
      case "annule":
        return colors.error;
      case "reporte":
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const typeColor = APPOINTMENT_TYPE_COLORS[appointment.type];

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderLeftWidth: 4,
      borderLeftColor: typeColor,
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
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: typeColor + "20",
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
    appointmentTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    typeLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: typeColor,
      backgroundColor: typeColor + "15",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginRight: 12,
    },
    dateText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginRight: 12,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    locationIcon: {
      marginRight: 6,
    },
    locationText: {
      fontSize: 13,
      color: colors.textTertiary,
      flex: 1,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
    },
    rightSection: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },
    chevronButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    confirmedBadge: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.success,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <AppointmentTypeDot type={appointment.type} size="large" />
        <ConditionalComponent isValid={appointment.isConfirmed}>
          <View style={styles.confirmedBadge}>
            <FontAwesome name="check" size={8} color="white" />
          </View>
        </ConditionalComponent>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.appointmentTitle} numberOfLines={1}>
            {appointment.title}
          </Text>
          <Text style={styles.typeLabel}>
            {APPOINTMENT_TYPE_LABELS[appointment.type]}
          </Text>
        </View>

        <View style={styles.timeRow}>
          <ConditionalComponent isValid={showDate}>
            <Text style={styles.dateText}>{formatDate(appointment.date)}</Text>
          </ConditionalComponent>
          <Text style={styles.timeText}>
            {formatTime(appointment.startTime)} -{" "}
            {formatTime(appointment.endTime)}
          </Text>
        </View>

        <View style={styles.locationRow}>
          <FontAwesome
            name="map-marker"
            size={12}
            color={colors.textTertiary}
            style={styles.locationIcon}
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {appointment.location}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
            />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {APPOINTMENT_STATUS_LABELS[appointment.status]}
            </Text>
          </View>
        </View>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.chevronButton}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="chevron-right"
            size={12}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export { AppointmentCard };
