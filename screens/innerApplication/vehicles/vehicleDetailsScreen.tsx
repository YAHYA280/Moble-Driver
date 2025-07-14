// screens/innerApplication/vehicles/vehicleDetailsScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { MaintenanceRecord } from "../../../shared/types/vehicle";
import { useVehicleStore } from "../../../store/vehicleStore";
import { DocumentsSection } from "./components/DocumentsSection";
import { MaintenanceHistorySection } from "./components/MaintenanceHistorySection";
import { VehicleInfoCard } from "./components/VehicleInfoCard";

export const VehicleDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { selectedVehicle } = useVehicleStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!selectedVehicle) {
      router.back();
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [selectedVehicle]);

  if (!selectedVehicle) {
    return null;
  }

  const handleSeeAllMaintenance = () => {
    // Navigate to full maintenance history or show modal
    console.log("See all maintenance pressed");
  };

  const handleMaintenanceItemPress = (maintenance: MaintenanceRecord) => {
    // Navigate to maintenance details
    console.log("Maintenance item pressed:", maintenance);
  };

  const handleDocumentPress = (documentType: string) => {
    // Handle document action (view, download, etc.)
    console.log("Document pressed:", documentType);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails du véhicule"
      />

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Vehicle Information Card */}
          <VehicleInfoCard vehicle={selectedVehicle} />

          {/* Maintenance History Section */}
          <MaintenanceHistorySection
            maintenanceHistory={selectedVehicle.maintenanceHistory}
            onSeeAllPress={handleSeeAllMaintenance}
            onMaintenanceItemPress={handleMaintenanceItemPress}
          />

          {/* Documents Section */}
          <DocumentsSection onDocumentPress={handleDocumentPress} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
