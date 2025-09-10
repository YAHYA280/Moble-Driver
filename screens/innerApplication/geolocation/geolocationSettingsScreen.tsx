import { Ionicons } from "@expo/vector-icons";
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

import { useTheme } from "@/contexts/ThemeContext";
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Header } from "@/shared/components/ui/Header";
import { useGeolocationStore } from "@/store/geolocationStore";

export const GeolocationSettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const [hasChanges, setHasChanges] = useState(false);

  const { settings, isLoading, error, updateSettings } = useGeolocationStore();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const hasSettingsChanged =
      JSON.stringify(settings) !== JSON.stringify(localSettings);
    setHasChanges(hasSettingsChanged);
  }, [localSettings, settings, headerAnim]);

  const updateLocalSettings = (path: string, value: any) => {
    setLocalSettings((prev) => {
      const keys = path.split(".");
      const newSettings = { ...prev };
      let current = newSettings as any;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSave = async () => {
    try {
      await updateSettings(localSettings);
      Alert.alert("Succès", "Paramètres sauvegardés avec succès");
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sauvegarder les paramètres");
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Réinitialiser",
      "Voulez-vous restaurer les paramètres par défaut ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: () => {
            setLocalSettings({
              map: {
                mapType: "roadmap",
                nightMode: false,
                showTraffic: true,
                showPOI: true,
                autoFollow: true,
                updateInterval: 15,
              },
              notifications: {
                soundEnabled: true,
                vibrationEnabled: true,
                approachDistance: 500,
                routeChangeAlerts: true,
                missionAlerts: true,
              },
            });
          },
        },
      ]
    );
  };

  const ToggleSwitch: React.FC<{
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
  }> = ({ value, onValueChange, disabled = false }) => (
    <TouchableOpacity
      style={[
        styles.toggleButton,
        value && styles.activeToggleButton,
        disabled && styles.disabledToggle,
      ]}
      onPress={() => !disabled && onValueChange(!value)}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View
        style={[styles.toggleIndicator, value && styles.activeToggleIndicator]}
      />
    </TouchableOpacity>
  );

  const SettingRow: React.FC<{
    title: string;
    description?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    rightElement?: React.ReactNode;
    disabled?: boolean;
  }> = ({
    title,
    description,
    value,
    onValueChange,
    rightElement,
    disabled = false,
  }) => (
    <View style={[styles.settingRow, disabled && styles.disabledRow]}>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, disabled && styles.disabledText]}>
          {title}
        </Text>
        <ConditionalComponent isValid={!!description}>
          <Text
            style={[styles.settingDescription, disabled && styles.disabledText]}
          >
            {description}
          </Text>
        </ConditionalComponent>
      </View>
      <ConditionalComponent
        isValid={!!rightElement}
        defaultComponent={
          <ConditionalComponent isValid={!!onValueChange}>
            <ToggleSwitch
              value={value || false}
              onValueChange={onValueChange!}
              disabled={disabled}
            />
          </ConditionalComponent>
        }
      >
        {rightElement}
      </ConditionalComponent>
    </View>
  );

  const mapTypeOptions = [
    { key: "roadmap", label: "Plan", icon: "map" },
    { key: "satellite", label: "Satellite", icon: "globe" },
    { key: "hybrid", label: "Hybride", icon: "layers" },
    { key: "terrain", label: "Relief", icon: "triangle" },
  ];

  const updateIntervalOptions = [
    { value: 10, label: "10 secondes" },
    { value: 15, label: "15 secondes" },
    { value: 30, label: "30 secondes" },
    { value: 60, label: "1 minute" },
  ];

  const approachDistanceOptions = [
    { value: 200, label: "200 mètres" },
    { value: 500, label: "500 mètres" },
    { value: 1000, label: "1 kilomètre" },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    section: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      padding: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 4px rgba(0, 0, 0, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastSettingRow: {
      borderBottomWidth: 0,
    },
    settingContent: {
      flex: 1,
      marginRight: 16,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    disabledRow: {
      opacity: 0.5,
    },
    disabledText: {
      color: colors.textDisabled,
    },
    toggleButton: {
      width: 50,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.backgroundSecondary,
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    activeToggleButton: {
      backgroundColor: colors.primary,
    },
    disabledToggle: {
      backgroundColor: colors.backgroundTertiary,
    },
    toggleIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
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
        web: {
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
        },
      }),
    },
    activeToggleIndicator: {
      alignSelf: "flex-end",
    },
    optionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    },
    optionButton: {
      flex: 1,
      minWidth: "45%",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: "transparent",
    },
    activeOptionButton: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary,
    },
    optionIcon: {
      marginRight: 8,
    },
    optionText: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    activeOptionText: {
      color: colors.primary,
    },
    selectButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
    },
    selectButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      marginRight: 8,
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
    floatingActions: {
      position: "absolute",
      bottom: Platform.select({ ios: 34, android: 16, default: 20 }),
      left: 16,
      right: 16,
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 12,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 8px rgba(0, 0, 0, 0.15)"
            : "0 4px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    disabledButton: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    secondaryButtonText: {
      color: colors.text,
    },
    primaryButtonText: {
      color: "white",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
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
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Paramètres géolocalisation"
        />
      </Animated.View>

      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres de la carte</Text>

          <View>
            <Text style={styles.settingTitle}>Type de carte</Text>
            <View style={styles.optionsGrid}>
              {mapTypeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    localSettings.map.mapType === option.key &&
                      styles.activeOptionButton,
                  ]}
                  onPress={() => updateLocalSettings("map.mapType", option.key)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={16}
                    color={
                      localSettings.map.mapType === option.key
                        ? colors.primary
                        : colors.textSecondary
                    }
                    style={styles.optionIcon}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      localSettings.map.mapType === option.key &&
                        styles.activeOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <SettingRow
            title="Mode nuit"
            description="Active automatiquement le thème sombre pour la carte"
            value={localSettings.map.nightMode}
            onValueChange={(value) =>
              updateLocalSettings("map.nightMode", value)
            }
          />

          <SettingRow
            title="Informations trafic"
            description="Affiche les conditions de circulation en temps réel"
            value={localSettings.map.showTraffic}
            onValueChange={(value) =>
              updateLocalSettings("map.showTraffic", value)
            }
          />

          <SettingRow
            title="Points d'intérêt"
            description="Affiche les stations-service, restaurants et autres POI"
            value={localSettings.map.showPOI}
            onValueChange={(value) => updateLocalSettings("map.showPOI", value)}
          />

          <SettingRow
            title="Suivi automatique"
            description="Centre automatiquement la carte sur votre position"
            value={localSettings.map.autoFollow}
            onValueChange={(value) =>
              updateLocalSettings("map.autoFollow", value)
            }
          />

          <View style={[styles.settingRow, styles.lastSettingRow]}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Intervalle de mise à jour</Text>
              <Text style={styles.settingDescription}>
                Fréquence de actualisation de votre position
              </Text>
            </View>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                const buttons = [
                  ...updateIntervalOptions.map((option) => ({
                    text: option.label,
                    onPress: () =>
                      updateLocalSettings("map.updateInterval", option.value),
                  })),
                  { text: "Annuler", style: "cancel" as const },
                ];

                Alert.alert(
                  "Intervalle de mise à jour",
                  "Choisissez la fréquence de mise à jour de votre position",
                  buttons
                );
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectButtonText}>
                {
                  updateIntervalOptions.find(
                    (o) => o.value === localSettings.map.updateInterval
                  )?.label
                }
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications et alertes</Text>

          <SettingRow
            title="Sons de notification"
            description="Émet un son lors des alertes importantes"
            value={localSettings.notifications.soundEnabled}
            onValueChange={(value) =>
              updateLocalSettings("notifications.soundEnabled", value)
            }
          />

          <SettingRow
            title="Vibrations"
            description="Fait vibrer l'appareil lors des notifications"
            value={localSettings.notifications.vibrationEnabled}
            onValueChange={(value) =>
              updateLocalSettings("notifications.vibrationEnabled", value)
            }
          />

          <SettingRow
            title="Alertes de changement d'itinéraire"
            description="Vous avertit en cas de modification de parcours"
            value={localSettings.notifications.routeChangeAlerts}
            onValueChange={(value) =>
              updateLocalSettings("notifications.routeChangeAlerts", value)
            }
          />

          <SettingRow
            title="Alertes de mission"
            description="Notifications pour les nouvelles missions et mises à jour"
            value={localSettings.notifications.missionAlerts}
            onValueChange={(value) =>
              updateLocalSettings("notifications.missionAlerts", value)
            }
          />

          <View style={[styles.settingRow, styles.lastSettingRow]}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Distance d'approche</Text>
              <Text style={styles.settingDescription}>
                Distance à laquelle déclencher les alertes de proximité
              </Text>
            </View>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                const buttons = [
                  ...approachDistanceOptions.map((option) => ({
                    text: option.label,
                    onPress: () =>
                      updateLocalSettings(
                        "notifications.approachDistance",
                        option.value
                      ),
                  })),
                  { text: "Annuler", style: "cancel" as const },
                ];

                Alert.alert(
                  "Distance d'approche",
                  "Choisissez la distance pour déclencher les alertes",
                  buttons
                );
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectButtonText}>
                {
                  approachDistanceOptions.find(
                    (o) =>
                      o.value === localSettings.notifications.approachDistance
                  )?.label
                }
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.floatingActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color={colors.text} />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Réinitialiser
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.primaryButton,
            !hasChanges && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={!hasChanges || isLoading}
          activeOpacity={hasChanges ? 0.7 : 1}
        >
          <Ionicons
            name={isLoading ? "hourglass" : "checkmark"}
            size={20}
            color="white"
          />
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            {isLoading ? "Sauvegarde..." : "Sauvegarder"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
