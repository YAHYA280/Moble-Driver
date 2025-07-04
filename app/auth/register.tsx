import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../../shared/components/layout/Screen";
import { Button } from "../../shared/components/ui/Button";

export default function RegisterScreen() {
  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        <Button
          title="Back to Login"
          onPress={() => router.back()}
          variant="outline"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#746cd4",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 30,
  },
});
