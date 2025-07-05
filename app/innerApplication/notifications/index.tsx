import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../../shared/components/ui/Header";

export default function NotificationsPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Notifications"
        rightIcons={[
          {
            icon: "ellipsis-v",
            onPress: () => console.log("Options"),
          },
        ]}
      />
      <View style={styles.content}>
        <Text style={styles.text}>Écran Notifications</Text>
        <Text style={styles.subtitle}>À développer...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2c2c2c",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
