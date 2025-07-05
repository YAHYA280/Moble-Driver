import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../../shared/components/ui/Header";
import { HomeCard } from "./components/homeCard";

export const HomeScreen: React.FC = () => {
  // Fonctions de navigation
  const handleMenuPress = () => {
    // Logique pour ouvrir le menu/drawer
    console.log("Menu pressed");
  };

  const handleNotificationPress = () => {
    router.push("./");
  };

  const handlePayslipsPress = () => {
    router.push("./");
  };

  const handleVehiclesPress = () => {
    router.push("./");
  };

  const handleDocumentsPress = () => {
    router.push("./");
  };

  const handleRoutesPress = () => {
    router.push("./");
  };

  const handleGeolocationPress = () => {
    router.push("./");
  };

  const handlePlanningPress = () => {
    router.push("./");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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

      {/* Contenu scrollable */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardsContainer}>
          {/* Bulletin de paie */}
          <HomeCard
            title="Bulletin de paie"
            description="Consultez et téléchargez vos bulletins de paie en un clic."
            icon="credit-card"
            iconBackgroundColor="#6366f1"
            onPress={handlePayslipsPress}
          />

          {/* Mon parc */}
          <HomeCard
            title="Mon parc"
            description="Suivez l'état et l'historique de vos véhicules en temps réel."
            icon="car"
            iconBackgroundColor="#64748b"
            onPress={handleVehiclesPress}
          />

          {/* Mes documents */}
          <HomeCard
            title="Mes documents"
            description="Accédez à tous vos documents administratifs et justificatifs."
            icon="file-text"
            iconBackgroundColor="#22c55e"
            onPress={handleDocumentsPress}
          />

          {/* Feuille de route */}
          <HomeCard
            title="Feuille de route"
            description="Visualisez vos trajets planifiés et vos missions du jour."
            icon="exclamation-triangle"
            iconBackgroundColor="#ef4444"
            onPress={handleRoutesPress}
          />

          {/* Géolocalisation */}
          <HomeCard
            title="Géolocalisation"
            description="Suivez en direct la position de vos véhicules."
            icon="map-marker"
            iconBackgroundColor="#f59e0b"
            onPress={handleGeolocationPress}
          />

          {/* Planning */}
          <HomeCard
            title="Planning"
            description="Consultez et gérez votre emploi du temps facilement."
            icon="calendar"
            iconBackgroundColor="#06b6d4"
            onPress={handlePlanningPress}
          />
        </View>

        {/* Espacement pour le floating action button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <View style={styles.fab}>
          <FontAwesome name="home" size={24} color="#ffffff" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    borderBottomWidth: 0,
    elevation: 1,
    shadowOpacity: 0.08,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espace pour le FAB
  },
  cardsContainer: {
    paddingTop: 16,
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
