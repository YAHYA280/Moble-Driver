import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_COLORS,
  Appointment,
} from "../../../shared/types/calendar";
import { useCalendarStore } from "../../../store/calendarStore";
import { CALENDAR_CONFIG, LAYOUT_CONFIG } from "./constants/calendarConstants";
import { formatDate, formatTime, getWeekDays } from "./utils/calendarUtils";

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    weekContainer: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      paddingVertical: 8,
      paddingHorizontal: 4,
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 12,
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
    dayItem: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 8,
    },
    selectedDayItem: {
      backgroundColor: colors.primary,
    },
    dayName: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    selectedDayName: {
      color: "#ffffff",
    },
    dayNumber: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    selectedDayNumber: {
      color: "#ffffff",
    },
    agendaContainer: {
      flex: 1,
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 16,
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
    agendaHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    agendaTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    agendaSubtitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    menuButton: {
      width: LAYOUT_CONFIG.MENU_BUTTON_SIZE,
      height: LAYOUT_CONFIG.MENU_BUTTON_SIZE,
      borderRadius: LAYOUT_CONFIG.MENU_BUTTON_SIZE / 2,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    appointmentsList: {
      flex: 1,
      paddingBottom: 20,
    },
    appointmentItem: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "20",
    },
    timeContainer: {
      width: LAYOUT_CONFIG.TIME_CONTAINER_WIDTH,
      alignItems: "flex-start",
      paddingTop: 4,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    timeSubText: {
      fontSize: 12,
      fontWeight: "400",
      color: colors.textSecondary,
      marginTop: 2,
    },
    appointmentCard: {
      flex: 1,
      marginLeft: 16,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    appointmentTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    appointmentLocation: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    appointmentLocationText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginLeft: 4,
    },
    appointmentContact: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    appointmentContactText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    appointmentStatus: {
      flexDirection: "row",
      alignItems: "center",
    },
    appointmentStatusIcon: {
      marginRight: 4,
    },
    appointmentStatusText: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    menuIcon: {
      alignSelf: "flex-end",
      marginTop: -8,
      marginRight: -8,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyIcon: {
      fontSize: LAYOUT_CONFIG.EMPTY_ICON_SIZE,
      marginBottom: 16,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

export const AgendaViewScreen: React.FC = () => {
  const { colors } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { getAppointmentsForDate, selectAppointment, isLoading } =
    useCalendarStore();

  const appointments = date ? getAppointmentsForDate(date) : [];

  // Get styles with current theme colors
  const styles = createStyles(colors);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: CALENDAR_CONFIG.ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleAppointmentPress = (appointment: Appointment) => {
    selectAppointment(appointment);
    router.push(`/(tabs)/calendar/appointment/${appointment.id}`);
  };

  const weekDays = date ? getWeekDays(date) : [];
  const selectedDateFormatted = date
    ? formatDate(date)
    : { day: "", dayName: "" };

  const renderAppointment = (appointment: Appointment, index: number) => {
    const typeColor = APPOINTMENT_TYPE_COLORS[appointment.type];
    const startTime = formatTime(appointment.startTime);
    const endTime = formatTime(appointment.endTime);

    return (
      <TouchableOpacity
        key={appointment.id}
        style={styles.appointmentItem}
        onPress={() => handleAppointmentPress(appointment)}
        activeOpacity={0.7}
      >
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{startTime}</Text>
          <Text style={styles.timeSubText}>{endTime}</Text>
        </View>

        <View
          style={[
            styles.appointmentCard,
            {
              backgroundColor: typeColor + "15",
              borderLeftColor: typeColor,
            },
          ]}
        >
          <View style={styles.menuIcon}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handleAppointmentPress(appointment)}
            >
              <FontAwesome
                name="ellipsis-v"
                size={14}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.appointmentTitle, { color: typeColor }]}>
            {appointment.title}
          </Text>

          <View style={styles.appointmentLocation}>
            <FontAwesome
              name="building"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={styles.appointmentLocationText}>
              {appointment.center?.name || appointment.location}
            </Text>
          </View>

          <ConditionalComponent isValid={!!appointment.contact}>
            <View style={styles.appointmentContact}>
              <FontAwesome name="user" size={12} color={colors.textSecondary} />
              <Text style={styles.appointmentContactText}>
                {appointment.contact?.name}
              </Text>
            </View>
          </ConditionalComponent>

          <View style={styles.appointmentStatus}>
            <FontAwesome
              name="circle"
              size={8}
              color={typeColor}
              style={styles.appointmentStatusIcon}
            />
            <Text style={styles.appointmentStatusText}>
              {APPOINTMENT_STATUS_LABELS[appointment.status]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Agenda du jour"
        rightIcons={[
          {
            icon: "calendar",
            onPress: () => router.back(),
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Week days navigation */}
        <View style={styles.weekContainer}>
          {weekDays.map((day, index) => {
            const dayFormatted = formatDate(day.toISOString().split("T")[0]);
            const isSelected = day.toISOString().split("T")[0] === date;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayItem, isSelected && styles.selectedDayItem]}
                onPress={() => {
                  const newDate = day.toISOString().split("T")[0];
                  router.setParams({ date: newDate });
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.dayName, isSelected && styles.selectedDayName]}
                >
                  {dayFormatted.dayName}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.selectedDayNumber,
                  ]}
                >
                  {dayFormatted.day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Agenda container */}
        <View style={styles.agendaContainer}>
          <View style={styles.agendaHeader}>
            <View>
              <Text style={styles.agendaTitle}>Heure</Text>
            </View>
            <View>
              <Text style={styles.agendaSubtitle}>Rendez-vous</Text>
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <FontAwesome
                name="ellipsis-v"
                size={14}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.appointmentsList}
            showsVerticalScrollIndicator={false}
          >
            <ConditionalComponent
              isValid={appointments.length > 0}
              defaultComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📅</Text>
                  <Text style={styles.emptyTitle}>Aucun rendez-vous</Text>
                  <Text style={styles.emptyText}>
                    Vous n&apos;avez aucun rendez-vous prévu pour cette date.
                  </Text>
                </View>
              }
            >
              {appointments.map((appointment, index) =>
                renderAppointment(appointment, index)
              )}
            </ConditionalComponent>
          </ScrollView>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};
