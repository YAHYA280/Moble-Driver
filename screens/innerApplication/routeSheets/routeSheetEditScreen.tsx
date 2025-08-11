// screens/innerApplication/routeSheets/routeSheetEditScreen.tsx

import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { useRouteSheetStore } from "../../../store/routeSheetStore";
import { RouteSheetCalendar } from "./components/RouteSheetCalendar";
import { RouteSheetDayModal } from "./components/RouteSheetDayModal";

export const RouteSheetEditScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const {
    routeSheets,
    currentRouteSheet,
    selectedDay,
    isLoading,
    error,
    isEditMode,
    fetchRouteSheets,
    getCurrentMonthRouteSheet,
    setEditMode,
    selectDay,
    clearError,
  } = useRouteSheetStore();

  const routeSheet =
    id && id !== "current"
      ? routeSheets.find((sheet) => sheet.id === id)
      : currentRouteSheet;

  const isCurrentMonth = () => {
    if (!routeSheet) return false;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    return routeSheet.month === currentMonth;
  };

  const canEdit = routeSheet?.status === "draft" && isCurrentMonth();

  const initializeRouteSheet = async () => {
    if (id === "current" || !id) {
      await getCurrentMonthRouteSheet();
    } else {
      await fetchRouteSheets();
    }
  };

  useEffect(() => {
    initializeRouteSheet();
  }, [id]);

  const handleDayPress = (date: string) => {
    if (!routeSheet) return;

    const day = routeSheet.days.find((d) => d.date === date);
    if (day) {
      selectDay(day);
      setSelectedDate(date);
      setShowDayModal(true);
    }
  };

  const handleEditModeToggle = () => {
    setEditMode(!isEditMode);
  };

  const handleSubmit = () => {
    // Handle submit logic
    if (routeSheet) {
      // Add submit logic here
      console.log("Submitting route sheet:", routeSheet.id);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    headerSection: {
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    actionsRow: {
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      flex: 1,
    },
    calendarSection: {
      flex: 1,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    helpText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    errorContainer: {
      margin: 16,
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.error + "15",
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.error,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
    },
  });

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Feuille de route"
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Réessayer"
            onPress={() => {
              clearError();
              initializeRouteSheet();
            }}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !routeSheet) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Feuille de route"
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title={routeSheet.monthName}
      />

      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{routeSheet.monthName}</Text>
          <Text style={styles.subtitle}>
            {routeSheet.status === "draft" ? "Brouillon" : "Soumise"} • Dernière
            modification:{" "}
            {new Date(routeSheet.lastModified).toLocaleDateString()}
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {routeSheet.totalKilometrage}
              </Text>
              <Text style={styles.statLabel}>km total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {routeSheet.days.filter((d) => d.isCompleted).length}
              </Text>
              <Text style={styles.statLabel}>jours saisis</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {routeSheet.completionPercentage}%
              </Text>
              <Text style={styles.statLabel}>progression</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <ConditionalComponent isValid={canEdit}>
              <Button
                title={isEditMode ? "Mode lecture" : "Modifier"}
                variant={isEditMode ? "outline" : "primary"}
                onPress={handleEditModeToggle}
                style={styles.actionButton}
              />
            </ConditionalComponent>

            <ConditionalComponent
              isValid={routeSheet.status === "draft" && canEdit}
            >
              <Button
                title="Soumettre"
                variant="secondary"
                onPress={handleSubmit}
                style={styles.actionButton}
              />
            </ConditionalComponent>
          </View>
        </View>

        {/* Calendar Section */}
        <ScrollView
          style={styles.calendarSection}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Calendrier de saisie</Text>
          <Text style={styles.helpText}>
            {canEdit && isEditMode
              ? "Touchez un jour pour saisir ou modifier les données de trajets."
              : "Consultez les jours déjà saisis (colorés en vert)."}
          </Text>

          <RouteSheetCalendar
            routeSheet={routeSheet}
            onDayPress={handleDayPress}
            readonly={!isEditMode || !canEdit}
          />
        </ScrollView>
      </View>

      {/* Day Edit Modal */}
      <RouteSheetDayModal
        visible={showDayModal}
        day={selectedDay}
        routeSheetId={routeSheet.id}
        readonly={!isEditMode || !canEdit}
        onClose={() => {
          setShowDayModal(false);
          selectDay(null);
        }}
      />
    </SafeAreaView>
  );
};
