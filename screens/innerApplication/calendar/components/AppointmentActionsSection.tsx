import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";
import { Appointment } from "../../../../shared/types/calendar";

interface AppointmentActionsSectionProps {
  appointment: Appointment;
  isLoading: boolean;
  onConfirmPresence: () => void;
  onRequestReschedule: () => void;
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
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
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

export const AppointmentActionsSection: React.FC<
  AppointmentActionsSectionProps
> = ({ appointment, isLoading, onConfirmPresence, onRequestReschedule }) => {
  const colors = useThemeColors();

  const hasActions = appointment.status === "prevu" || appointment.canModify;

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
      borderColor: colors.primary + "20",
    },
    noActionsIcon: {
      ...styles.noActionsIcon,
      backgroundColor: colors.primary,
      ...Platform.select({
        ios: {
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: { elevation: 6 },
        web: { boxShadow: `0 4px 12px ${colors.success}40` },
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
              <FontAwesome name="check" size={32} color="#ffffff" />
            </View>
            <Text style={dynamicStyles.noActionsTitle}>
              Aucune action requise
            </Text>
            <Text style={dynamicStyles.noActionsSubtitle}>
              Ce rendez-vous ne nécessite aucune action de votre part pour le
              moment.
            </Text>
          </View>
        }
      >
        <ConditionalComponent isValid={appointment.status === "prevu"}>
          <View style={styles.actionButtons}>
            <Button
              title="Confirmer ma présence"
              onPress={onConfirmPresence}
              style={styles.primaryButton}
              loading={isLoading}
            />
          </View>
        </ConditionalComponent>

        <ConditionalComponent isValid={appointment.canModify}>
          <View style={styles.actionButtons}>
            <Button
              title="Demander un report"
              variant="outline"
              onPress={onRequestReschedule}
              style={styles.primaryButton}
            />
          </View>
        </ConditionalComponent>
      </ConditionalComponent>
    </View>
  );
};
