import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { useTheme } from "../../../contexts/ThemeContext";
import { Screen } from "../../../shared/components/layout/Screen";
import { LoginForm } from "./components/LoginForm";
import { LoginHeader } from "./components/LoginHeader";

const { height } = Dimensions.get("window");

export const LoginScreen: React.FC = () => {
  const { colors } = useTheme();

  const cardSlideAnim = useRef(new Animated.Value(50)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const keyboardOffsetAnim = useRef(new Animated.Value(0)).current;

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

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        const offset =
          Platform.OS === "ios"
            ? -keyboardHeight * 0.05
            : -keyboardHeight * 0.2;

        Animated.timing(keyboardOffsetAnim, {
          toValue: offset,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(keyboardOffsetAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <Screen style={styles.screenContainer} scrollable={false}>
        {/* Purple background header */}
        <View style={styles.header} />

        {/* Main animated card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardFadeAnim,
              transform: [
                { translateY: cardSlideAnim },
                { translateY: keyboardOffsetAnim },
              ],
            },
          ]}
        >
          <LoginHeader />
          <LoginForm />
        </Animated.View>
      </Screen>
    </KeyboardAvoidingView>
  );
};
