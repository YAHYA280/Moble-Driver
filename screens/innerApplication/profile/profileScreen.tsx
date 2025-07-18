// screens/innerApplication/profile/profileScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { useAuthStore } from "../../../store/authStore";
import { useProfileStore } from "../../../store/profileStore";
import { NavigationMenuCard } from "./components/NavigationMenuCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CurvedBackground: React.FC = () => {
  const { colors } = useTheme();

  const pathData = `
    M 0,0 
    L ${screenWidth},0 
    L ${screenWidth},190
    Q ${screenWidth * 0.75},220 ${screenWidth * 0.5},230
    Q ${screenWidth * 0.25},220 0,190
    Z
  `;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Base background */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: colors.isDark ? colors.background : "#FFFFFF" },
        ]}
      />

      {/* Curved purple section */}
      <Svg
        height="250"
        width={screenWidth}
        viewBox={`0 0 ${screenWidth} 240`}
        style={{ position: "absolute", top: 0 }}
      >
        <Path d={pathData} fill="#746CD4" />
      </Svg>
    </View>
  );
};

export const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const { logout } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProfile();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const handleSettingsPress = () => {
    router.push("/(tabs)/profile/settings");
  };

  const handleEditPress = () => {
    router.push("/(tabs)/profile/edit");
  };

  // to be removed when adding the exact screens
  const showComingSoonAlert = (featureName: string) => {
    Alert.alert(
      "Bientôt disponible",
      `La fonctionnalité "${featureName}" sera disponible prochainement. Yahya :D`,
      [
        {
          text: "OK",
          style: "default",
        },
      ]
    );
  };

  const navigationMenuItems = [
    {
      id: "documents",
      icon: "file-text" as const,
      label: "Mes documents",
      subtitle: "Consultez vos documents",
      onPress: () => showComingSoonAlert("Mes documents"),
    },
    {
      id: "history",
      icon: "history" as const,
      label: "Historique des trajets",
      subtitle: "Voir l'historique complet",
      onPress: () => showComingSoonAlert("Historique des trajets"),
    },
    {
      id: "notifications",
      icon: "bell" as const,
      label: "Notifications et alertes",
      subtitle: "Gérer les notifications",
      onPress: () => router.push("/notifications?returnTo=/(tabs)/profile"),
    },
    {
      id: "logout",
      icon: "sign-out" as const,
      label: "Déconnexion",
      subtitle: "Se déconnecter du compte",
      onPress: handleLogout,
    },
  ];

  if (!profile) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.isDark ? colors.background : "#FFFFFF",
    },
    statusBar: {
      backgroundColor: "#746CD4",
    },
    backgroundContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 240,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: "transparent",
      zIndex: 20,
    },
    leftHeaderSection: {
      width: 100,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    centerHeaderSection: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    rightHeaderSection: {
      width: 100,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    headerButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      backgroundColor: "transparent",
      marginLeft: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.isDark ? "black" : "white",
      textAlign: "center",
    },
    profileSection: {
      alignItems: "center",
      paddingTop: 150,
      position: "absolute",
      left: 0,
      right: 0,
    },
    profileImageContainer: {
      position: "relative",
      marginBottom: 0,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 6,
      borderColor: colors.isDark ? "#0D0D0D" : "white",
    },
    profileImagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 6,
      borderColor: colors.isDark ? "#0D0D0D" : "white",
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 1,
      right: 12,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#4CAF50",
      borderWidth: 3,
      borderColor: "white",
    },
    content: {
      flex: 1,
      backgroundColor: colors.isDark ? colors.background : "#FFFFFF",
      marginTop: Platform.OS === "ios" ? 160 : 180,
    },
    profileInfo: {
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 5,
      paddingBottom: 5,
    },
    profileName: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 4,
    },
    profileTitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      fontWeight: "400",
      marginBottom: 5,
    },
    cardsContainer: {
      flex: 1,
      paddingTop: 10,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#746CD4" />

      {/* Background with curved shape */}
      <View style={styles.backgroundContainer}>
        <CurvedBackground />
      </View>

      <SafeAreaView style={styles.statusBar} edges={["top"]}>
        {/* Custom Header */}
        <View style={styles.headerContainer}>
          {/* Left section - empty for balance */}
          <View style={styles.leftHeaderSection} />

          {/* Center section - title */}
          <View style={styles.centerHeaderSection}>
            <Text style={styles.headerTitle}>Mon profil</Text>
          </View>

          {/* Right section - buttons */}
          <View style={styles.rightHeaderSection}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSettingsPress}
              activeOpacity={0.7}
            >
              <FontAwesome
                name="cog"
                size={26}
                color={colors.isDark ? "black" : "white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleEditPress}
              activeOpacity={0.7}
            >
              <FontAwesome
                name="edit"
                size={26}
                color={colors.isDark ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Profile image positioned on the curved section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          {/* Removed TouchableOpacity - profile photo is no longer clickable */}
          <ConditionalComponent
            isValid={!!profile.personalInfo.profilePhoto}
            defaultComponent={
              <View style={styles.profileImagePlaceholder}>
                <FontAwesome
                  name="user"
                  size={40}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </View>
            }
          >
            <Image
              source={{ uri: profile.personalInfo.profilePhoto }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </ConditionalComponent>
          <View style={styles.onlineIndicator} />
        </View>
      </View>

      {/* White content area */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {profile.personalInfo.fullName}
          </Text>
          <Text style={styles.profileTitle}>
            {profile.professionalInfo.position}
          </Text>
        </View>

        <ScrollView
          style={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Personal Information Card */}
          <PersonalInfoCard profile={profile} />

          {/* Navigation Menu Card */}
          <NavigationMenuCard
            title="Actions rapides"
            items={navigationMenuItems}
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
};
