// screens/innerApplication/profile/profileScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
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
import { Header } from "../../../shared/components/ui/Header";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { useAuthStore } from "../../../store/authStore";
import { useProfileStore } from "../../../store/profileStore";
import { NavigationMenuCard } from "./components/NavigationMenuCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CurvedBackground: React.FC = () => {
  const { colors } = useTheme();

  // Fixed path with equal sides
  const pathData = `
    M 0,0 
    L ${screenWidth},0 
    L ${screenWidth},170
    Q ${screenWidth * 0.75},220 ${screenWidth * 0.5},230
    Q ${screenWidth * 0.25},220 0,170
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
        height="300"
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
  const [showSidebar, setShowSidebar] = useState(false);
  const { profile, fetchProfile, uploadProfilePhoto } = useProfileStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProfile();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePhotoPress = () => {
    Alert.alert("Photo de profil", "Que souhaitez-vous faire ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Changer la photo",
        onPress: () => {
          const newPhotoUrl =
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
          uploadProfilePhoto(newPhotoUrl);
        },
      },
    ]);
  };

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
      id: "profile",
      label: "Mon profil",
      icon: "user" as const,
      onPress: () => setShowSidebar(false),
      isActive: true,
    },
    {
      id: "documents",
      label: "Mes documents",
      icon: "file-text" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/documents");
      },
      isActive: false,
    },
    {
      id: "history",
      label: "Historique des trajets",
      icon: "history" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/(tabs)/profile/history");
      },
      isActive: false,
    },
    {
      id: "notifications",
      label: "Notifications et alertes",
      icon: "bell" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/notifications");
      },
      isActive: false,
    },
  ];

  const navigationMenuItems = [
    {
      id: "documents",
      icon: "file-text" as const,
      label: "Mes documents",
      subtitle: "Consultez vos documents",
      onPress: () => router.push("/documents"),
    },
    {
      id: "history",
      icon: "history" as const,
      label: "Historique des trajets",
      subtitle: "Voir l'historique complet",
      onPress: () => router.push("/(tabs)/profile/history"),
    },
    {
      id: "notifications",
      icon: "bell" as const,
      label: "Notifications et alertes",
      subtitle: "Gérer les notifications",
      onPress: () => router.push("/notifications"),
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
    profileSection: {
      alignItems: "center",
      paddingTop: 170,
      zIndex: 10,
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
      borderColor: "white",
    },
    profileImagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 4,
      borderColor: "white",
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 4,
      right: 4,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: "#4CAF50",
      borderWidth: 3,
      borderColor: "white",
    },
    content: {
      flex: 1,
      backgroundColor: colors.isDark ? colors.background : "#FFFFFF",
      marginTop: 160, // Start content after the profile photo
    },
    profileInfo: {
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 20,
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
        <Header
          leftIcon={{
            icon: "bars",
            onPress: () => setShowSidebar(true),
            color: "white",
          }}
          title="Mon profil"
          backgroundColor="transparent"
          titleColor="white"
          rightIcons={[
            {
              icon: "cog",
              onPress: () => router.push("/(tabs)/profile/settings"),
              color: "white",
            },
            {
              icon: "edit",
              onPress: () => router.push("/(tabs)/profile/settings"),
              color: "white",
            },
          ]}
        />
      </SafeAreaView>

      {/* Profile image positioned on the curved section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={handlePhotoPress} activeOpacity={0.8}>
            <ConditionalComponent
              isValid={!!profile.personalInfo.profilePhoto}
              defaultComponent={
                <View style={styles.profileImagePlaceholder}>
                  <FontAwesome
                    name="user"
                    size={32}
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
          </TouchableOpacity>
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

      {/* Sidebar */}
      <Sidebar
        title="Mon profil"
        items={sidebarItems}
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />
    </View>
  );
};
