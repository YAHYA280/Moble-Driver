import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>User Information</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Name: John Doe</Text>
        <Text style={styles.info}>Email: Loisbecket@gmail.com</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefeff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212b36",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666",
    marginBottom: 30,
  },
  infoContainer: {
    alignItems: "center",
  },
  info: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
});
