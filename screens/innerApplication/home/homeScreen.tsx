// screens/innerApplication/home/homeScreen.tsx - Updated notification navigation
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

  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
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
    router.push("/routes"); // Direct to tab route
  };

  const handleGeolocationPress = () => {
    router.push("/geolocation"); // Direct to tab route
  };

  const handlePlanningPress = () => {
    router.push("/(tabs)/planning");
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

          {/* Mon parc */}
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
              title="Mon parc"
              description="Suivez l'état et l'historique de vos véhicules en temps réel."
              icon="car"
              iconBackgroundColor="#64748b"
              backgroundColor={colors.card}
              onPress={handleVehiclesPress}
            />
          </Animated.View>

          {/* Mes documents */}
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
              title="Mes documents"
              description="Accédez à tous vos documents administratifs et justificatifs."
              icon="file-text"
              iconBackgroundColor="#22c55e"
              backgroundColor={colors.card}
              onPress={handleDocumentsPress}
            />
          </Animated.View>

          {/* Feuille de route */}
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
              title="Feuille de route"
              description="Visualisez vos trajets planifiés et vos missions du jour."
              icon="exclamation-triangle"
              iconBackgroundColor="#ef4444"
              backgroundColor={colors.card}
              onPress={handleRoutesPress}
            />
          </Animated.View>

          {/* Géolocalisation */}
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
              title="Géolocalisation"
              description="Suivez en direct la position de vos véhicules."
              icon="map-marker"
              iconBackgroundColor="#f59e0b"
              backgroundColor={colors.card}
              onPress={handleGeolocationPress}
            />
          </Animated.View>

          {/* Planning */}
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
