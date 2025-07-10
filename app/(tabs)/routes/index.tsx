// app/(tabs)/routes/index.tsx
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";

export default function RoutesPage() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
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
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Feuille de route"
        rightIcons={[
          {
            icon: "home",
            onPress: () => router.push("/"),
          },
        ]}
      />
      <View style={styles.content}>
        <Text style={styles.text}>Écran Feuille de route</Text>
        <Text style={styles.subtitle}>À développer...</Text>
      </View>
    </SafeAreaView>
  );
}
