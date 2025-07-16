// screens/innerApplication/incidents/components/IncidentDetailsCard.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Incident } from "../../../../shared/types/incident";

interface IncidentDetailsCardProps {
  incident: Incident;
  style?: ViewStyle;
}

export const IncidentDetailsCard: React.FC<IncidentDetailsCardProps> = ({
  incident,
  style,
}) => {
  const colors = useThemeColors();

  const getPriorityConfig = () => {
    switch (incident.priority) {
      case "Élevée":
        return {
          color: colors.error,
          backgroundColor: colors.error + "15",
          icon: "exclamation-circle" as const,
        };
      case "Moyenne":
        return {
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "exclamation-triangle" as const,
        };
      case "Faible":
        return {
          color: colors.success,
          backgroundColor: colors.success + "15",
          icon: "info-circle" as const,
        };
    }
  };

  const priorityConfig = getPriorityConfig();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginTop: 16,
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
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: priorityConfig.backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    headerContent: {
      flex: 1,
    },
    incidentType: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    incidentDate: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    priorityBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: priorityConfig.backgroundColor,
      alignSelf: "flex-start",
    },
    priorityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: priorityConfig.color,
      marginRight: 6,
    },
    priorityText: {
      fontSize: 12,
      fontWeight: "600",
      color: priorityConfig.color,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    descriptionSection: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
    },
    detailsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    detailItem: {
      flex: 1,
      minWidth: "45%",
    },
    detailLabel: {
      fontSize: 13,
      color: colors.textTertiary,
      fontWeight: "500",
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "600",
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name={priorityConfig.icon}
            size={20}
            color={priorityConfig.color}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.incidentType}>{incident.type}</Text>
          <Text style={styles.incidentDate}>
            Signalé le {incident.reportDate}
          </Text>
        </View>
        <View style={styles.priorityBadge}>
          <View style={styles.priorityDot} />
          <Text style={styles.priorityText}>{incident.priority}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Description du problème</Text>
        <Text style={styles.description}>{incident.description}</Text>
      </View>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>ID de l&apos;incident</Text>
          <Text style={styles.detailValue}>#{incident.id}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Signalé par</Text>
          <Text style={styles.detailValue}>{incident.reportedBy}</Text>
        </View>
        {incident.location && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Localisation</Text>
            <Text style={styles.detailValue}>{incident.location}</Text>
          </View>
        )}
        {incident.resolvedDate && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Résolu le</Text>
            <Text style={styles.detailValue}>{incident.resolvedDate}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
