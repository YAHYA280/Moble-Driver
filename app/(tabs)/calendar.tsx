import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Calendar Screen</Text>
      <Text style={styles.subtitle}>Events & Scheduling</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefeff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212b36",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 10,
  },
});
