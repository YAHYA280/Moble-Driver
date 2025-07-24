// screens/innerApplication/planning/planningScreen.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { SearchModal } from "@/shared/components/ui/SearchModal";
import { usePlanningStore } from "@/store/planningStore";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Trip } from "../../../shared/types/planning";
import { PlanningContent } from "./components/PlanningContent";
import { PlanningFilterBar } from "./components/PlanningFilterBar";
import { PlanningHeader } from "./components/PlanningHeader";
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
    position: "relative",
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const calendarContentAnim = useRef(new Animated.Value(1)).current;
  const listContentAnim = useRef(new Animated.Value(0)).current;
  const calendarOpacity = useRef(new Animated.Value(0)).current;

  const {
    trips,
    filteredTrips,
    filters,
    selectedDate,
    currentView,
    isLoading,
    error,
    fetchTrips,
    setFilters,
    clearFilters,
    setCurrentView,
    setSelectedDate,
    selectTrip,
    getTripsForDate,
    clearError,
  } = usePlanningStore();

  useEffect(() => {
    fetchTrips();
    initializeAnimations();
    setupInitialView();
  }, []);

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
    ]).start();
  };

  const setupInitialView = () => {
    if (currentView === "month") {
      calendarContentAnim.setValue(1);
      listContentAnim.setValue(0);
    } else {
      calendarContentAnim.setValue(0);
      listContentAnim.setValue(1);
    }
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
    router.push(`./planning/agenda/${date}`);
  };

  const handleTripPress = (trip: Trip) => {
    selectTrip(trip);
    router.push(`./planning/trip/${trip.id}`);
  };

  const handleViewToggle = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const newView = currentView === "month" ? "list" : "month";

    const animations =
      newView === "list"
        ? [
            Animated.timing(calendarContentAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(listContentAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]
        : [
            Animated.timing(listContentAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(calendarContentAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ];

    Animated.parallel(animations).start(() => {
      setCurrentView(newView);
      setIsTransitioning(false);
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  };

  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: colors.backgroundSecondary,
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
        onViewToggle={handleViewToggle}
        currentView={currentView}
      />

      <ConditionalComponent isValid={!!error}>
        <View style={dynamicStyles.errorContainer}>
          <Text style={dynamicStyles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      <View style={styles.contentContainer}>
        <PlanningContent
          currentView={currentView}
          currentDate={currentDate}
          selectedDate={selectedDate}
          filteredTrips={filteredTrips}
          markedDates={getMarkedDates()}
          calendarTheme={calendarTheme}
          filters={filters}
          refreshing={refreshing}
          calendarContentAnim={calendarContentAnim}
          listContentAnim={listContentAnim}
          calendarOpacity={calendarOpacity}
          onDayPress={handleDayPress}
          onTripPress={handleTripPress}
          onRefresh={handleRefresh}
          onMonthChange={(month) =>
            setCurrentDate(new Date(month.year, month.month - 1, month.day))
          }
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
