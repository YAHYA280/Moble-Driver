// screens/innerApplication/planning/components/PlanningContent.tsx
import React from "react";
import {
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useThemeColors } from "../../../../hooks/useTheme";
import { PlanningFilters, Trip } from "../../../../shared/types/planning";
import { AnimatedTripCard } from "./AnimatedTripCard";
import { PlanningEmptyState } from "./PlanningEmptyState";

interface PlanningContentProps {
  currentView: "month" | "week" | "day" | "list";
  currentDate: Date;
  selectedDate: string | null;
  filteredTrips: Trip[];
  markedDates: any;
  calendarTheme: any;
  filters: PlanningFilters;
  refreshing: boolean;
  calendarContentAnim: Animated.Value;
  listContentAnim: Animated.Value;
  calendarOpacity: Animated.Value;
  onDayPress: (day: any) => void;
  onTripPress: (trip: Trip) => void;
  onRefresh: () => void;
  onMonthChange: (month: any) => void;
}

const styles = StyleSheet.create({
  calendarView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  listView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  calendarContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  listContainer: {
    flex: 1,
    paddingTop: 8,
  },
});

export const PlanningContent: React.FC<PlanningContentProps> = ({
  currentView,
  currentDate,
  selectedDate,
  filteredTrips,
  markedDates,
  calendarTheme,
  filters,
  refreshing,
  calendarContentAnim,
  listContentAnim,
  calendarOpacity,
  onDayPress,
  onTripPress,
  onRefresh,
  onMonthChange,
}) => {
  const colors = useThemeColors();

  const renderTripItem = ({ item, index }: { item: Trip; index: number }) => (
    <AnimatedTripCard
      item={item}
      index={index}
      onPress={() => onTripPress(item)}
      showDate={currentView === "list"}
    />
  );

  const dynamicStyles = {
    calendarContainer: {
      ...styles.calendarContainer,
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
    <>
      {/* Calendar View */}
      <Animated.View
        style={[
          styles.calendarView,
          {
            opacity: calendarContentAnim,
            transform: [
              {
                translateX: calendarContentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents={currentView === "month" ? "auto" : "none"}
      >
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
          style={{ flex: 0 }}
        />

        <Animated.View
          style={[
            dynamicStyles.calendarContainer,
            { opacity: calendarOpacity },
          ]}
        >
          <Calendar
            key={colors.isDark ? "dark" : "light"}
            current={currentDate.toISOString().split("T")[0]}
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType="multi-dot"
            theme={calendarTheme}
            enableSwipeMonths={true}
            hideExtraDays={false}
            disableMonthChange={false}
            firstDay={1}
            onMonthChange={onMonthChange}
            style={{ borderRadius: 16, overflow: "hidden" }}
          />
        </Animated.View>
      </Animated.View>

      {/* List View */}
      <Animated.View
        style={[
          styles.listView,
          {
            opacity: listContentAnim,
            transform: [
              {
                translateX: listContentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents={currentView === "list" ? "auto" : "none"}
      >
        <View style={styles.listContainer}>
          <FlatList
            data={filteredTrips}
            renderItem={renderTripItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              filteredTrips.length === 0 ? { flex: 1 } : { paddingBottom: 100 }
            }
            ListEmptyComponent={
              <PlanningEmptyState
                hasFilters={Object.keys(filters).length > 0}
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
          />
        </View>
      </Animated.View>
    </>
  );
};
