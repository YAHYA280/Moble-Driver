import { LogoVSN } from "@/shared/components/ui/logoVSN";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";

export const LoginHeader: React.FC = () => {
  const { colors } = useTheme();

  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(titleFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 300);
  }, []);

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      marginBottom: 40,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    titleSection: {
      alignItems: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    subtitleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    link: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoFadeAnim,
            transform: [{ scale: logoScaleAnim }],
          },
        ]}
      >
        <View style={styles.logo}>
          <LogoVSN width={129} height={116} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.titleSection,
          {
            opacity: titleFadeAnim,
          },
        ]}
      >
        <Text style={styles.title}>Connexion</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Pas encore de compte ? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={styles.link}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};
