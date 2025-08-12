import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { DayData } from "../../../shared/types/routeSheet";
import { useRouteSheetStore } from "../../../store/routeSheetStore";

const { width } = Dimensions.get("window");

export const CreateRouteSheetScreen: React.FC = () => {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<any>({});
  const headerAnim = useRef(new Animated.Value(0)).current;
  const calendarAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  const { currentRouteSheet, getCurrentMonthRouteSheet } = useRouteSheetStore();

  // Create calendar theme that properly responds to theme changes
  const calendarTheme = useMemo(
    () => ({
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
    }),
    [colors]
  );

  // Create styles that properly respond to theme changes
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.backgroundSecondary,
        },
        content: {
          flex: 1,
        },
        monthHeader: {
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 20,
        },
        monthText: {
          fontSize: 24,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 4,
        },
        yearText: {
          fontSize: 16,
          color: colors.textSecondary,
          fontWeight: "400",
        },
        calendarContainer: {
          backgroundColor: colors.surface,
          borderRadius: 16,
          marginHorizontal: 20,
          marginBottom: 20,
          overflow: "hidden",
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
        legendContainer: {
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 16,
          paddingHorizontal: 20,
          backgroundColor: colors.surface,
          borderRadius: 12,
          marginHorizontal: 20,
          marginBottom: 20,
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
        legendItem: {
          flexDirection: "row",
          alignItems: "center",
        },
        legendDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          marginRight: 8,
        },
        legendText: {
          fontSize: 12,
          color: colors.textSecondary,
          fontWeight: "500",
        },
        buttonContainer: {
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: Platform.OS === "ios" ? 34 : 20,
          backgroundColor: colors.backgroundSecondary,
        },
        fillButton: {
          backgroundColor: colors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
          ...Platform.select({
            ios: {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },
            android: {
              elevation: 6,
            },
            web: {
              boxShadow: `0 4px 8px ${colors.primary}40`,
            },
          }),
        },
        fillButtonText: {
          color: "white",
          fontSize: 16,
          fontWeight: "600",
          letterSpacing: 0.5,
        },
      }),
    [colors]
  );

  useEffect(() => {
    // Load current month route sheet
    getCurrentMonthRouteSheet();

    // Start animations
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(calendarAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (currentRouteSheet) {
      updateMarkedDates();
    }
  }, [currentRouteSheet, selectedDate]);

  useEffect(() => {
    // Animate button when date is selected
    if (selectedDate) {
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedDate]);

  const updateMarkedDates = () => {
    if (!currentRouteSheet) return;

    const marked: any = {};

    currentRouteSheet.days.forEach((day: DayData) => {
      const hasActiveSlots = day.timeSlots.some((slot) => slot.isActive);
      const isModified = day.timeSlots.some(
        (slot) => slot.isActive && slot.comments && slot.comments.trim() !== ""
      );

      if (hasActiveSlots) {
        marked[day.date] = {
          marked: true,
          dotColor: isModified ? "#f59e0b" : colors.primary,
          selected: day.date === selectedDate,
          selectedColor: colors.primary,
          selectedTextColor: "#ffffff",
        };
      } else if (day.date === selectedDate) {
        // Selected but not filled
        marked[day.date] = {
          selected: true,
          selectedColor: colors.primary,
          selectedTextColor: "#ffffff",
        };
      }
    });

    setMarkedDates(marked);
  };

  const handleDayPress = (day: DateData) => {
    const dateString = day.dateString;
    const currentDate = new Date();
    const selectedDateObj = new Date(dateString);

    // Only allow selection of dates in current month
    if (
      selectedDateObj.getMonth() === currentDate.getMonth() &&
      selectedDateObj.getFullYear() === currentDate.getFullYear()
    ) {
      setSelectedDate(dateString);
    }
  };

  const handleFillRouteSheet = () => {
    if (selectedDate && currentRouteSheet) {
      // Navigate to day edit screen with selected date
      router.push(
        `/(tabs)/routes/edit/${currentRouteSheet.id}?date=${selectedDate}`
      );
    }
  };

  const getCurrentMonth = () => {
    const now = new Date();
    const monthNames = [
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
    return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  };

  const getCurrentMonthString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}
      >
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Ajout de Feuille de route"
        />
      </Animated.View>

      <View style={styles.content}>
        {/* Month Header */}
        <Animated.View
          style={[
            styles.monthHeader,
            {
              opacity: calendarAnim,
              transform: [
                {
                  translateY: calendarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.monthText}>
            {getCurrentMonth().split(" ")[0]}
          </Text>
          <Text style={styles.yearText}>{getCurrentMonth().split(" ")[1]}</Text>
        </Animated.View>

        {/* Legend */}
        <Animated.View
          style={[
            styles.legendContainer,
            {
              opacity: calendarAnim,
              transform: [
                {
                  translateY: calendarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: colors.primary }]}
            />
            <Text style={styles.legendText}>Rempli</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#f59e0b" }]} />
            <Text style={styles.legendText}>Modifié</Text>
          </View>
        </Animated.View>

        {/* Calendar */}
        <Animated.View
          style={[
            styles.calendarContainer,
            {
              opacity: calendarAnim,
              transform: [
                {
                  translateY: calendarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Calendar
            key={colors.isDark ? "dark" : "light"} // Force re-render when theme changes
            current={getCurrentMonthString()}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            markingType="dot"
            enableSwipeMonths={false}
            hideArrows={true}
            hideExtraDays={true}
            disableMonthChange={true}
            firstDay={1}
            showWeekNumbers={false}
            theme={calendarTheme}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: colors.surface,
              borderRadius: 16,
              overflow: "hidden",
            }}
          />
        </Animated.View>

        {/* Fill Route Sheet Button - Right under calendar */}
        {selectedDate && (
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonAnim,
                transform: [
                  {
                    translateY: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.fillButton}
              onPress={handleFillRouteSheet}
              activeOpacity={0.8}
            >
              <Text style={styles.fillButtonText}>
                Veuillez saisir la feuille de route
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};
