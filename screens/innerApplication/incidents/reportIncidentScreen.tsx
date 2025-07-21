import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { useAuthStore } from "../../../store/authStore";
import { useIncidentStore } from "../../../store/incidentStore";

import { ReportIncidentForm } from "./components/ReportIncidentForm";

export const ReportIncidentScreen: React.FC = () => {
  const { colors } = useTheme();

  const { error, clearError } = useIncidentStore();
  const { logout } = useAuthStore();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    clearError();
  }, [headerAnim, clearError]);

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          setShowSidebar(false);
          logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const sidebarItems = [
    {
      id: "vehicles",
      label: "Liste véhicule",
      icon: "car" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/(tabs)/vehicles");
      },
      isActive: false,
    },
    {
      id: "incidents",
      label: "Créer Incidents",
      icon: "exclamation-triangle" as const,
      onPress: () => {
        setShowSidebar(false);
      },
      isActive: true,
    },
    {
      id: "history",
      label: "Liste des incidents",
      icon: "history" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/(tabs)/incidents/history");
      },
      isActive: false,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    errorContainer: {
      backgroundColor: colors.error + "15",
      margin: 16,
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "500",
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: Platform.select({
        ios: 120,
        android: 100,
        default: 120,
      }),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}
      >
        <Header
          leftIcon={{
            icon: "bars",
            onPress: () => setShowSidebar(true),
          }}
          title="Incident"
        />
      </Animated.View>

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Main Content with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.scrollContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View
          style={[styles.scrollContainer, { opacity: headerAnim }]}
        >
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <ReportIncidentForm />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Sidebar */}
      <Sidebar
        title="Incidents"
        items={sidebarItems}
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};
