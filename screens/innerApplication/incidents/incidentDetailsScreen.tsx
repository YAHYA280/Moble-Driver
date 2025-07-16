import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { useIncidentStore } from "../../../store/incidentStore";
import { IncidentCommentsSection } from "./components/IncidentCommentsSection";
import { IncidentDetailsCard } from "./components/IncidentDetailsCard";
import { IncidentStatusCard } from "./components/IncidentStatusCard";
import { IncidentVehicleCard } from "./components/IncidentVehicleCard";

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [animValue, delay]);

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

export const IncidentDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { selectedIncident } = useIncidentStore();
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!selectedIncident) {
      router.back();
      return;
    }

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [selectedIncident, headerAnim]);

  if (!selectedIncident) {
    return null;
  }

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
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détails de l'incident"
        />
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: headerAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Incident Details Card */}
          <AnimatedSection delay={200}>
            <IncidentDetailsCard incident={selectedIncident} />
          </AnimatedSection>

          {/* Status Card */}
          <AnimatedSection delay={400}>
            <IncidentStatusCard incident={selectedIncident} />
          </AnimatedSection>

          {/* Vehicle Information Card */}
          <AnimatedSection delay={600}>
            <IncidentVehicleCard incident={selectedIncident} />
          </AnimatedSection>

          {/* Comments and Reviews Section */}
          <AnimatedSection delay={800}>
            <IncidentCommentsSection incident={selectedIncident} />
          </AnimatedSection>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
