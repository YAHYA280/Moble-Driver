// screens/innerApplication/planning/components/PlanningWeekView.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

interface PlanningWeekViewProps {
  currentDate: Date;
  markedDates: any;
  theme: any;
  onDayPress: (day: { dateString: string }) => void;
  onWeekChange: (date: Date) => void;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "700",
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(116, 108, 212, 0.1)",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayHeaderContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  dayHeader: {
    fontSize: 14,
    fontWeight: "600",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 2,
    borderRadius: 12,
  },
  selectedDay: {
    backgroundColor: "#746cd4",
  },
  todayDay: {
    backgroundColor: "rgba(116, 108, 212, 0.2)",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectedDayText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  todayDayText: {
    color: "#746cd4",
    fontWeight: "700",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
    minHeight: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  selectedDot: {
    backgroundColor: "#ffffff",
  },
});

export const PlanningWeekView: React.FC<PlanningWeekViewProps> = ({
  currentDate,
  markedDates,
  theme,
  onDayPress,
  onWeekChange,
}) => {
  const colors = useThemeColors();
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - day + 1);
    return monday;
  });

  const getWeekDays = (weekStart: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeekStart = new Date(selectedWeekStart);
    newWeekStart.setDate(
      selectedWeekStart.getDate() + (direction === "next" ? 7 : -7)
    );
    setSelectedWeekStart(newWeekStart);
    onWeekChange(newWeekStart);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getDayMarking = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return markedDates[dateString];
  };

  const weekDays = getWeekDays(selectedWeekStart);
  const monthYear = selectedWeekStart.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const dayHeaders = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const dynamicStyles = {
    container: {
      ...styles.container,
    },
    monthText: {
      ...styles.monthText,
      color: colors.text,
    },
    dayHeader: {
      ...styles.dayHeader,
      color: colors.textSecondary,
    },
    dayText: {
      ...styles.dayText,
      color: colors.text,
    },
    navigationButton: {
      ...styles.navigationButton,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: { elevation: 3 },
      }),
    },
  };

  return (
    <View style={dynamicStyles.container}>
      {/* Header with navigation */}
      <View style={styles.header}>
        <TouchableOpacity
          style={dynamicStyles.navigationButton}
          onPress={() => navigateWeek("prev")}
          activeOpacity={0.7}
        >
          <FontAwesome name="chevron-left" size={16} color={colors.primary} />
        </TouchableOpacity>

        <Text style={dynamicStyles.monthText}>
          {monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}
        </Text>

        <TouchableOpacity
          style={dynamicStyles.navigationButton}
          onPress={() => navigateWeek("next")}
          activeOpacity={0.7}
        >
          <FontAwesome name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={styles.weekContainer}>
        {dayHeaders.map((header, index) => (
          <View key={index} style={styles.dayHeaderContainer}>
            <Text style={dynamicStyles.dayHeader}>{header}</Text>
          </View>
        ))}
      </View>

      {/* Week days */}
      <View style={styles.weekRow}>
        {weekDays.map((day, index) => {
          const marking = getDayMarking(day);
          const isSelected = marking?.selected;
          const isTodayDate = isToday(day);
          const dayString = day.toISOString().split("T")[0];

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                isSelected && styles.selectedDay,
                !isSelected && isTodayDate && styles.todayDay,
              ]}
              onPress={() => onDayPress({ dateString: dayString })}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  dynamicStyles.dayText,
                  isSelected && styles.selectedDayText,
                  !isSelected && isTodayDate && styles.todayDayText,
                ]}
              >
                {day.getDate()}
              </Text>

              {/* Dots for marked dates */}
              <View style={styles.dotsContainer}>
                {marking?.dots
                  ?.slice(0, 3)
                  .map((dot: any, dotIndex: number) => (
                    <View
                      key={dotIndex}
                      style={[
                        styles.dot,
                        {
                          backgroundColor: isSelected ? "#ffffff" : dot.color,
                        },
                      ]}
                    />
                  ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
