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
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
      position: "relative",
    },
    checkIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 40,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
        },
        android: {
          elevation: 12,
        },
        web: {
          boxShadow: `0 8px 16px ${colors.primary}40`,
        },
      }),
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 16,
      letterSpacing: 0.3,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 48,
    },
    buttonsContainer: {
      width: "100%",
      gap: 16,
    },
    primaryButton: {
      marginBottom: 0,
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.text,
    },
    floatingShapes: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
    shape: {
      position: "absolute",
      borderRadius: 50,
      opacity: 0.1,
    },
    shape1: {
      width: 20,
      height: 20,
      backgroundColor: colors.primary,
      top: "15%",
      left: "20%",
    },
    shape2: {
      width: 15,
      height: 15,
      backgroundColor: colors.success,
      top: "25%",
      right: "15%",
    },
    shape3: {
      width: 25,
      height: 25,
      backgroundColor: colors.warning,
      top: "60%",
      left: "10%",
    },
    shape4: {
      width: 18,
      height: 18,
      backgroundColor: colors.primary,
      top: "70%",
      right: "25%",
    },
    shape5: {
      width: 12,
      height: 12,
      backgroundColor: colors.error,
      top: "35%",
      left: "80%",
    },
    shape6: {
      width: 22,
      height: 22,
      backgroundColor: colors.info,
      top: "80%",
      left: "60%",
    },
    triangle: {
      position: "absolute",
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderStyle: "solid",
      opacity: 0.08,
    },
    triangle1: {
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderBottomWidth: 14,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: colors.primary,
      top: "20%",
      right: "30%",
    },
    triangle2: {
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderBottomWidth: 10,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: colors.success,
      top: "75%",
      left: "25%",
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
        {/* Floating Background Shapes */}
        <View style={styles.floatingShapes}>
          <View style={[styles.shape, styles.shape1]} />
          <View style={[styles.shape, styles.shape2]} />
          <View style={[styles.shape, styles.shape3]} />
          <View style={[styles.shape, styles.shape4]} />
          <View style={[styles.shape, styles.shape5]} />
          <View style={[styles.shape, styles.shape6]} />
          <View style={[styles.triangle, styles.triangle1]} />
          <View style={[styles.triangle, styles.triangle2]} />
        </View>

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

        {/* Action Buttons */}
        <AnimatedSuccessContent delay={600}>
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
