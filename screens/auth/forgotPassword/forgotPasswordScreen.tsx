import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";
import { Screen } from "../../../shared/components/layout/Screen";
import { Button } from "../../../shared/components/ui/Button";

const { height } = Dimensions.get("window");

export const ForgotPasswordScreen: React.FC = () => {
  const cardSlideAnim = useRef(new Animated.Value(50)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cardFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Screen style={styles.screenContainer} scrollable={false}>
      {/* Purple background header */}
      <View style={styles.header} />

      {/* Main animated card */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardFadeAnim,
            transform: [{ translateY: cardSlideAnim }],
          },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Mot de passe oublié</Text>
          <Text style={styles.subtitle}>Réinitialisez votre mot de passe</Text>

          <Text style={styles.comingSoon}>
            Cette fonctionnalité sera bientôt disponible
          </Text>

          <Button
            title="Retour à la connexion"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "transparent",
    flex: 1,
  },
  header: {
    backgroundColor: "transparent",
    height: 120,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fefeff",
    marginHorizontal: 30,
    marginTop: -50,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 40,
    shadowColor: "#746cd4",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(116, 108, 212, 0.05)",
    minHeight: height * 0.5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#212b36",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#81919a",
    textAlign: "center",
    marginBottom: 20,
  },
  comingSoon: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 30,
  },
});
