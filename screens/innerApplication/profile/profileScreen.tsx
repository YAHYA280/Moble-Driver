// screens/innerApplication/profile/profileScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Alert, Animated, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { PersonalInfo } from "../../../shared/types/profile";
import { useAuthStore } from "../../../store/authStore";
import { useProfileStore } from "../../../store/profileStore";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileInfoSection } from "./components/ProfileInfoSection";
import { ProfileMenuItem } from "./components/ProfileMenuItem";

export const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const { logout } = useAuthStore();
  const {
    profile,
    isLoading,
    isEditMode,
    pendingChanges,
    fetchProfile,
    updatePersonalInfo,
    toggleEditMode,
    setPendingChanges,
    clearPendingChanges,
    uploadProfilePhoto,
  } = useProfileStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProfile();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEditPress = () => {
    if (isEditMode) {
      // Save changes
      if (Object.keys(pendingChanges).length > 0) {
        updatePersonalInfo(pendingChanges);
      } else {
        toggleEditMode();
      }
    } else {
      toggleEditMode();
    }
  };

  const handleValueChange = (field: keyof PersonalInfo, value: string) => {
    setPendingChanges({ [field]: value });
  };

  const handlePhotoPress = () => {
    Alert.alert(
      "Photo de profil",
      "Que souhaitez-vous faire ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Changer la photo",
          onPress: () => {
            // In a real app, you would open image picker here
            const newPhotoUrl =
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
            uploadProfilePhoto(newPhotoUrl);
          },
        },
        profile?.personalInfo.profilePhoto && {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            // deleteProfilePhoto();
          },
        },
      ].filter(Boolean) as any
    );
  };

  const handleDocumentsPress = () => {
    router.push("/documents");
  };

  const handleHistoryPress = () => {
    router.push("./profile/history");
  };

  const handleSettingsPress = () => {
    router.push("./profile/settings");
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/auth/login");
        },
      },
    ]);
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
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            onEditPress={handleEditPress}
            onPhotoPress={handlePhotoPress}
            isEditMode={isEditMode}
          />

          {/* Personal Information Section */}
          <ProfileInfoSection
            title="Mes documents"
            personalInfo={profile.personalInfo}
            isEditMode={isEditMode}
            pendingChanges={pendingChanges}
            onValueChange={handleValueChange}
            onEditPress={handleEditPress}
          />

          {/* Menu Items */}
          <ProfileMenuItem
            icon="file-text"
            title="Mes documents"
            subtitle="Accès rapide aux documents"
            onPress={handleDocumentsPress}
          />

          <ProfileMenuItem
            icon="history"
            title="Historique des trajets"
            subtitle="Consulter l'historique des modifications"
            onPress={handleHistoryPress}
          />

          <ProfileMenuItem
            icon="bell"
            title="Notifications et alertes"
            subtitle="Gérer les alertes et notifications"
            onPress={() => router.push("/notifications")}
          />

          <ProfileMenuItem
            icon="cog"
            title="Paramètres"
            subtitle="Préférences utilisateur"
            onPress={handleSettingsPress}
          />

          <ProfileMenuItem
            icon="sign-out"
            title="Déconnecté"
            onPress={handleLogout}
            showArrow={false}
          />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
