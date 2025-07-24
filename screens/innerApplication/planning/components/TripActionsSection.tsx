// screens/innerApplication/planning/components/TripActionsSection.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";
import { Trip } from "../../../../shared/types/planning";

interface TripActionsSectionProps {
  trip: Trip;
  isLoading: boolean;
  onStartTrip: () => void;
  onCompleteTrip: () => void;
  onCancelTrip: () => void;
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
  },
  noActionsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  noActionsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  noActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  noActionsSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export const TripActionsSection: React.FC<TripActionsSectionProps> = ({
  trip,
  isLoading,
  onStartTrip,
  onCompleteTrip,
  onCancelTrip,
}) => {
  const colors = useThemeColors();

  const getAvailableActions = () => {
    const actions = [];

    switch (trip.status) {
      case "prevu":
        actions.push({
          id: "start",
          title: "Démarrer le trajet",
          onPress: onStartTrip,
          variant: "primary" as const,
          icon: "play",
        });
        if (trip.canCancel) {
          actions.push({
            id: "cancel",
            title: "Annuler",
            onPress: onCancelTrip,
            variant: "danger" as const,
            icon: "times",
          });
        }
        break;

      case "en_cours":
        actions.push({
          id: "complete",
          title: "Terminer le trajet",
          onPress: onCompleteTrip,
          variant: "primary" as const,
          icon: "check",
        });
        break;

      case "termine":
      case "annule":
        // No actions available for completed or cancelled trips
        break;
    }

    return actions;
  };

  const availableActions = getAvailableActions();
  const hasActions = availableActions.length > 0;

  const getStatusMessage = () => {
    switch (trip.status) {
      case "termine":
        return {
          icon: "check-circle",
          title: "Trajet terminé",
          subtitle: "Ce trajet a été terminé avec succès.",
          color: colors.success,
        };
      case "annule":
        return {
          icon: "times-circle",
          title: "Trajet annulé",
          subtitle: "Ce trajet a été annulé et ne peut plus être modifié.",
          color: colors.error,
        };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  const dynamicStyles = {
    section: {
      ...styles.section,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: { elevation: 3 },
      }),
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: colors.text,
    },
    noActionsContainer: {
      ...styles.noActionsContainer,
      backgroundColor: colors.surface + "80",
      borderColor: statusMessage ? statusMessage.color + "20" : colors.primary + "20",
    },
    noActionsIcon: {
      ...styles.noActionsIcon,
      backgroundColor: statusMessage ? statusMessage.color : colors.primary,
      ...Platform.select({
        ios: {
          shadowColor: statusMessage ? statusMessage.color : colors.primaryDark,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: { elevation: 6 },
        web: { 
          boxShadow: `0 4px 12px ${statusMessage ? statusMessage.color : colors.success}40` 
        },
      }),
    },
    noActionsTitle: {
      ...styles.noActionsTitle,
      color: colors.text,
    },
    noActionsSubtitle: {
      ...styles.noActionsSubtitle,
      color: colors.textSecondary,
    },
  };

  return (
    <View style={dynamicStyles.section}>
      <Text style={dynamicStyles.sectionTitle}>Actions</Text>

      <ConditionalComponent
        isValid={hasActions}
        defaultComponent={
          <View style={dynamicStyles.noActionsContainer}>
            <View style={dynamicStyles.noActionsIcon}>
              <FontAwesome 
                name={statusMessage?.icon || "check"} 
                size={32} 
                color="#ffffff" 
              />
            </View>
            <Text style={dynamicStyles.noActionsTitle}>
              {statusMessage?.title || "Aucune action requise"}
            </Text>
            <Text style={dynamicStyles.noActionsSubtitle}>
              {statusMessage?.subtitle || "