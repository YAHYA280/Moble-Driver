// screens/innerApplication/planning/planningScreen.tsx
import { SearchModal } from "@/shared/components/ui/SearchModal";
import { usePlanningStore } from "@/store/planningStore";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Trip } from "../../../shared/types/planning";
import { PlanningHeader } from "./components/PlanningHeader";
import { CalendarSection } from "./components/planning/CalendarSection";
import { ErrorSection } from "./components/planning/ErrorSection";
import { TripsSection } from "./components/planning/TripsSection";
import { ViewToggleSection } from "./components/planning/ViewToggleSection";
import { PLANNING_CONFIG } from "./constants/planningConstants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
  },
});

export const PlanningScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [isViewChanging, setIsViewChanging] = useState(false);
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
  const toggleAnim = useRef(new Animated.Value(0)).current;
  const toggleButtonScale = useRef(new Animated.Value(1)).current;
  const toggleButtonOpacity = useRef(new Animated.Value(1)).current;
  const calendarTransition = useRef(new Animated.Value(1)).current;

  const {
    filteredTrips,
    filters,
    selectedDate,
    error,
    fetchTrips,
    setFilters,
    setSelectedDate,
    selectTrip,
    getTripsForDate,
    getTripsForWeek,
  } = usePlanningStore();

  useEffect(() => {
    fetchTrips();
    initializeAnimations();
  }, []);

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
      Animated.timing(toggleAnim, {
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

  const animateViewToggle = () => {
    setIsViewChanging(true);

    // Button press animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(toggleButtonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(toggleButtonOpacity, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(toggleButtonScale, {
          toValue: 1,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(toggleButtonOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Calendar transition animation
    Animated.sequence([
      Animated.timing(calendarTransition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(calendarTransition, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsViewChanging(false);
    });
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
    animateViewToggle();
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

  const getDisplayTrips = () => {
    if (calendarView === "month") {
      const targetDate = selectedDate || new Date().toISOString().split("T")[0];
      return getTripsForDate(targetDate);
    } else {
      const weekStart = new Date(currentWeekStart);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      return getTripsForWeek(
        weekStart.toISOString().split("T")[0],
        weekEnd.toISOString().split("T")[0]
      );
    }
  };

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

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
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

      <ViewToggleSection
        calendarView={calendarView}
        onViewToggle={handleCalendarViewToggle}
        isViewChanging={isViewChanging}
        toggleAnim={toggleAnim}
        toggleButtonScale={toggleButtonScale}
        toggleButtonOpacity={toggleButtonOpacity}
      />

      {error && <ErrorSection error={error} />}

      <View style={styles.contentContainer}>
        <CalendarSection
          calendarView={calendarView}
          currentDate={currentDate}
          filteredTrips={filteredTrips}
          selectedDate={selectedDate}
          currentWeekStart={currentWeekStart}
          onDayPress={handleDayPress}
          onWeekChange={handleWeekChange}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onMonthChange={setCurrentDate}
          calendarOpacity={calendarOpacity}
          calendarTransition={calendarTransition}
        />

        <TripsSection
          displayTrips={displayTrips}
          sectionInfo={sectionInfo}
          calendarView={calendarView}
          onTripPress={handleTripPress}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          upcomingOpacity={upcomingOpacity}
        />
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
