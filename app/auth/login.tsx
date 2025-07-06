import React from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { LoginScreen } from "../../screens/auth/login/loginScreen";

const { height } = Dimensions.get("window");

export default function Login() {
  return (
    <View style={styles.container}>
      <View style={styles.purpleBackground} />
      <View style={styles.whiteBackground} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 3}
        >
          <LoginScreen />
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
});
