import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { useNotificationStore } from "../../../store/notificationStore";

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof FontAwesome.glyphMap;
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showToggle?: boolean;
  showChevron?: boolean;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => {
  const { colors } = useTheme();

  const sectionStyles = StyleSheet.create({
    section: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      padding: 16,
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
      fontWeight: "600",
      marginBottom: 16,
      color: colors.text,
    },
  });

  return (
    <View style={sectionStyles.section}>
      <Text style={sectionStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  icon,
  value = false,
  onPress,
  onToggle,
  showToggle = false,
  showChevron = false,
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (showToggle && onToggle) {
      onToggle(!value);
    } else if (onPress) {
      onPress();
    }
  };

  const itemStyles = StyleSheet.create({
    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 0,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    contentContainer: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: subtitle ? 2 : 0,
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
    chevron: {
      marginLeft: 8,
    },
  });

  return (
    <TouchableOpacity
      style={itemStyles.item}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={itemStyles.iconContainer}>
        <FontAwesome name={icon} size={18} color={colors.primary} />
      </View>

      <View style={itemStyles.contentContainer}>
        <Text style={itemStyles.itemTitle}>{title}</Text>
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
        <ConditionalComponent isValid={!!showChevron}>
          <FontAwesome
            name="chevron-right"
            size={14}
            color={colors.textTertiary}
            style={itemStyles.chevron}
          />
        </ConditionalComponent>
      </View>
    </TouchableOpacity>
  );
};

export const NotificationSettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { preferences, updatePreferences } = useNotificationStore();
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (
    key: keyof typeof preferences,
    value: any
  ) => {
    updatePreferences({ [key]: value });
    setHasChanges(true);
  };

  const handlePriorityChange = (
    priority: "urgent" | "important" | "informative",
    value: boolean
  ) => {
    const newPrioritySettings = {
      ...preferences.prioritySettings,
      [priority]: value,
    };
    updatePreferences({ prioritySettings: newPrioritySettings });
    setHasChanges(true);
  };

  const handleSavePreferences = () => {
    Alert.alert(
      "Préférences sauvegardées",
      "Vos préférences de notification ont été mises à jour.",
      [{ text: "OK", onPress: () => setHasChanges(false) }]
    );
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      "Réinitialiser les préférences",
      "Êtes-vous sûr de vouloir réinitialiser toutes les préférences aux valeurs par défaut ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: () => {
            updatePreferences({
              pushNotifications: true,
              emailNotifications: true,
              smsNotifications: false,
              soundEnabled: true,
              vibrationEnabled: true,
              prioritySettings: {
                urgent: true,
                important: true,
                informative: true,
              },
            });
            setHasChanges(true);
          },
        },
      ]
    );
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
      paddingBottom: 100,
    },
    footer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 12,
    },
    footerButtons: {
      flexDirection: "row",
      gap: 12,
    },
    infoText: {
      fontSize: 13,
      color: colors.textTertiary,
      textAlign: "center",
      lineHeight: 18,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Paramètres"
        subtitle="Notifications"
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Methods */}
        <SettingSection title="Méthodes de réception">
          <SettingItem
            title="Notifications push"
            subtitle="Recevoir les notifications directement sur l'appareil"
            icon="mobile"
            value={preferences.pushNotifications}
            onToggle={(value) =>
              handlePreferenceChange("pushNotifications", value)
            }
            showToggle
          />

          <SettingItem
            title="Notifications email"
            subtitle="Recevoir les notifications par email"
            icon="envelope"
            value={preferences.emailNotifications}
            onToggle={(value) =>
              handlePreferenceChange("emailNotifications", value)
            }
            showToggle
          />

          <SettingItem
            title="Notifications SMS"
            subtitle="Recevoir les notifications par SMS"
            icon="comment"
            value={preferences.smsNotifications}
            onToggle={(value) =>
              handlePreferenceChange("smsNotifications", value)
            }
            showToggle
          />
        </SettingSection>

        {/* Sound & Vibration */}
        <SettingSection title="Sons et vibrations">
          <SettingItem
            title="Sons activés"
            subtitle="Jouer un son lors de la réception d'une notification"
            icon="volume-up"
            value={preferences.soundEnabled}
            onToggle={(value) => handlePreferenceChange("soundEnabled", value)}
            showToggle
          />

          <SettingItem
            title="Vibrations activées"
            subtitle="Faire vibrer l'appareil lors des notifications"
            icon="mobile"
            value={preferences.vibrationEnabled}
            onToggle={(value) =>
              handlePreferenceChange("vibrationEnabled", value)
            }
            showToggle
          />

          <SettingItem
            title="Sons personnalisés"
            subtitle="Configurer des sons spécifiques par type"
            icon="music"
            onPress={() =>
              Alert.alert(
                "Bientôt disponible",
                "Cette fonctionnalité sera disponible prochainement."
              )
            }
            showChevron
          />
        </SettingSection>

        {/* Priority Settings */}
        <SettingSection title="Types de notifications">
          <SettingItem
            title="Notifications urgentes"
            subtitle="Toujours recevoir les notifications urgentes"
            icon="exclamation-triangle"
            value={preferences.prioritySettings.urgent}
            onToggle={(value) => handlePriorityChange("urgent", value)}
            showToggle
          />

          <SettingItem
            title="Notifications importantes"
            subtitle="Recevoir les notifications importantes"
            icon="exclamation-circle"
            value={preferences.prioritySettings.important}
            onToggle={(value) => handlePriorityChange("important", value)}
            showToggle
          />

          <SettingItem
            title="Notifications informatives"
            subtitle="Recevoir les notifications d'information"
            icon="info-circle"
            value={preferences.prioritySettings.informative}
            onToggle={(value) => handlePriorityChange("informative", value)}
            showToggle
          />
        </SettingSection>

        {/* Advanced Settings */}
        <SettingSection title="Paramètres avancés">
          <SettingItem
            title="Heures silencieuses"
            subtitle="Définir des plages horaires sans notifications"
            icon="moon-o"
            onPress={() =>
              Alert.alert(
                "Bientôt disponible",
                "Cette fonctionnalité sera disponible prochainement."
              )
            }
            showChevron
          />

          <SettingItem
            title="Grouper les notifications"
            subtitle="Regrouper les notifications par type"
            icon="object-group"
            onPress={() =>
              Alert.alert(
                "Bientôt disponible",
                "Cette fonctionnalité sera disponible prochainement."
              )
            }
            showChevron
          />

          <SettingItem
            title="Historique automatique"
            subtitle="Archiver automatiquement après 30 jours"
            icon="history"
            onPress={() =>
              Alert.alert(
                "Bientôt disponible",
                "Cette fonctionnalité sera disponible prochainement."
              )
            }
            showChevron
          />
        </SettingSection>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <Button
            title="Réinitialiser"
            variant="outline"
            onPress={handleResetToDefaults}
            style={{ flex: 1 }}
          />

          <Button
            title="Sauvegarder"
            variant="primary"
            onPress={handleSavePreferences}
            disabled={!hasChanges}
            style={{ flex: 2 }}
          />
        </View>

        <Text style={styles.infoText}>
          Les modifications seront appliquées immédiatement après sauvegarde
        </Text>
      </View>
    </SafeAreaView>
  );
};
