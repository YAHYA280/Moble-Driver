// screens/innerApplication/calendar/components/CalendarMonthView.tsx
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Appointment } from "../../../../shared/types/calendar";
import { WEEK_DAYS_DISPLAY } from "../constants/calendarConstants";
import { CalendarDay } from "./CalendarDay";

interface CalendarMonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  selectedDate: string | null;
  onDayPress: (date: string) => void;
  style?: ViewStyle;
}

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  currentDate,
  appointments,
  selectedDate,
  onDayPress,
  style,
}) => {
  const colors = useThemeColors();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of the month and calculate the starting day
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  const daysInMonth = lastDayOfMonth.getDate();

  // Get days from previous month to fill the first week
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  // Generate calendar grid
  const calendarDays: {
    day: number | null;
    date: string;
    isCurrentMonth: boolean;
  }[] = [];

  // Previous month days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day).toISOString().split("T")[0];
    calendarDays.push({ day, date, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day).toISOString().split("T")[0];
    calendarDays.push({ day, date, isCurrentMonth: true });
  }

  // Next month days to complete the grid (6 weeks = 42 days)
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day).toISOString().split("T")[0];
    calendarDays.push({ day, date, isCurrentMonth: false });
  }

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingBottom: 8,
    },
    weekDaysContainer: {
      flexDirection: "row",
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    weekDayText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      textAlign: "center",
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    weekRow: {
      flexDirection: "row",
      width: "100%",
    },
  });

  // Split calendar days into weeks
  const weeks: (typeof calendarDays)[] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <View style={[styles.container, style]}>
      {/* Week days header */}
      <View style={styles.weekDaysContainer}>
        {WEEK_DAYS_DISPLAY.map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((dayData, dayIndex) => (
              <CalendarDay
                key={`${weekIndex}-${dayIndex}`}
                day={dayData.day}
                date={dayData.date}
                appointments={appointmentsByDate[dayData.date] || []}
                isToday={dayData.date === todayStr}
                isSelected={dayData.date === selectedDate}
                isCurrentMonth={dayData.isCurrentMonth}
                onPress={onDayPress}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export { CalendarMonthView };
