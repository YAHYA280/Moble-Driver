// screens/innerApplication/home/homeScreen.tsx - UPDATED with Mes Demandes

import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { HomeCard } from "./components/homeCard";
import { HomeHeader } from "./components/homeHeader";

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Updated to include 7 cards (added Mes demandes)
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0), // Added for Mes demandes
  ]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const cardAnimationSequence = cardAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    setTimeout(() => {
      Animated.parallel(cardAnimationSequence).start();
    }, 300);
  }, []);

  const handleNotificationPress = () => {
    // Pass the return route to notifications
    router.push("/notifications?returnTo=/(tabs)");
  };

  const handlePayslipsPress = () => {
    router.push("/payslips"); // Direct to tab route
  };

  const handleVehiclesPress = () => {
    router.push("/vehicles"); // Direct to tab route
  };

  const handleDocumentsPress = () => {
    router.push("/documents"); // Direct to tab route
  };

  const handleRoutesPress = () => {
    // Navigate to the correct route sheets screen
    router.push("/(tabs)/routes");
  };

  const handleGeolocationPress = () => {
    router.push("/geolocation");
  };

  const handlePlanningPress = () => {
    router.push("/(tabs)/planning");
  };

  // NEW: Handler for Mes demandes
  const handleDemandesPress = () => {
    router.push("/(tabs)/demandes");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    headerContainer: {
      zIndex: 10,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    cardsContainer: {
      paddingTop: 8,
      paddingBottom: 16,
    },
    cardWrapper: {
      // Wrapper pour les animations des cartes
    },
    bottomSpacing: {
      height: 80,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec animation */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <HomeHeader
          title="Menu des options"
          rightIcons={[
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 3,
              color: colors.icon,
            },
          ]}
        />
      </Animated.View>

      {/* Contenu scrollable */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardsContainer}>
          {/* Bulletin de paie */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[0],
                transform: [
                  {
                    translateY: cardAnimations[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Bulletin de paie"
              description="Consultez et téléchargez vos bulletins de paie en un clic."
              icon="credit-card"
              iconBackgroundColor="#6366f1"
              backgroundColor={colors.card}
              onPress={handlePayslipsPress}
            />
          </Animated.View>

          {/* NEW: Mes demandes - Added as second card */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[1],
                transform: [
                  {
                    translateY: cardAnimations[1].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Mes demandes"
              description="Gérez vos demandes de congé, arrêts maladie et absences."
              icon="clipboard"
              iconBackgroundColor="#8b5cf6"
              backgroundColor={colors.card}
              onPress={handleDemandesPress}
            />
          </Animated.View>

          {/* Mon parc - Updated animation index */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[2],
                transform: [
                  {
                    translateY: cardAnimations[2].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Mon parc"
              description="Suivez l'état et l'historique de vos véhicules en temps réel."
              icon="car"
              iconBackgroundColor="#64748b"
              backgroundColor={colors.card}
              onPress={handleVehiclesPress}
            />
          </Animated.View>

          {/* Mes documents - Updated animation index */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[3],
                transform: [
                  {
                    translateY: cardAnimations[3].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Mes documents"
              description="Accédez à tous vos documents administratifs et justificatifs."
              icon="file-text"
              iconBackgroundColor="#22c55e"
              backgroundColor={colors.card}
              onPress={handleDocumentsPress}
            />
          </Animated.View>

          {/* Feuille de route - Updated animation index */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[4],
                transform: [
                  {
                    translateY: cardAnimations[4].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Feuille de route"
              description="Visualisez vos trajets planifiés et vos missions du jour."
              icon="exclamation-triangle"
              iconBackgroundColor="#ef4444"
              backgroundColor={colors.card}
              onPress={handleRoutesPress}
            />
          </Animated.View>

          {/* Géolocalisation - Updated animation index */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[5],
                transform: [
                  {
                    translateY: cardAnimations[5].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Géolocalisation"
              description="Suivez en direct la position de vos véhicules."
              icon="map-marker"
              iconBackgroundColor="#f59e0b"
              backgroundColor={colors.card}
              onPress={handleGeolocationPress}
            />
          </Animated.View>

          {/* Planning - Updated animation index */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[6],
                transform: [
                  {
                    translateY: cardAnimations[6].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Planning"
              description="Consultez et gérez votre emploi du temps facilement."
              icon="calendar"
              iconBackgroundColor="#06b6d4"
              backgroundColor={colors.card}
              onPress={handlePlanningPress}
            />
          </Animated.View>
        </View>

        {/* Espacement pour le floating action button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};
