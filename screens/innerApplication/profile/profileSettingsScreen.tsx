import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { useProfileStore } from "../../../store/profileStore";

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

interface SettingItemProps {
  title: string;
  subtitle?: string;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  showToggle?: boolean;
  onPress?: () => void;
}

const createSectionStyles = (colors: any) =>
  StyleSheet.create({
    section: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 0,
      marginTop: 16,
      marginLeft: 16,
      color: colors.text,
    },
  });

const createItemStyles = (colors: any) =>
  StyleSheet.create({
    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    contentContainer: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    itemSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    toggle: {
      width: 50,
      height: 30,
      borderRadius: 15,
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    toggleActive: {
      backgroundColor: colors.primary,
    },
    toggleInactive: {
      backgroundColor: colors.border,
    },
    toggleButton: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    toggleButtonActive: {
      alignSelf: "flex-end",
    },
    toggleButtonInactive: {
      alignSelf: "flex-start",
    },
  });

const createMainStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 20,
      paddingBottom: 100,
    },
  });

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => {
  const { colors } = useTheme();
  const sectionStyles = createSectionStyles(colors);

  return (
    <View>
      <Text style={sectionStyles.sectionTitle}>{title}</Text>
      <View style={sectionStyles.section}>{children}</View>
    </View>
  );
};

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  value = false,
  onToggle,
  showToggle = false,
  onPress,
}) => {
  const { colors } = useTheme();
  const itemStyles = createItemStyles(colors);

  const handlePress = () => {
    if (showToggle && onToggle) {
      onToggle(!value);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={itemStyles.item}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={itemStyles.contentContainer}>
        <Text
          style={[itemStyles.itemTitle, { marginBottom: subtitle ? 2 : 0 }]}
        >
          {title}
        </Text>
        <ConditionalComponent isValid={!!subtitle}>
          <Text style={itemStyles.itemSubtitle}>{subtitle}</Text>
        </ConditionalComponent>
      </View>

      <View style={itemStyles.rightContainer}>
        <ConditionalComponent isValid={!!showToggle}>
          <View
            style={[
              itemStyles.toggle,
              value ? itemStyles.toggleActive : itemStyles.toggleInactive,
            ]}
          >
            <View
              style={[
                itemStyles.toggleButton,
                value
                  ? itemStyles.toggleButtonActive
                  : itemStyles.toggleButtonInactive,
              ]}
            />
          </View>
        </ConditionalComponent>
      </View>
    </TouchableOpacity>
  );
};

export const ProfileSettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { profile, updateAccountSettings } = useProfileStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [hasChanges, setHasChanges] = useState(false);

  // Create styles once per theme change
  const styles = createMainStyles(colors);

  // Local state to track changes
  const [localSettings, setLocalSettings] = useState({
    emailNotifications: profile?.accountSettings.emailNotifications || false,
    smsNotifications: profile?.accountSettings.smsNotifications || false,
    darkMode: profile?.accountSettings.darkMode || false,
    biometricAuth: profile?.accountSettings.biometricAuth || false,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (profile) {
      setLocalSettings({
        emailNotifications: profile.accountSettings.emailNotifications,
        smsNotifications: profile.accountSettings.smsNotifications,
        darkMode: profile.accountSettings.darkMode,
        biometricAuth: profile.accountSettings.biometricAuth,
      });
    }
  }, [profile]);

  const handleSettingChange = (
    key: keyof typeof localSettings,
    value: boolean
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);

    // Update immediately in the store
    updateAccountSettings({ [key]: value });
  };

  const handleLanguagePress = () => {
    router.push("./(tabs)/profile/language");
  };

  const handlePasswordPress = () => {
    router.push("./(tabs)/profile/change-password");
  };

  if (!profile) {
    return null;
  }

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
          <SettingSection title="Préférences utilisateur">
            <SettingItem
              title="Notifications par e-mail"
              value={localSettings.emailNotifications}
              onToggle={(value) =>
                handleSettingChange("emailNotifications", value)
              }
              showToggle
            />

            <SettingItem
              title="Notifications par SMS"
              value={localSettings.smsNotifications}
              onToggle={(value) =>
                handleSettingChange("smsNotifications", value)
              }
              showToggle
            />

            <SettingItem
              title="Langue de l'application"
              onPress={handleLanguagePress}
            />

            <SettingItem
              title="Mode sombre"
              value={localSettings.darkMode}
              onToggle={(value) => handleSettingChange("darkMode", value)}
              showToggle
            />
          </SettingSection>

          {/* Security & Privacy Section */}
          <SettingSection title="Sécurité & confidentialité">
            <SettingItem
              title="Modification du mot de passe"
              onPress={handlePasswordPress}
            />

            <SettingItem
              title="La connexion biométrique"
              value={localSettings.biometricAuth}
              onToggle={(value) => handleSettingChange("biometricAuth", value)}
              showToggle
            />

            <SettingItem
              title="Gestion des sessions actives"
              onPress={() =>
                Alert.alert("Fonctionnalité", "Bientôt disponible")
              }
            />
          </SettingSection>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
