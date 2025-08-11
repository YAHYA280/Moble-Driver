// screens/innerApplication/routeSheets/routeSheetViewScreen.tsx

import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { useRouteSheetStore } from "../../../store/routeSheetStore";
import { RouteSheetCalendar } from "./components/RouteSheetCalendar";
import { RouteSheetDayModal } from "./components/RouteSheetDayModal";
import { RouteSheetStats } from "./components/RouteSheetStats";

export const RouteSheetViewScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showDayModal, setShowDayModal] = React.useState(false);

  const {
    routeSheets,
    selectedDay,
    isLoading,
    error,
    fetchRouteSheets,
    selectDay,
    clearError,
  } = useRouteSheetStore();

  useEffect(() => {
    if (!routeSheets.length) {
      fetchRouteSheets();
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const routeSheet = routeSheets.find((sheet) => sheet.id === id);

  const handleDayPress = (date: string) => {
    if (!routeSheet) return;

    const day = routeSheet.days.find((d) => d.date === date);
    if (day && day.isCompleted) {
      selectDay(day);
      setShowDayModal(true);
    }
  };

  const getStatusBadgeStyle = () => {
    if (!routeSheet) return {};

    switch (routeSheet.status) {
      case "draft":
        return {
          backgroundColor: colors.warning + "20",
          borderColor: colors.warning,
          color: colors.warning,
        };
      case "submitted":
        return {
          backgroundColor: colors.success + "20",
          borderColor: colors.success,
          color: colors.success,
        };
      case "archived":
        return {
          backgroundColor: colors.textTertiary + "20",
          borderColor: colors.textTertiary,
          color: colors.textTertiary,
        };
      default:
        return {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
          color: colors.textSecondary,
        };
    }
  };

  const getStatusLabel = () => {
    if (!routeSheet) return "";

    switch (routeSheet.status) {
      case "draft":
        return "Brouillon";
      case "submitted":
        return "Soumise";
      case "archived":
        return "Archivée";
      default:
        return "Inconnu";
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
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      ...getStatusBadgeStyle(),
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      ...getStatusBadgeStyle(),
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    scrollContent: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
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
    emptyStateContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 24,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    emptySubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
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
              fetchRouteSheets();
            }}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
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

  if (!routeSheet) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Feuille de route"
        />
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Feuille de route introuvable</Text>
          <Text style={styles.emptySubtitle}>
            Cette feuille de route n'existe pas ou a été supprimée.
          </Text>
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
        title="Consultation"
        rightIcons={[
          {
            icon: "home",
            onPress: () => router.push("/"),
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{routeSheet.monthName}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{getStatusLabel()}</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>
            Créée le{" "}
            {new Date(routeSheet.createdAt).toLocaleDateString("fr-FR")}
            {routeSheet.submittedAt &&
              ` • Soumise le ${new Date(
                routeSheet.submittedAt
              ).toLocaleDateString("fr-FR")}`}
          </Text>

          {/* Stats Section */}
          <RouteSheetStats routeSheet={routeSheet} />
        </View>

        {/* Calendar Section */}
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Calendrier de saisie</Text>
            <Text style={styles.helpText}>
              Consultez les données saisies en touchant les jours colorés en
              vert.
            </Text>

            <RouteSheetCalendar
              routeSheet={routeSheet}
              onDayPress={handleDayPress}
              readonly={true}
            />
          </View>
        </ScrollView>
      </Animated.View>

      {/* Day View Modal */}
      <RouteSheetDayModal
        visible={showDayModal}
        day={selectedDay}
        routeSheetId={routeSheet.id}
        readonly={true}
        onClose={() => {
          setShowDayModal(false);
          selectDay(null);
        }}
      />
    </SafeAreaView>
  );
};
