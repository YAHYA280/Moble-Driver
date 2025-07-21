// screens/innerApplication/calendar/components/CalendarHeader.tsx
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

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTodayPress: () => void;
  style?: ViewStyle;
}

const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onTodayPress,
  style,
}) => {
  const colors = useThemeColors();

  const currentMonth = MONTH_NAMES[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    leftNavigationContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    rightNavigationContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    navButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
      marginHorizontal: 4,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    dateContainer: {
      alignItems: "center",
      flex: 1,
      paddingHorizontal: 16,
    },
    monthText: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
    yearText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 2,
    },
    todayButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: colors.primary + "15",
      borderWidth: 1,
      borderColor: colors.primary + "30",
      marginRight: 8,
    },
    todayButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Left Navigation - Previous Month and Today Button */}
      <View style={styles.leftNavigationContainer}>
        <TouchableOpacity
          style={styles.todayButton}
          onPress={onTodayPress}
          activeOpacity={0.7}
        >
          <Text style={styles.todayButtonText}>Aujourd&apos;hui</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={onPrevMonth}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="chevron-left"
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Center - Current Month and Year */}
      <View style={styles.dateContainer}>
        <Text style={styles.monthText}>{currentMonth}</Text>
        <Text style={styles.yearText}>{currentYear}</Text>
      </View>

      {/* Right Navigation - Next Month */}
      <View style={styles.rightNavigationContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onNextMonth}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="chevron-right"
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { CalendarHeader };
