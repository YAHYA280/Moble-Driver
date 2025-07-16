// screens/innerApplication/profile/languageSelectionScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { useProfileStore } from "../../../store/profileStore";

interface Language {
  code: "fr" | "en" | "ar" | "zh" | "hi" | "es" | "ru" | "id" | "vi";
  name: string;
  nativeName: string;
  flag: string;
}

export const LanguageSelectionScreen: React.FC = () => {
  const { colors } = useTheme();
  const { profile, updateAccountSettings } = useProfileStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const languages: Language[] = [
    { code: "en", name: "English (US)", nativeName: "English", flag: "🇺🇸" },
    { code: "en", name: "English (UK)", nativeName: "English", flag: "🇬🇧" },
    { code: "zh", name: "Mandarin", nativeName: "中文", flag: "🇨🇳" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
    { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
    {
      code: "id",
      name: "Indonesia",
      nativeName: "Bahasa Indonesia",
      flag: "🇮🇩",
    },
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLanguageSelect = (languageCode: "fr" | "en" | "ar") => {
    updateAccountSettings({ language: languageCode });
    router.back();
  };

  const isSelected = (languageCode: string) => {
    return profile?.accountSettings.language === languageCode;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingVertical: 16,
      paddingBottom: 100,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginHorizontal: 16,
      marginBottom: 12,
      marginTop: 8,
    },
    languageItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 4,
      borderRadius: 8,
    },
    selectedLanguage: {
      backgroundColor: colors.primary + "15",
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    flag: {
      fontSize: 24,
      marginRight: 16,
    },
    languageInfo: {
      flex: 1,
    },
    languageName: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    selectedLanguageName: {
      color: colors.primary,
      fontWeight: "600",
    },
    nativeName: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    selectedIndicator: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    selectedDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "white",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Langues"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Suggérée</Text>

          {languages.slice(0, 2).map((language, index) => (
            <TouchableOpacity
              key={`suggested-${index}`}
              style={[
                styles.languageItem,
                isSelected(language.code) && styles.selectedLanguage,
              ]}
              onPress={() =>
                handleLanguageSelect(language.code as "fr" | "en" | "ar")
              }
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{language.flag}</Text>
              <View style={styles.languageInfo}>
                <Text
                  style={[
                    styles.languageName,
                    isSelected(language.code) && styles.selectedLanguageName,
                  ]}
                >
                  {language.name}
                </Text>
                <Text style={styles.nativeName}>{language.nativeName}</Text>
              </View>
              {isSelected(language.code) && (
                <View style={styles.selectedIndicator}>
                  <View style={styles.selectedDot} />
                </View>
              )}
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>Autre</Text>

          {languages.slice(2).map((language, index) => (
            <TouchableOpacity
              key={`other-${index}`}
              style={[
                styles.languageItem,
                isSelected(language.code) && styles.selectedLanguage,
              ]}
              onPress={() =>
                handleLanguageSelect(language.code as "fr" | "en" | "ar")
              }
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{language.flag}</Text>
              <View style={styles.languageInfo}>
                <Text
                  style={[
                    styles.languageName,
                    isSelected(language.code) && styles.selectedLanguageName,
                  ]}
                >
                  {language.name}
                </Text>
                <Text style={styles.nativeName}>{language.nativeName}</Text>
              </View>
              {isSelected(language.code) && (
                <View style={styles.selectedIndicator}>
                  <View style={styles.selectedDot} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
