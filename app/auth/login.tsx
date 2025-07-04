import React from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Screen } from "../../components/layout/Screen";
import { LoginForm } from "../../modules/auth/components/LoginForm";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* 50% Purple background */}
      <View style={styles.purpleBackground} />

      {/* 50% White background */}
      <View style={styles.whiteBackground} />

      {/* Content overlay with keyboard handling */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <Screen style={styles.screenContainer}>
            {/* Purple background header */}
            <View style={styles.header}></View>

            {/* Main card */}
            <View style={styles.card}>
              {/* Logo placeholder */}
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Text style={styles.logoText}>LOGO</Text>
                </View>
              </View>

              <LoginForm />
            </View>
          </Screen>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  purpleBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: "#746cd4",
  },
  whiteBackground: {
    position: "absolute",
    top: height * 0.5,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
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
    shadowRadius: 10,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(116, 108, 212, 0.05)",
    minHeight: height * 0.7,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "#f0f0f0",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
});
