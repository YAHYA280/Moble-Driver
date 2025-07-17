// screens/innerApplication/profile/profileScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
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

const InfoItem: React.FC<{
  icon: string;
  text: string;
  isActive?: boolean;
}> = ({ icon, text, isActive = false }) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    iconContainer: {
      width: 24,
      alignItems: "center",
      marginRight: 16,
    },
    textContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    text: {
      fontSize: 16,
      color: "#333333",
      fontWeight: "400",
    },
    activeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#4CAF50",
      marginRight: 8,
    },
    activeText: {
      color: "#4CAF50",
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome
          name={icon as any}
          size={16}
          color={isActive ? "#4CAF50" : "#666666"}
        />
      </View>
      <View style={styles.textContainer}>
        {isActive && <View style={styles.activeDot} />}
        <Text style={[styles.text, isActive && styles.activeText]}>{text}</Text>
      </View>
    </View>
  );
};

const MenuItem: React.FC<{
  icon: string;
  title: string;
  onPress: () => void;
}> = ({ icon, title, onPress }) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    iconContainer: {
      width: 24,
      alignItems: "center",
      marginRight: 16,
    },
    title: {
      fontSize: 16,
      color: "#333333",
      fontWeight: "400",
      flex: 1,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={icon as any} size={16} color="#666666" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const CurvedBackground: React.FC = () => {
  return (
    <Svg
      height="200"
      width="100%"
      viewBox="0 0 375 200"
      style={StyleSheet.absoluteFillObject}
    >
      <Path
        d="M0,0 L375,0 L375,120 Q375,140 355,160 Q335,180 300,190 Q200,210 75,190 Q40,180 20,160 Q0,140 0,120 Z"
        fill="#746CD4"
      />
    </Svg>
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

  if (!profile) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    statusBar: {
      backgroundColor: "#746CD4",
    },
    purpleSection: {
      height: 200,
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    profileContainer: {
      alignItems: "center",
      zIndex: 10,
      paddingTop: 20,
    },
    profileImageContainer: {
      position: "relative",
      marginBottom: 16,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 4,
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
    profileName: {
      fontSize: 22,
      fontWeight: "700",
      color: "#333333",
      textAlign: "center",
      marginBottom: 4,
    },
    profileTitle: {
      fontSize: 16,
      color: "#666666",
      textAlign: "center",
      fontWeight: "400",
    },
    content: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      paddingTop: 20,
    },
    infoSection: {
      paddingBottom: 20,
    },
    separator: {
      height: 1,
      backgroundColor: "#F0F0F0",
      marginHorizontal: 20,
      marginVertical: 8,
    },
    menuSection: {
      paddingTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#746CD4" />

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

      {/* Purple curved section */}
      <View style={styles.purpleSection}>
        <CurvedBackground />
        <View style={styles.profileContainer}>
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
      </View>

      {/* White content area */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.profileContainer}>
          <Text style={styles.profileName}>
            {profile.personalInfo.fullName}
          </Text>
          <Text style={styles.profileTitle}>
            {profile.professionalInfo.position}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Information Section */}
          <View style={styles.infoSection}>
            <InfoItem icon="phone" text={profile.personalInfo.phoneNumber} />
            <InfoItem icon="envelope" text={profile.personalInfo.email} />
            <InfoItem
              icon="credit-card"
              text={profile.professionalInfo.driverId}
            />
            <InfoItem icon="circle" text="Actif" isActive={true} />
            <InfoItem icon="calendar" text="40 ans" />
          </View>

          <View style={styles.separator} />

          {/* Menu Section */}
          <View style={styles.menuSection}>
            <MenuItem
              icon="file-text"
              title="Mes documents"
              onPress={() => router.push("/documents")}
            />
            <MenuItem
              icon="history"
              title="Historique des trajets"
              onPress={() => router.push("/(tabs)/profile/history")}
            />
            <MenuItem
              icon="warning"
              title="Notifications et alertes"
              onPress={() => router.push("/notifications")}
            />
          </View>
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
