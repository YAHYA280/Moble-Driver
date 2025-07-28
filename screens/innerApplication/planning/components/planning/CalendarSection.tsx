// screens/innerApplication/planning/components/planning/CalendarSection.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import React from "react";
import { Animated, Platform, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { Trip } from "../../../../../shared/types/planning";
import { PlanningWeekView } from "../PlanningWeekView";

interface CalendarSectionProps {
  calendarView: "month" | "week";
  currentDate: Date;
  filteredTrips: Trip[];
  selectedDate: string | null;
  currentWeekStart: Date;
  onDayPress: (day: any) => void;
  onWeekChange: (weekStart: Date) => void;
  onRefresh: () => void;
  refreshing: boolean;
  onMonthChange: (date: Date) => void;
  calendarOpacity: Animated.Value;
  calendarTransition: Animated.Value;
}

const styles = StyleSheet.create({
  calendarSection: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
});

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  calendarView,
  currentDate,
  filteredTrips,
  selectedDate,
  currentWeekStart,
  onDayPress,
  onWeekChange,
  onMonthChange,
  calendarOpacity,
  calendarTransition,
}) => {
  const { colors } = useTheme();

  const getMarkedDates = () => {
    const marked: any = {};
    const tripsByDate: Record<string, Trip[]> = {};

    filteredTrips.forEach((trip) => {
      if (!tripsByDate[trip.date]) {
        tripsByDate[trip.date] = [];
      }
      tripsByDate[trip.date].push(trip);
    });

    Object.keys(tripsByDate).forEach((date) => {
      const dayTrips = tripsByDate[date];
      const uniqueTypes = [...new Set(dayTrips.map((t) => t.type))].slice(0, 3);

      const dots = uniqueTypes.map((type) => {
        const typeColors = {
          ecole: "#3b82f6",
          transport: "#22c55e",
          maintenance: "#f59e0b",
          autre: "#6b7280",
        };

        return {
          key: type,
          color: typeColors[type] || "#6b7280",
          selectedDotColor: "#ffffff",
        };
      });

      marked[date] = { dots: dots, marked: true };
    });

    if (selectedDate && marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = colors.primary;
      marked[selectedDate].selectedTextColor = "#ffffff";
    } else if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: "#ffffff",
      };
    }

    return marked;
  };

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
    disabledArrowColor: colors.textTertiary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontWeight: "500" as const,
    textMonthFontWeight: "700" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  const dynamicStyles = {
    calendarSection: {
      ...styles.calendarSection,
      backgroundColor: colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: { elevation: 8 },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
  };

  return (
    <Animated.View
      style={[
        dynamicStyles.calendarSection,
        {
          opacity: calendarOpacity,
          transform: [
            {
              scale: calendarTransition.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
            {
              translateY: calendarTransition.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <ConditionalComponent
        isValid={calendarView === "month"}
        defaultComponent={
          <PlanningWeekView
            currentDate={currentDate}
            markedDates={getMarkedDates()}
            theme={calendarTheme}
            onDayPress={onDayPress}
            onWeekChange={onWeekChange}
          />
        }
      >
        <Calendar
          key={colors.isDark ? "dark" : "light"}
          current={currentDate.toISOString().split("T")[0]}
          onDayPress={onDayPress}
          markedDates={getMarkedDates()}
          markingType="multi-dot"
          theme={calendarTheme}
          enableSwipeMonths={true}
          hideExtraDays={false}
          disableMonthChange={false}
          firstDay={1}
          onMonthChange={(month) =>
            onMonthChange(new Date(month.year, month.month - 1, month.day))
          }
          style={{ borderRadius: 16, overflow: "hidden" }}
        />
      </ConditionalComponent>
    </Animated.View>
  );
};
