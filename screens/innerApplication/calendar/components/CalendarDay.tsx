// screens/innerApplication/calendar/components/CalendarDay.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
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
import { Appointment } from "../../../../shared/types/calendar";

interface CalendarDayProps {
  day: number | null;
  date?: string;
  appointments: Appointment[];
  isToday?: boolean;
  isSelected?: boolean;
  isCurrentMonth?: boolean;
  onPress: (date: string) => void;
  style?: ViewStyle;
}

const getUniqueAppointmentTypes = (appointments: Appointment[]) => {
  return [...new Set(appointments.map((a) => a.type))].slice(0, 3);
};

const getShadowStyle = (isSelected: boolean, colors: any) => {
  if (!isSelected) return {};

  if (Platform.OS === "ios") {
    return {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    };
  }

  if (Platform.OS === "android") {
    return {
      elevation: 3,
    };
  }

  if (Platform.OS === "web") {
    return {
      boxShadow: `0 2px 4px ${colors.primary}40`,
    };
  }

  return {};
};

const createStyles = (
  colors: any,
  isSelected: boolean,
  isToday: boolean,
  day: number | null,
  isCurrentMonth: boolean
) =>
  StyleSheet.create({
    dayContainer: {
      flex: 1,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 1,
      borderRadius: 8,
      backgroundColor: isSelected
        ? colors.primary
        : isToday
        ? colors.primary + "20"
        : "transparent",
      ...getShadowStyle(isSelected, colors),
    },
    dayText: {
      fontSize: 16,
      fontWeight: isToday ? "700" : "500",
      color: !day
        ? "transparent"
        : isSelected
        ? "#fff"
        : !isCurrentMonth
        ? colors.textTertiary
        : isToday
        ? colors.primary
        : colors.text,
      textAlign: "center",
    },
    appointmentDotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 2,
      minHeight: 8,
    },
    dotSpacing: {
      marginHorizontal: 1,
    },
  });

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  date,
  appointments,
  isToday = false,
  isSelected = false,
  isCurrentMonth = true,
  onPress,
  style,
}) => {
  const colors = useThemeColors();

  const handlePress = () => {
    if (day && date) {
      onPress(date);
    }
  };

  const appointmentTypes = getUniqueAppointmentTypes(appointments);
  const styles = createStyles(colors, isSelected, isToday, day, isCurrentMonth);

  return (
    <TouchableOpacity
      style={[styles.dayContainer, style]}
      onPress={handlePress}
      disabled={!day}
      activeOpacity={0.7}
    >
      <Text style={styles.dayText}>{day || ""}</Text>
      <ConditionalComponent isValid={appointmentTypes.length > 0}>
        <View style={styles.appointmentDotsContainer}>
          {appointmentTypes.map((type, index) => (
            <AppointmentTypeDot
              key={type}
              type={type}
              size="small"
              style={index > 0 ? styles.dotSpacing : undefined}
            />
          ))}
        </View>
      </ConditionalComponent>
    </TouchableOpacity>
  );
};

export { CalendarDay };
