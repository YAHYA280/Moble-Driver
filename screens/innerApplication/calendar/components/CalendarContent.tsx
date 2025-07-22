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
import {
  Appointment,
  CalendarFilters,
} from "../../../../shared/types/calendar";
import { AnimatedAppointmentCard } from "./AnimatedAppointmentCard";
import { CalendarEmptyState } from "./CalendarEmptyState";

interface CalendarContentProps {
  currentView: "month" | "list";
  currentDate: Date;
  selectedDate: string | null;
  filteredAppointments: Appointment[];
  markedDates: any;
  calendarTheme: any;
  filters: CalendarFilters;
  refreshing: boolean;
  calendarContentAnim: Animated.Value;
  listContentAnim: Animated.Value;
  calendarOpacity: Animated.Value;
  onDayPress: (day: any) => void;
  onAppointmentPress: (appointment: Appointment) => void;
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

export const CalendarContent: React.FC<CalendarContentProps> = ({
  currentView,
  currentDate,
  selectedDate,
  filteredAppointments,
  markedDates,
  calendarTheme,
  filters,
  refreshing,
  calendarContentAnim,
  listContentAnim,
  calendarOpacity,
  onDayPress,
  onAppointmentPress,
  onRefresh,
  onMonthChange,
}) => {
  const colors = useThemeColors();

  const renderAppointmentItem = ({
    item,
    index,
  }: {
    item: Appointment;
    index: number;
  }) => (
    <AnimatedAppointmentCard
      item={item}
      index={index}
      onPress={() => onAppointmentPress(item)}
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
            data={filteredAppointments}
            renderItem={renderAppointmentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              filteredAppointments.length === 0
                ? { flex: 1 }
                : { paddingBottom: 100 }
            }
            ListEmptyComponent={
              <CalendarEmptyState
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
