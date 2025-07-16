// screens/innerApplication/profile/profileSettingsScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Alert, Animated, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { useProfileStore } from "../../../store/profileStore";
import { ProfileMenuItem } from "./components/ProfileMenuItem";

export const ProfileSettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { profile, updateAccountSettings } = useProfileStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLanguagePress = () => {
    // Navigate to language selection screen
    router.push("./(tabs)/profile/language");
  };

  const handleNotificationPress = () => {
    Alert.alert(
      "Notifications par e-mail",
      `Les notifications par e-mail sont actuellement ${
        profile?.accountSettings.emailNotifications ? "activées" : "désactivées"
      }`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: profile?.accountSettings.emailNotifications
            ? "Désactiver"
            : "Activer",
          onPress: () => {
            updateAccountSettings({
              emailNotifications: !profile?.accountSettings.emailNotifications,
            });
          },
        },
      ]
    );
  };

  const handleSMSPress = () => {
    Alert.alert(
      "Notifications par SMS",
      `Les notifications par SMS sont actuellement ${
        profile?.accountSettings.smsNotifications ? "activées" : "désactivées"
      }`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: profile?.accountSettings.smsNotifications
            ? "Désactiver"
            : "Activer",
          onPress: () => {
            updateAccountSettings({
              smsNotifications: !profile?.accountSettings.smsNotifications,
            });
          },
        },
      ]
    );
  };

  const handleDarkModePress = () => {
    updateAccountSettings({
      darkMode: !profile?.accountSettings.darkMode,
    });
  };

  const handlePasswordPress = () => {
    router.push("./(tabs)/profile/change-password");
  };

  const handleBiometricPress = () => {
    Alert.alert(
      "Connexion biométrique",
      `La connexion biométrique est actuellement ${
        profile?.accountSettings.biometricAuth ? "activée" : "désactivée"
      }`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: profile?.accountSettings.biometricAuth
            ? "Désactiver"
            : "Activer",
          onPress: () => {
            updateAccountSettings({
              biometricAuth: !profile?.accountSettings.biometricAuth,
            });
          },
        },
      ]
    );
  };

  const handleSessionsPress = () => {
    Alert.alert(
      "Gestion des sessions actives",
      "Cette fonctionnalité permet de gérer vos sessions actives sur différents appareils.",
      [{ text: "OK" }]
    );
  };

  if (!profile) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginHorizontal: 16,
      marginTop: 20,
      marginBottom: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Paramètres"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Preferences Section */}
          <ProfileMenuItem
            icon="envelope"
            title="Notifications par e-mail"
            value={
              profile.accountSettings.emailNotifications
                ? "Activé"
                : "Désactivé"
            }
            onPress={handleNotificationPress}
          />

          <ProfileMenuItem
            icon="comments"
            title="Notifications par SMS"
            value={
              profile.accountSettings.smsNotifications ? "Activé" : "Désactivé"
            }
            onPress={handleSMSPress}
          />

          <ProfileMenuItem
            icon="globe"
            title="Langue de l'application"
            value={
              profile.accountSettings.language === "fr" ? "Français" : "English"
            }
            onPress={handleLanguagePress}
          />

          <ProfileMenuItem
            icon="adjust"
            title="Mode sombre"
            value={profile.accountSettings.darkMode ? "Activé" : "Désactivé"}
            onPress={handleDarkModePress}
          />

          {/* Security & Privacy Section */}
          <ProfileMenuItem
            icon="lock"
            title="Modification du mot de passe"
            onPress={handlePasswordPress}
          />

          <ProfileMenuItem
            icon="shield"
            title="La connexion biométrique"
            value={
              profile.accountSettings.biometricAuth ? "Activé" : "Désactivé"
            }
            onPress={handleBiometricPress}
          />

          <ProfileMenuItem
            icon="history"
            title="Gestion des sessions actives"
            onPress={handleSessionsPress}
          />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
