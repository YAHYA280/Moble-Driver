import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../../shared/components/ui/Header";
import { HomeCard } from "./components/homeCard";

export const HomeScreen: React.FC = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Animation des cartes avec délai échelonné
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Animation du header
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

    // Animation des cartes avec délai échelonné
    const cardAnimationSequence = cardAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100, // Délai de 100ms entre chaque carte
        useNativeDriver: true,
      })
    );

    // Démarrer les animations des cartes après un court délai
    setTimeout(() => {
      Animated.parallel(cardAnimationSequence).start();
    }, 300);
  }, []);

  // Fonctions de navigation
  const handleNotificationPress = () => {
    router.push("/innerApplication/notifications");
  };

  const handlePayslipsPress = () => {
    router.push("/innerApplication/payslips");
  };

  const handleVehiclesPress = () => {
    router.push("/innerApplication/vehicles");
  };

  const handleDocumentsPress = () => {
    router.push("/innerApplication/documents");
  };

  const handleRoutesPress = () => {
    router.push("/innerApplication/routes");
  };

  const handleGeolocationPress = () => {
    router.push("/innerApplication/geolocation");
  };

  const handlePlanningPress = () => {
    router.push("/innerApplication/planning");
  };

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
        <Header
          title="Menu des options"
          rightIcons={[
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 1,
              color: "#2c2c2c",
            },
          ]}
          backgroundColor="#fefeff"
          style={styles.header}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    zIndex: 10,
  },
  header: {
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "#f8f9fa",
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
  fabContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
