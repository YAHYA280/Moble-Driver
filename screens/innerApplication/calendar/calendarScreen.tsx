// screens/innerApplication/calendar/calendarScreen.tsx
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
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { Appointment } from "../../../shared/types/calendar";
import { AppointmentCard } from "./components/AppointmentCard";
import { CalendarFilterBar } from "./components/CalendarFilterBar";
import { CalendarHeader } from "./components/CalendarHeader";
import { CalendarMonthView } from "./components/CalendarMonthView";

const AnimatedAppointmentCard: React.FC<{
  item: Appointment;
  index: number;
  onPress: () => void;
  showDate: boolean;
}> = ({ item, index, onPress, showDate }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 80;
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index, animValue]);

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }),
          },
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

    // Start animations
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAppointmentPress = (appointment: Appointment) => {
    selectAppointment(appointment);
    router.push(`./calendar/appointment/${appointment.id}`);
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    const dayAppointments = getAppointmentsForDate(date);

    if (dayAppointments.length === 1) {
      // If only one appointment, go directly to details
      handleAppointmentPress(dayAppointments[0]);
    } else if (dayAppointments.length > 1) {
      // If multiple appointments, switch to list view filtered by this date
      setCurrentView("list");
      setFilters({
        dateFrom: new Date(date),
        dateTo: new Date(date),
      });
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleTodayPress = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().split("T")[0]);
  };

  const handleViewToggle = () => {
    setCurrentView(currentView === "month" ? "list" : "month");
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
    <View style={styles.emptyState}>
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
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
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
  });

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
            <CalendarHeader
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onTodayPress={handleTodayPress}
            />
            <CalendarMonthView
              currentDate={currentDate}
              appointments={filteredAppointments}
              selectedDate={selectedDate}
              onDayPress={handleDayPress}
            />
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
