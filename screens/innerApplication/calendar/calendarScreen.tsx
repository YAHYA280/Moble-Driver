import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { SearchModal } from "@/shared/components/ui/SearchModal";
import { Sidebar } from "@/shared/components/ui/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useCalendarStore } from "@/store/calendarStore";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { Appointment } from "../../../shared/types/calendar";
import { AppointmentCard } from "./components/AppointmentCard";
import { CalendarFilterBar } from "./components/CalendarFilterBar";

const { height: screenHeight } = Dimensions.get("window");

// Enhanced Appointment Card with improved animations
const AnimatedAppointmentCard: React.FC<{
  item: Appointment;
  index: number;
  onPress: () => void;
  showDate: boolean;
}> = ({ item, index, onPress, showDate }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const delay = index * 100;
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index, animValue, scaleValue]);

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
          { scale: scaleValue },
        ],
      }}
    >
      <AppointmentCard
        appointment={item}
        onPress={onPress}
        showDate={showDate}
      />
    </Animated.View>
  );
};

export const CalendarScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const calendarOpacity = useRef(new Animated.Value(0)).current;

  const {
    appointments,
    filteredAppointments,
    filters,
    selectedDate,
    currentView,
    isLoading,
    error,
    fetchAppointments,
    setFilters,
    clearFilters,
    setCurrentView,
    setSelectedDate,
    selectAppointment,
    getAppointmentsForDate,
    clearError,
  } = useCalendarStore();

  const { logout } = useAuthStore();

  useEffect(() => {
    fetchAppointments();

    // Enhanced animation sequence
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(calendarOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Create marked dates with dots for appointments - Following react-native-calendars format
  const getMarkedDates = () => {
    const marked: any = {};

    // Group appointments by date
    const appointmentsByDate: Record<string, Appointment[]> = {};
    filteredAppointments.forEach((appointment) => {
      if (!appointmentsByDate[appointment.date]) {
        appointmentsByDate[appointment.date] = [];
      }
      appointmentsByDate[appointment.date].push(appointment);
    });

    // Create marked dates with dots
    Object.keys(appointmentsByDate).forEach((date) => {
      const dayAppointments = appointmentsByDate[date];

      // Get unique appointment types for this day (max 3 dots)
      const uniqueTypes = [
        ...new Set(dayAppointments.map((a) => a.type)),
      ].slice(0, 3);

      // Create dots array
      const dots = uniqueTypes.map((type) => {
        const typeColors = {
          "visite-medicale": "#22c55e",
          formation: "#ef4444",
          "entretien-rh": "#3b82f6",
          maintenance: "#f59e0b",
          reunion: "#8b5cf6",
          autre: "#6b7280",
        };

        return {
          key: type,
          color: typeColors[type] || "#6b7280",
          selectedDotColor: "#ffffff",
        };
      });

      marked[date] = {
        dots: dots,
        marked: true,
      };
    });

    // Mark selected date
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

  const handleAppointmentPress = (appointment: Appointment) => {
    selectAppointment(appointment);
    router.push(`./calendar/appointment/${appointment.id}`);
  };

  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    setSelectedDate(date);
    const dayAppointments = getAppointmentsForDate(date);

    if (dayAppointments.length === 0) {
      // No appointments for this day - still navigate to agenda view to show empty state
      router.push(`./calendar/agenda/${date}`);
    } else if (dayAppointments.length === 1) {
      // Single appointment - navigate to agenda view (not directly to details)
      router.push(`./calendar/agenda/${date}`);
    } else {
      // Multiple appointments - navigate to agenda view
      router.push(`./calendar/agenda/${date}`);
    }
  };

  const handleViewToggle = () => {
    Animated.timing(contentAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentView(currentView === "month" ? "list" : "month");
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleRefresh = () => {
    fetchAppointments();
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          setShowSidebar(false);
          logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=/calendar");
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleSearch = (query: string) => {
    setFilters({ searchQuery: query });
  };

  const sidebarItems = [
    {
      id: "calendar",
      label: "Calendrier",
      icon: "calendar" as const,
      onPress: () => {
        setShowSidebar(false);
      },
      isActive: true,
    },
    {
      id: "appointments",
      label: "Mes rendez-vous",
      icon: "clock-o" as const,
      onPress: () => {
        setShowSidebar(false);
        setCurrentView("list");
      },
      isActive: false,
    },
  ];

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
      onPress={() => handleAppointmentPress(item)}
      showDate={currentView === "list"}
    />
  );

  const renderEmptyState = () => (
    <Animated.View
      style={[
        styles.emptyState,
        {
          opacity: contentAnim,
          transform: [
            {
              translateY: contentAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>📅</Text>
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucun rendez-vous trouvé
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {Object.keys(filters).length > 0
          ? "Aucun rendez-vous ne correspond à vos critères de recherche."
          : "Vos rendez-vous apparaîtront ici."}
      </Text>
    </Animated.View>
  );

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
    arrowColor: colors.textSecondary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontWeight: "500" as const,
    textMonthFontWeight: "600" as const,
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
    calendarContainer: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 16,
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
    listContainer: {
      flex: 1,
      paddingTop: 8,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingTop: 100,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyIconText: {
      fontSize: 48,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 22,
    },
    errorContainer: {
      backgroundColor: colors.error + "15",
      margin: 16,
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "500",
    },
    todayPreviewContainer: {
      margin: 16,
      marginTop: 8,
    },
    todayPreviewTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header with proper positioning */}
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
            icon: "bars",
            onPress: () => setShowSidebar(true),
          }}
          title="Calendrier"
          subtitle={`${filteredAppointments.length} rendez-vous`}
          rightIcons={[
            {
              icon: "search",
              onPress: handleSearchPress,
            },
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 3,
            },
          ]}
        />
      </Animated.View>

      {/* Filter Bar */}
      <CalendarFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        onViewToggle={handleViewToggle}
        currentView={currentView}
      />

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Content with enhanced animations */}
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
        <ConditionalComponent
          isValid={currentView === "month"}
          defaultComponent={
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
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={handleRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                  />
                }
                ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
              />
            </View>
          }
        >
          <View>
            <Animated.View
              style={[styles.calendarContainer, { opacity: calendarOpacity }]}
            >
              <Calendar
                current={currentDate.toISOString().split("T")[0]}
                onDayPress={handleDayPress}
                markedDates={getMarkedDates()}
                markingType="multi-dot"
                theme={calendarTheme}
                enableSwipeMonths={true}
                hideExtraDays={false}
                disableMonthChange={false}
                firstDay={1}
                onMonthChange={(month) => {
                  setCurrentDate(
                    new Date(month.year, month.month - 1, month.day)
                  );
                }}
                renderHeader={(date) => {
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

                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "700",
                          color: colors.text,
                        }}
                      >
                        {monthNames[date.getMonth()]} {date.getFullYear()}
                      </Text>
                    </View>
                  );
                }}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              />
            </Animated.View>

            {/* Today's appointments preview */}
            <ConditionalComponent
              isValid={
                getAppointmentsForDate(new Date().toISOString().split("T")[0])
                  .length > 0
              }
            >
              <Animated.View
                style={[
                  styles.todayPreviewContainer,
                  { opacity: calendarOpacity },
                ]}
              >
                <Text style={styles.todayPreviewTitle}>Aujourd&apos;hui</Text>
                {getAppointmentsForDate(new Date().toISOString().split("T")[0])
                  .slice(0, 2)
                  .map((appointment, index) => (
                    <AnimatedAppointmentCard
                      key={appointment.id}
                      item={appointment}
                      index={index}
                      onPress={() => handleAppointmentPress(appointment)}
                      showDate={false}
                    />
                  ))}
              </Animated.View>
            </ConditionalComponent>
          </View>
        </ConditionalComponent>
      </Animated.View>

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        placeholder="Rechercher par titre, lieu, médecin..."
        initialQuery={filters.searchQuery || ""}
        title="Rechercher rendez-vous"
      />

      {/* Sidebar */}
      <Sidebar
        title="Calendrier"
        items={sidebarItems}
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};
