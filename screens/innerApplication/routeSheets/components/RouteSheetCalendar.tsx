// screens/innerApplication/routeSheets/components/RouteSheetCalendar.tsx

import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { RouteSheet } from "../../../../shared/types/routeSheet";

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isCompleted: boolean;
  hasData: boolean;
  isToday: boolean;
}

interface RouteSheetCalendarProps {
  routeSheet: RouteSheet;
  onDayPress: (date: string) => void;
  readonly?: boolean;
}

export const RouteSheetCalendar: React.FC<RouteSheetCalendarProps> = ({
  routeSheet,
  onDayPress,
  readonly = false,
}) => {
  const colors = useThemeColors();

  // Get calendar layout for the month
  const getCalendarDays = (): CalendarDay[] => {
    const [year, month] = routeSheet.month.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const startDate = new Date(firstDay);

    // Adjust to start on Monday (1) instead of Sunday (0)
    const dayOfWeek = (firstDay.getDay() + 6) % 7;
    startDate.setDate(firstDay.getDate() - dayOfWeek);

    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);

    // Generate 6 weeks (42 days) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const dateString = currentDate.toISOString().split("T")[0];
      const isCurrentMonth = currentDate.getMonth() === month - 1;
      const dayData = routeSheet.days.find((d) => d.date === dateString);

      days.push({
        date: dateString,
        day: currentDate.getDate(),
        isCurrentMonth,
        isCompleted: dayData?.isCompleted || false,
        hasData: dayData
          ? dayData.timeSlots.some((slot) => slot.isActive)
          : false,
        isToday: dateString === new Date().toISOString().split("T")[0],
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const calendarDays = getCalendarDays();

  const getDayButtonStyle = (day: CalendarDay) => {
    const baseStyle: any[] = [styles.dayButton];

    if (!day.isCurrentMonth) {
      baseStyle.push(styles.dayButtonOtherMonth);
    } else {
      baseStyle.push(styles.dayButtonCurrentMonth);
    }

    if (day.isToday) {
      baseStyle.push(styles.dayButtonToday);
    } else if (day.isCompleted) {
      baseStyle.push(styles.dayButtonCompleted);
    } else if (day.hasData) {
      baseStyle.push(styles.dayButtonHasData);
    }

    return baseStyle;
  };

  const getDayTextStyle = (day: CalendarDay) => {
    const baseStyle: any[] = [styles.dayText];

    if (!day.isCurrentMonth) {
      baseStyle.push(styles.dayTextOtherMonth);
    } else {
      baseStyle.push(styles.dayTextCurrentMonth);
    }

    if (day.isToday) {
      baseStyle.push(styles.dayTextToday);
    } else if (day.isCompleted) {
      baseStyle.push(styles.dayTextCompleted);
    } else if (day.hasData) {
      baseStyle.push(styles.dayTextHasData);
    }

    return baseStyle;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    weekHeader: {
      flexDirection: "row",
      marginBottom: 8,
    },
    weekDayHeader: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
    },
    weekDayText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dayContainer: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
    },
    dayButton: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    dayButtonCurrentMonth: {
      backgroundColor: "transparent",
    },
    dayButtonOtherMonth: {
      backgroundColor: "transparent",
      opacity: 0.3,
    },
    dayButtonCompleted: {
      backgroundColor: colors.success + "20",
      borderWidth: 2,
      borderColor: colors.success,
    },
    dayButtonHasData: {
      backgroundColor: colors.warning + "20",
      borderWidth: 2,
      borderColor: colors.warning,
    },
    dayButtonToday: {
      backgroundColor: colors.primary + "20",
      borderWidth: 2,
      borderColor: colors.primary,
    },
    dayText: {
      fontSize: 14,
      fontWeight: "500",
    },
    dayTextCurrentMonth: {
      color: colors.text,
    },
    dayTextOtherMonth: {
      color: colors.textTertiary,
    },
    dayTextCompleted: {
      color: colors.success,
      fontWeight: "600",
    },
    dayTextHasData: {
      color: colors.warning,
      fontWeight: "600",
    },
    dayTextToday: {
      color: colors.primary,
      fontWeight: "700",
    },
    completedIndicator: {
      position: "absolute",
      top: 2,
      right: 2,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.success,
    },
    hasDataIndicator: {
      position: "absolute",
      top: 2,
      right: 2,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.warning,
    },
    legend: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border + "30",
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      {/* Week days header */}
      <View style={styles.weekHeader}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDayHeader}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <TouchableOpacity
              style={getDayButtonStyle(day)}
              onPress={() => day.isCurrentMonth && onDayPress(day.date)}
              disabled={readonly || !day.isCurrentMonth}
              activeOpacity={0.7}
            >
              <Text style={getDayTextStyle(day)}>{day.day}</Text>

              <ConditionalComponent isValid={day.isCompleted}>
                <View style={styles.completedIndicator} />
              </ConditionalComponent>

              <ConditionalComponent isValid={day.hasData && !day.isCompleted}>
                <View style={styles.hasDataIndicator} />
              </ConditionalComponent>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: colors.success }]}
          />
          <Text style={styles.legendText}>Saisi</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: colors.warning }]}
          />
          <Text style={styles.legendText}>En cours</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: colors.primary }]}
          />
          <Text style={styles.legendText}>Aujourd'hui</Text>
        </View>
      </View>
    </View>
  );
};
