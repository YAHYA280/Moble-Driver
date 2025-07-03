import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../components/layout/Screen";
import { LoginForm } from "../../modules/auth/components/LoginForm";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  return (
    <Screen style={styles.container}>
      {/* Purple background header */}
      <View style={styles.header}>
        <View style={styles.statusBar}>
          <Text style={styles.time}>9:41</Text>
          <View style={styles.statusIcons}>
            <Ionicons name="cellular" size={16} color="white" />
            <Ionicons
              name="wifi"
              size={16}
              color="white"
              style={{ marginLeft: 4 }}
            />
            <Ionicons
              name="battery-full"
              size={16}
              color="white"
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>
      </View>

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
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#746cd4",
  },
  header: {
    backgroundColor: "#746cd4",
    height: 120,
    paddingTop: 20,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  time: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
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
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    minHeight: height * 0.8,
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
