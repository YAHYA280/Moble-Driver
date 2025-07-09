import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Platform, StyleSheet, View } from "react-native";

import { useTheme } from "../../../contexts/ThemeContext";
import { Screen } from "../../../shared/components/layout/Screen";
import { LoginForm } from "./components/LoginForm";
import { LoginHeader } from "./components/LoginHeader";

const { height } = Dimensions.get("window");

export const LoginScreen: React.FC = () => {
  const { colors } = useTheme();

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
      backgroundColor: colors.card,
      marginHorizontal: 30,
      marginTop: -50,
      borderRadius: 24,
      paddingHorizontal: 24,
      paddingVertical: 40,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 15,
      borderWidth: 1,
      borderColor: colors.isDark ? colors.border : "rgba(116, 108, 212, 0.05)",
      minHeight: Platform.OS === "ios" ? height * 0.7 : height * 0.8,
    },
  });

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
        <LoginHeader />
        <LoginForm />
      </Animated.View>
    </Screen>
  );
};
