// screens/innerApplication/routeSheets/routeSheetScreen.tsx

import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { useRouteSheetStore } from "../../../store/routeSheetStore";
import { RouteSheetCard } from "./components/RouteSheetCard";
import { RouteSheetEmptyState } from "./components/RouteSheetEmptyState";

export const RouteSheetScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    filteredRouteSheets,
    isLoading,
    error,
    fetchRouteSheets,
    getCurrentMonthRouteSheet,
    clearError,
  } = useRouteSheetStore();

  useEffect(() => {
    fetchRouteSheets();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCreateNewRouteSheet = async () => {
    try {
      const currentSheet = await getCurrentMonthRouteSheet();
      if (currentSheet) {
        router.push(`./routes/edit/${currentSheet.id}`);
      }
    } catch (error) {
      console.error("Error creating route sheet:", error);
    }
  };

  const handleViewRouteSheet = (routeSheetId: string) => {
    router.push(`./routes/view/${routeSheetId}`);
  };

  const handleEditRouteSheet = (routeSheetId: string) => {
    router.push(`./routes/edit/${routeSheetId}`);
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Feuille de route"
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

        {/* Route Sheets List */}
        {filteredRouteSheets.length > 0 ? (
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
        ) : (
          <RouteSheetEmptyState onCreateNew={handleCreateNewRouteSheet} />
        )}
      </Animated.View>
    </SafeAreaView>
  );
};
