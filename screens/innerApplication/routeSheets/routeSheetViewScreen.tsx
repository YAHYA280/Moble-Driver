import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { DayData, RouteSheet } from "../../../shared/types/routeSheet";
import { useRouteSheetStore } from "../../../store/routeSheetStore";
import { RouteSheetSummaryCard } from "./components/RouteSheetSummaryCard";

export const RouteSheetViewScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [selectedRouteSheet, setSelectedRouteSheet] =
    useState<RouteSheet | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<any>({});

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const { routeSheets } = useRouteSheetStore();

  useEffect(() => {
    if (id) {
      const foundSheet = routeSheets.find((sheet) => sheet.id === id);
      if (foundSheet) {
        setSelectedRouteSheet(foundSheet);
        updateMarkedDates(foundSheet);
      }
    }

    // Start animations
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [id, routeSheets]);

  const updateMarkedDates = (routeSheet: RouteSheet) => {
    const marked: any = {};

    routeSheet.days.forEach((day: DayData) => {
      const hasActiveSlots = day.timeSlots.some((slot) => slot.isActive);
      const isCompleted = day.isCompleted;
      const isModified = day.timeSlots.some(
        (slot) => slot.isActive && slot.comments && slot.comments.trim() !== ""
      );

      if (hasActiveSlots) {
        if (isModified) {
          // Orange for modified days
          marked[day.date] = {
            marked: true,
            dotColor: "#f59e0b",
            selected: day.date === selectedDate,
            selectedColor:
              day.date === selectedDate ? colors.primary : undefined,
            selectedTextColor:
              day.date === selectedDate ? "#ffffff" : undefined,
          };
        } else if (isCompleted) {
          // Green for completed days
          marked[day.date] = {
            marked: true,
            dotColor: "#22c55e",
            selected: day.date === selectedDate,
            selectedColor:
              day.date === selectedDate ? colors.primary : undefined,
            selectedTextColor:
              day.date === selectedDate ? "#ffffff" : undefined,
          };
        } else {
          // Primary purple for filled days
          marked[day.date] = {
            marked: true,
            dotColor: colors.primary,
            selected: day.date === selectedDate,
            selectedColor:
              day.date === selectedDate ? colors.primary : undefined,
            selectedTextColor:
              day.date === selectedDate ? "#ffffff" : undefined,
          };
        }
      }

      // Highlight selected date
      if (day.date === selectedDate && !hasActiveSlots) {
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
    setSelectedDate(dateString);

    if (selectedRouteSheet) {
      const dayData = selectedRouteSheet.days.find(
        (d) => d.date === dateString
      );
      const hasData = dayData?.timeSlots.some((slot) => slot.isActive);

      if (hasData) {
        // Check if this is current month (editable) or past month (read-only)
        const currentDate = new Date();
        const selectedDateObj = new Date(dateString);
        const isCurrentMonth =
          selectedDateObj.getMonth() === currentDate.getMonth() &&
          selectedDateObj.getFullYear() === currentDate.getFullYear();

        if (isCurrentMonth) {
          // Navigate to edit screen for current month
          router.push(
            `/(tabs)/routes/edit/${selectedRouteSheet.id}?date=${dateString}`
          );
        } else {
          // Navigate to read-only view for past months
          router.push(
            `/(tabs)/routes/view/${selectedRouteSheet.id}?date=${dateString}&readonly=true`
          );
        }
      }
    }

    updateMarkedDates(selectedRouteSheet!);
  };

  const isCurrentMonth = () => {
    if (!selectedRouteSheet) return false;
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    return selectedRouteSheet.month === currentMonth;
  };

  const handleDownload = () => {
    Alert.alert(
      "Téléchargement",
      "Cette fonctionnalité sera bientôt implémentée.",
      [{ text: "OK" }]
    );
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 50,
    },
    summarySection: {
      marginBottom: 20,
    },
    headerCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colors.isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 20,
      backgroundColor: colors.primary,
    },
    headerContent: {
      flex: 1,
    },
    monthTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
    },
    kilometersText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "500",
      marginBottom: 8,
    },
    completionText: {
      fontSize: 14,
      color: colors.textTertiary,
      fontWeight: "500",
    },
    headerActions: {
      alignItems: "center",
    },
    downloadButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary + "15",
      marginBottom: 8,
    },
    calendarSection: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 20,
      overflow: "hidden",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colors.isDark ? 0.3 : 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
    calendarHeader: {
      padding: 16,
      backgroundColor: colors.backgroundTertiary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    calendarTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    legendContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 8,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    legendText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    editButton: {
      marginTop: 20,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    editButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    helpText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 16,
      fontStyle: "italic",
    },
  });

  if (!selectedRouteSheet) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détail feuille de route"
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: colors.textSecondary }}>
            Feuille de route non trouvée
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
          title="Détail feuille de route"
          subtitle={selectedRouteSheet.monthName}
        />
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.iconContainer}>
              <FontAwesome name="file-text-o" size={28} color="white" />
            </View>

            <View style={styles.headerContent}>
              <Text style={styles.monthTitle}>
                {selectedRouteSheet.monthName}
              </Text>
              <Text style={styles.kilometersText}>
                <FontAwesome
                  name="road"
                  size={14}
                  color={colors.textSecondary}
                />{" "}
                {selectedRouteSheet.totalKilometrage} km parcourus
              </Text>
              <Text style={styles.completionText}>
                <FontAwesome
                  name="check-circle"
                  size={12}
                  color={colors.textTertiary}
                />{" "}
                {selectedRouteSheet.completionPercentage}% complété
              </Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownload}
                activeOpacity={0.7}
              >
                <FontAwesome name="download" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <RouteSheetSummaryCard routeSheet={selectedRouteSheet} />
          </View>

          {/* Calendar Section */}
          <View style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Calendrier des trajets</Text>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                  <Text style={styles.legendText}>Rempli</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: "#22c55e" }]}
                  />
                  <Text style={styles.legendText}>Terminé</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: "#f59e0b" }]}
                  />
                  <Text style={styles.legendText}>Modifié</Text>
                </View>
              </View>
            </View>

            <Calendar
              current={selectedRouteSheet.month}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              markingType="dot"
              enableSwipeMonths={false}
              hideArrows={false}
              hideExtraDays={true}
              disableMonthChange={true}
              firstDay={1}
              showWeekNumbers={false}
              theme={calendarTheme}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: colors.surface,
              }}
            />
          </View>

          {/* Edit Button for Current Month */}
          {isCurrentMonth() && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push(`/(tabs)/routes/create`)}
            >
              <Text style={styles.editButtonText}>Continuer la saisie</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.helpText}>
            {isCurrentMonth()
              ? "Cliquez sur un jour rempli pour modifier ou consulter les détails"
              : "Cliquez sur un jour rempli pour consulter les détails (lecture seule)"}
          </Text>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
