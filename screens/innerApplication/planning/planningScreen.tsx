// screens/innerApplication/planning/planningScreen.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { SearchModal } from "@/shared/components/ui/SearchModal";
import { usePlanningStore } from "@/store/planningStore";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Trip } from "../../../shared/types/planning";
import { AnimatedTripCard } from "./components/AnimatedTripCard";
import { PlanningFilterBar } from "./components/PlanningFilterBar";
import { PlanningHeader } from "./components/PlanningHeader";
import { PlanningWeekView } from "./components/PlanningWeekView";
import { PLANNING_CONFIG } from "./constants/planningConstants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  calendarSection: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  upcomingSection: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  upcomingTripsContainer: {
    flex: 1,
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export const PlanningScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const date = new Date();
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - day + 1);
    return monday;
  });

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const calendarOpacity = useRef(new Animated.Value(0)).current;
  const upcomingOpacity = useRef(new Animated.Value(0)).current;

  const {
    trips,
    filteredTrips,
    filters,
    selectedDate,
    isLoading,
    error,
    fetchTrips,
    setFilters,
    clearFilters,
    setSelectedDate,
    selectTrip,
    getTripsForDate,
    getTripsForWeek,
    clearError,
  } = usePlanningStore();

  useEffect(() => {
    fetchTrips();
    initializeAnimations();
  }, []);

  // Set initial selected date to today
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
    }
  }, [selectedDate, setSelectedDate]);

  const initializeAnimations = () => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: PLANNING_CONFIG.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(calendarOpacity, {
        toValue: 1,
        duration: PLANNING_CONFIG.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(upcomingOpacity, {
        toValue: 1,
        duration: PLANNING_CONFIG.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

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

  const handleDayPress = (day: any) => {
    const date = day.dateString;
    setSelectedDate(date);
    router.push(`/(tabs)/planning/agenda/${date}`);
  };

  const handleTripPress = (trip: Trip) => {
    selectTrip(trip);
    router.push(`/(tabs)/planning/trip/${trip.id}`);
  };

  const handleCalendarViewToggle = () => {
    setCalendarView((prev) => (prev === "month" ? "week" : "month"));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  };

  const handleWeekChange = (weekStart: Date) => {
    setCurrentWeekStart(weekStart);
    setCurrentDate(weekStart);
  };

  // Get the trips to display based on view mode
  const getDisplayTrips = () => {
    if (calendarView === "month") {
      // Show trips for the selected date (or today if no date selected)
      const targetDate = selectedDate || new Date().toISOString().split("T")[0];
      return getTripsForDate(targetDate);
    } else {
      // Show trips for the current week
      const weekStart = new Date(currentWeekStart);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      return getTripsForWeek(
        weekStart.toISOString().split("T")[0],
        weekEnd.toISOString().split("T")[0]
      );
    }
  };

  // Get section title and subtitle
  const getSectionInfo = () => {
    if (calendarView === "month") {
      const targetDate = selectedDate || new Date().toISOString().split("T")[0];
      const dateObj = new Date(targetDate);
      const isToday = targetDate === new Date().toISOString().split("T")[0];

      return {
        title: isToday ? "Trajets du jour" : "Trajets du jour sélectionné",
        subtitle: isToday
          ? "Aujourd'hui"
          : dateObj.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }),
      };
    } else {
      const weekStart = new Date(currentWeekStart);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const startFormatted = weekStart.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
      const endFormatted = weekEnd.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });

      return {
        title: "Trajets de la semaine",
        subtitle: `Du ${startFormatted} au ${endFormatted}`,
      };
    }
  };

  const displayTrips = getDisplayTrips();
  const sectionInfo = getSectionInfo();

  const renderTripItem = ({ item, index }: { item: Trip; index: number }) => (
    <AnimatedTripCard
      item={item}
      index={index}
      onPress={() => handleTripPress(item)}
      showDate={calendarView === "week"}
    />
  );

  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: colors.backgroundSecondary,
    },
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
    upcomingSection: {
      ...styles.upcomingSection,
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
    sectionHeader: {
      ...styles.sectionHeader,
      borderBottomColor: colors.border + "30",
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: colors.text,
    },
    sectionSubtitle: {
      ...styles.sectionSubtitle,
      color: colors.textSecondary,
    },
    emptyTitle: {
      ...styles.emptyTitle,
      color: colors.text,
    },
    emptyText: {
      ...styles.emptyText,
      color: colors.textSecondary,
    },
    errorContainer: {
      ...styles.errorContainer,
      backgroundColor: colors.error + "15",
      borderLeftColor: colors.error,
    },
    errorText: {
      ...styles.errorText,
      color: colors.error,
    },
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <PlanningHeader
          title="Planning"
          subtitle={`${filteredTrips.length} trajets`}
          rightIcons={[
            { icon: "search", onPress: () => setShowSearchModal(true) },
            {
              icon: "bell",
              onPress: () => router.push("/notifications?returnTo=/planning"),
              badge: 3,
            },
          ]}
        />
      </Animated.View>

      <PlanningFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        onViewToggle={handleCalendarViewToggle}
        currentView={calendarView}
      />

      <ConditionalComponent isValid={!!error}>
        <View style={dynamicStyles.errorContainer}>
          <Text style={dynamicStyles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      <View style={styles.contentContainer}>
        {/* Calendar Section */}
        <Animated.View
          style={[dynamicStyles.calendarSection, { opacity: calendarOpacity }]}
        >
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            style={{ flex: 0 }}
          />

          <ConditionalComponent
            isValid={calendarView === "month"}
            defaultComponent={
              <PlanningWeekView
                currentDate={currentDate}
                markedDates={getMarkedDates()}
                theme={calendarTheme}
                onDayPress={handleDayPress}
                onWeekChange={handleWeekChange}
              />
            }
          >
            <Calendar
              key={colors.isDark ? "dark" : "light"}
              current={currentDate.toISOString().split("T")[0]}
              onDayPress={handleDayPress}
              markedDates={getMarkedDates()}
              markingType="multi-dot"
              theme={calendarTheme}
              enableSwipeMonths={true}
              hideExtraDays={false}
              disableMonthChange={false}
              firstDay={1}
              onMonthChange={(month) =>
                setCurrentDate(new Date(month.year, month.month - 1, month.day))
              }
              style={{ borderRadius: 16, overflow: "hidden" }}
            />
          </ConditionalComponent>
        </Animated.View>

        {/* Trips Section */}
        <Animated.View
          style={[dynamicStyles.upcomingSection, { opacity: upcomingOpacity }]}
        >
          <View style={dynamicStyles.sectionHeader}>
            <View>
              <Text style={dynamicStyles.sectionTitle}>
                {sectionInfo.title}
              </Text>
              <Text style={dynamicStyles.sectionSubtitle}>
                {sectionInfo.subtitle} • {displayTrips.length} trajet
                {displayTrips.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          <View style={styles.upcomingTripsContainer}>
            <ConditionalComponent
              isValid={displayTrips.length > 0}
              defaultComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🚌</Text>
                  <Text style={dynamicStyles.emptyTitle}>Aucun trajet</Text>
                  <Text style={dynamicStyles.emptyText}>
                    {calendarView === "month"
                      ? "Aucun trajet prévu pour cette date."
                      : "Aucun trajet prévu pour cette semaine."}
                  </Text>
                </View>
              }
            >
              <FlatList
                data={displayTrips}
                renderItem={renderTripItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                  />
                }
                ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
              />
            </ConditionalComponent>
          </View>
        </Animated.View>
      </View>

      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={(query) => setFilters({ searchQuery: query })}
        placeholder="Rechercher par école, véhicule, destination..."
        initialQuery={filters.searchQuery || ""}
        title="Rechercher trajets"
      />
    </SafeAreaView>
  );
};
