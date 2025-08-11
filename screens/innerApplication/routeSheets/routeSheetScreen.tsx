// screens/innerApplication/routeSheets/routeSheetScreen.tsx - FIXED VERSION

import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { useRouteSheetStore } from "../../../store/routeSheetStore";
import { RouteSheetCard } from "./components/RouteSheetCard";
import { RouteSheetEmptyState } from "./components/RouteSheetEmptyState";

export const RouteSheetScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    filteredRouteSheets,
    isLoading,
    error,
    fetchRouteSheets,
    getCurrentMonthRouteSheet,
    clearError,
  } = useRouteSheetStore();

  useEffect(() => {
    // Initialize data loading
    const initializeData = async () => {
      try {
        console.log("Starting to fetch route sheets...");
        await fetchRouteSheets();
        console.log("Route sheets fetched successfully");
      } catch (error) {
        console.error("Error initializing route sheets:", error);
      }
    };

    initializeData();

    // Start animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fetchRouteSheets, fadeAnim]);

  // Debug: Log the current state
  useEffect(() => {
    console.log("RouteSheetScreen state:", {
      isLoading,
      error,
      filteredRouteSheetsCount: filteredRouteSheets.length,
    });
  }, [isLoading, error, filteredRouteSheets]);

  const handleCreateNewRouteSheet = async () => {
    try {
      console.log("Creating new route sheet...");
      const currentSheet = await getCurrentMonthRouteSheet();
      if (currentSheet) {
        console.log("Navigating to edit screen with sheet:", currentSheet.id);
        router.push(`/(tabs)/routes/edit/${currentSheet.id}`);
      }
    } catch (error) {
      console.error("Error creating route sheet:", error);
    }
  };

  const handleViewRouteSheet = (routeSheetId: string) => {
    console.log("Viewing route sheet:", routeSheetId);
    router.push(`/(tabs)/routes/view/${routeSheetId}`);
  };

  const handleEditRouteSheet = (routeSheetId: string) => {
    console.log("Editing route sheet:", routeSheetId);
    router.push(`/(tabs)/routes/edit/${routeSheetId}`);
  };

  const handleNotificationPress = () => {
    router.push("/(tabs)/notifications?returnTo=/(tabs)/routes");
  };

  const handleLogout = () => {
    // Add logout logic here
    router.replace("/auth/login");
  };

  // Sidebar menu items with route sheet specific items
  const sidebarItems = [
    {
      id: "add-route",
      label: "Ajouter une feuille de route",
      icon: "plus" as const,
      onPress: () => {
        setShowSidebar(false);
        handleCreateNewRouteSheet();
      },
    },
    {
      id: "my-routes",
      label: "Mes feuilles de route",
      icon: "exclamation-triangle" as const,
      onPress: () => {
        setShowSidebar(false);
      },
      isActive: true,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    headerSection: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    createButton: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    routeSheetsList: {
      gap: 12,
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
      paddingVertical: 60,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
    },
    debugContainer: {
      backgroundColor: colors.surface,
      padding: 16,
      margin: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    debugText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
  });

  // Debug information component
  const DebugInfo = () => (
    <View style={styles.debugContainer}>
      <Text style={styles.debugText}>Debug Info:</Text>
      <Text style={styles.debugText}>Loading: {isLoading.toString()}</Text>
      <Text style={styles.debugText}>Error: {error || "none"}</Text>
      <Text style={styles.debugText}>
        Filtered Route Sheets: {filteredRouteSheets.length}
      </Text>
      <Text style={styles.debugText}>
        Route Sheets Data:{" "}
        {JSON.stringify(
          filteredRouteSheets.map((sheet) => ({
            id: sheet.id,
            monthName: sheet.monthName,
            status: sheet.status,
          })),
          null,
          2
        )}
      </Text>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "bars",
            onPress: () => setShowSidebar(true),
          }}
          title="Feuille de route"
          rightIcons={[
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 3,
            },
          ]}
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
        <Sidebar
          visible={showSidebar}
          onClose={() => setShowSidebar(false)}
          items={sidebarItems}
          onLogout={handleLogout}
          title="Menu"
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "bars",
            onPress: () => setShowSidebar(true),
          }}
          title="Feuille de route"
          rightIcons={[
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 3,
            },
          ]}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Chargement des feuilles de route...
          </Text>
        </View>
        <Sidebar
          visible={showSidebar}
          onClose={() => setShowSidebar(false)}
          items={sidebarItems}
          onLogout={handleLogout}
          title="Menu"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "bars",
          onPress: () => setShowSidebar(true),
        }}
        title="Feuille de route"
        rightIcons={[
          {
            icon: "bell",
            onPress: handleNotificationPress,
            badge: 3,
          },
        ]}
      />

      <Animated.View style={[styles.content]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Gestion des feuilles de route</Text>
            <Text style={styles.subtitle}>
              Créez et consultez vos feuilles de route mensuelles
            </Text>

            <Button
              title="+ Créer/Modifier feuille du mois"
              onPress={handleCreateNewRouteSheet}
              style={styles.createButton}
            />
          </View>

          {/* Debug Information - Remove this in production */}
          {__DEV__ && <DebugInfo />}

          {/* Route Sheets List */}
          <ConditionalComponent
            isValid={filteredRouteSheets.length > 0}
            defaultComponent={
              <RouteSheetEmptyState onCreateNew={handleCreateNewRouteSheet} />
            }
          >
            <View>
              <Text style={styles.sectionTitle}>Vos feuilles de route</Text>
              <View style={styles.routeSheetsList}>
                {filteredRouteSheets.map((routeSheet) => (
                  <RouteSheetCard
                    key={routeSheet.id}
                    routeSheet={routeSheet}
                    onView={() => handleViewRouteSheet(routeSheet.id)}
                    onEdit={() => handleEditRouteSheet(routeSheet.id)}
                  />
                ))}
              </View>
            </View>
          </ConditionalComponent>
        </ScrollView>
      </Animated.View>

      <Sidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        items={sidebarItems}
        onLogout={handleLogout}
        title="Feuille de route"
      />
    </SafeAreaView>
  );
};
