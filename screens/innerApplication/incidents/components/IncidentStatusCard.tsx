// screens/innerApplication/incidents/components/IncidentStatusCard.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Incident } from "../../../../shared/types/incident";

interface IncidentStatusCardProps {
  incident: Incident;
  style?: ViewStyle;
}

export const IncidentStatusCard: React.FC<IncidentStatusCardProps> = ({
  incident,
  style,
}) => {
  const colors = useThemeColors();

  const getStatusConfig = () => {
    switch (incident.status) {
      case "En Cours":
        return {
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "clock-o" as const,
          title: "Incident en cours de traitement",
          description:
            "Votre signalement a été reçu et est actuellement en cours de traitement par notre équipe technique.",
        };
      case "Résolu":
        return {
          color: colors.success,
          backgroundColor: colors.success + "15",
          icon: "check-circle" as const,
          title: "Incident résolu",
          description:
            "Le problème signalé a été résolu avec succès par notre équipe technique.",
        };
      case "En attente":
        return {
          color: colors.error,
          backgroundColor: colors.error + "15",
          icon: "pause-circle" as const,
          title: "Incident en attente",
          description:
            "L'incident est en attente de traitement. Nous vous tiendrons informé dès qu'une action sera entreprise.",
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getTimelineSteps = () => {
    const steps = [
      {
        title: "Incident signalé",
        date: incident.reportDate,
        completed: true,
        icon: "flag" as const,
      },
      {
        title: "Prise en charge",
        date: incident.reportDate, // In real app, this would be a separate date
        completed: true,
        icon: "user" as const,
      },
      {
        title: "Intervention en cours",
        date: incident.status !== "En attente" ? incident.reportDate : null,
        completed: incident.status !== "En attente",
        icon: "wrench" as const,
      },
      {
        title: "Incident résolu",
        date: incident.resolvedDate,
        completed: incident.status === "Résolu",
        icon: "check" as const,
      },
    ];

    return steps;
  };

  const timelineSteps = getTimelineSteps();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    statusIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: statusConfig.backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    headerContent: {
      flex: 1,
    },
    statusTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: statusConfig.backgroundColor,
      alignSelf: "flex-start",
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: statusConfig.color,
    },
    description: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    timelineTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    timeline: {
      marginLeft: 8,
    },
    timelineStep: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    timelineStepLast: {
      marginBottom: 0,
    },
    timelineIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      position: "relative",
    },
    timelineIconCompleted: {
      backgroundColor: colors.primary,
    },
    timelineIconPending: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 2,
      borderColor: colors.border,
    },
    timelineStepContent: {
      flex: 1,
    },
    timelineStepTitle: {
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 2,
    },
    timelineStepTitleCompleted: {
      color: colors.text,
    },
    timelineStepTitlePending: {
      color: colors.textTertiary,
    },
    timelineStepDate: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    timelineLine: {
      position: "absolute",
      left: 15,
      top: 32,
      width: 2,
      height: 32,
      backgroundColor: colors.border,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusIcon}>
          <FontAwesome
            name={statusConfig.icon}
            size={20}
            color={statusConfig.color}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.statusTitle}>Statut de l&apos;incident</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{incident.status}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{statusConfig.description}</Text>

      {/* Timeline */}
      <Text style={styles.timelineTitle}>Suivi de l&apos;incident</Text>
      <View style={styles.timeline}>
        {timelineSteps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.timelineStep,
              index === timelineSteps.length - 1 && styles.timelineStepLast,
            ]}
          >
            <View
              style={[
                styles.timelineIconContainer,
                step.completed
                  ? styles.timelineIconCompleted
                  : styles.timelineIconPending,
              ]}
            >
              <FontAwesome
                name={step.icon}
                size={14}
                color={step.completed ? "white" : colors.textTertiary}
              />
              {index < timelineSteps.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>
            <View style={styles.timelineStepContent}>
              <Text
                style={[
                  styles.timelineStepTitle,
                  step.completed
                    ? styles.timelineStepTitleCompleted
                    : styles.timelineStepTitlePending,
                ]}
              >
                {step.title}
              </Text>
              {step.date && (
                <Text style={styles.timelineStepDate}>{step.date}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
