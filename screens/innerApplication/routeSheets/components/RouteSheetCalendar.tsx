// screens/innerApplication/routeSheets/components/RouteSheetCalendar.tsx

import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useThemeColors } from "../../../../hooks/useTheme";
import { RouteSheet } from "../../../../shared/types/routeSheet";

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

  // Prepare marked dates for the calendar
  const getMarkedDates = () => {
    const marked: any = {};
    const today = new Date().toISOString().split("T")[0];

    routeSheet.days.forEach((day) => {
      const hasData = day.timeSlots.some((slot) => slot.isActive);

      if (day.date === today) {
        // Today's date
        marked[day.date] = {
          selected: true,
          selectedColor: colors.primary,
          selectedTextColor: "#ffffff",
          marked: hasData,
          dotColor: day.isCompleted ? colors.success : colors.warning,
        };
      } else if (day.isCompleted) {
        // Completed days
        marked[day.date] = {
          marked: true,
          dotColor: colors.success,
          customStyles: {
            container: {
              backgroundColor: colors.success + "20",
              borderRadius: 8,
            },
            text: {
              color: colors.success,
              fontWeight: "600",
            },
          },
        };
      } else if (hasData) {
        // Days with data but not completed
        marked[day.date] = {
          marked: true,
          dotColor: colors.warning,
          customStyles: {
            container: {
              backgroundColor: colors.warning + "20",
              borderRadius: 8,
            },
            text: {
              color: colors.warning,
              fontWeight: "600",
            },
          },
        };
      }
    });

    return marked;
  };

  const handleDayPress = (day: DateData) => {
    if (!readonly) {
      onDayPress(day.dateString);
    }
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
    calendar: {
      borderRadius: 8,
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

  const calendarTheme = {
    backgroundColor: colors.surface,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: "#ffffff",
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textTertiary,
    dotColor: colors.primary,
    selectedDotColor: "#ffffff",
    arrowColor: colors.primary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontFamily: "System",
    textMonthFontFamily: "System",
    textDayHeaderFontFamily: "System",
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        current={routeSheet.month + "-01"}
        minDate={routeSheet.month + "-01"}
        maxDate={
          routeSheet.month +
          "-" +
          String(
            new Date(
              parseInt(routeSheet.month.split("-")[0]),
              parseInt(routeSheet.month.split("-")[1]),
              0
            ).getDate()
          ).padStart(2, "0")
        }
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
        markingType="custom"
        theme={calendarTheme}
        hideExtraDays={true}
        firstDay={1} // Monday first
        enableSwipeMonths={false}
        disableMonthChange={true}
      />

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
