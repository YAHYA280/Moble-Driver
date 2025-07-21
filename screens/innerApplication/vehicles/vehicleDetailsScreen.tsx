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

const AnimatedVehicleInfoCard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 200);

    return () => clearTimeout(timer);
  }, [animValue]);

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
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};

const AnimatedMaintenanceSection: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 400);

    return () => clearTimeout(timer);
  }, [animValue]);

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
      {children}
    </Animated.View>
  );
};

const AnimatedDocumentsSection: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 600);

    return () => clearTimeout(timer);
  }, [animValue]);

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
      {children}
    </Animated.View>
  );
};

export const VehicleDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { selectedVehicle } = useVehicleStore();
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!selectedVehicle) {
      router.back();
      return;
    }

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [selectedVehicle, headerAnim]);

  if (!selectedVehicle) {
    return null;
  }

  const handleSeeAllMaintenance = () => {};

  const handleMaintenanceItemPress = (maintenance: MaintenanceRecord) => {};

  const handleDocumentPress = (documentType: string) => {};

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
      {/* Animated Header - same pattern as vehicle home screen */}
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
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détails du véhicule"
        />
      </Animated.View>

      {/* Content with same animation pattern */}
      <Animated.View style={[styles.content, { opacity: headerAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Vehicle Information Card - keep original design, just add animation */}
          <AnimatedVehicleInfoCard>
            <VehicleInfoCard vehicle={selectedVehicle} />
          </AnimatedVehicleInfoCard>

          {/* Maintenance History Section - keep original design, just add animation */}
          <AnimatedMaintenanceSection>
            <MaintenanceHistorySection
              maintenanceHistory={selectedVehicle.maintenanceHistory}
              onSeeAllPress={handleSeeAllMaintenance}
              onMaintenanceItemPress={handleMaintenanceItemPress}
            />
          </AnimatedMaintenanceSection>

          {/* Documents Section - keep original design, just add animation */}
          <AnimatedDocumentsSection>
            <DocumentsSection onDocumentPress={handleDocumentPress} />
          </AnimatedDocumentsSection>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
