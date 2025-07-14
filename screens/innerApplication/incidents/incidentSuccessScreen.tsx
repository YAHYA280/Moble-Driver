// screens/innerApplication/incidents/incidentSuccessScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";

const AnimatedSuccessContent: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(animValue, {
        toValue: 1,
        tension: 50,
        friction: 8,
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
            scale: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
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

export const IncidentSuccessScreen: React.FC = () => {
  const { colors } = useTheme();
  const containerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start container animation
    Animated.timing(containerAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [containerAnim]);

  const handleViewReports = () => {
    router.push("/(tabs)/incidents/history");
  };

  const handleBackToVehicles = () => {
    router.push("/(tabs)/vehicles");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    checkIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.success,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      ...Platform.select({
        ios: {
          shadowColor: colors.success,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
        },
        android: {
          elevation: 12,
        },
        web: {
          boxShadow: `0 8px 16px ${colors.success}40`,
        },
      }),
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 12,
      letterSpacing: 0.3,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 32,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      width: "100%",
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 12,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    buttonsContainer: {
      width: "100%",
      gap: 16,
    },
    primaryButton: {
      marginBottom: 0,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: containerAnim,
          },
        ]}
      >
        {/* Success Icon */}
        <AnimatedSuccessContent delay={200}>
          <View style={styles.checkIconContainer}>
            <FontAwesome name="check" size={32} color="white" />
          </View>
        </AnimatedSuccessContent>

        {/* Title and Subtitle */}
        <AnimatedSuccessContent delay={400}>
          <Text style={styles.title}>
            Votre signalement a bien été enregistré
          </Text>
          <Text style={styles.subtitle}>
            Nous vous tiendrons informé dès qu&apos;une action sera entreprise.
          </Text>
        </AnimatedSuccessContent>

        {/* Info Card */}
        <AnimatedSuccessContent delay={600}>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Vous recevrez une notification dès que votre signalement sera pris
              en charge par notre équipe technique.
            </Text>
          </View>
        </AnimatedSuccessContent>

        {/* Action Buttons */}
        <AnimatedSuccessContent delay={800}>
          <View style={styles.buttonsContainer}>
            <Button
              title="Consulter mes signalements"
              onPress={handleViewReports}
              style={styles.primaryButton}
            />
            <Button
              title="Retourner à la liste des véhicules"
              onPress={handleBackToVehicles}
              variant="outline"
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
          </View>
        </AnimatedSuccessContent>
      </Animated.View>
    </SafeAreaView>
  );
};
