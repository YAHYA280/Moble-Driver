import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_COLORS,
  APPOINTMENT_TYPE_LABELS,
  Appointment,
} from "../../../../shared/types/calendar";

interface AppointmentDetailsCardProps {
  appointment: Appointment;
}

const formatTime = (time: string) => time.substring(0, 5);

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailIcon: {
    width: 24,
    marginRight: 16,
    alignItems: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailSubValue: {
    fontSize: 14,
    marginTop: 2,
  },
});

export const AppointmentDetailsCard: React.FC<AppointmentDetailsCardProps> = ({
  appointment,
}) => {
  const colors = useThemeColors();

  const getStatusColor = () => {
    switch (appointment.status) {
      case "confirme":
        return colors.success;
      case "prevu":
        return colors.warning;
      case "annule":
        return colors.error;
      case "reporte":
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const typeColor = APPOINTMENT_TYPE_COLORS[appointment.type];

  const dynamicStyles = {
    card: {
      ...styles.card,
      backgroundColor: colors.card,
      borderLeftColor: typeColor,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: { elevation: 8 },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    icon: {
      ...styles.icon,
      backgroundColor: typeColor + "20",
    },
    title: {
      ...styles.title,
      color: colors.text,
    },
    type: {
      ...styles.type,
      color: typeColor,
      backgroundColor: typeColor + "15",
    },
    statusText: {
      ...styles.statusText,
      color: getStatusColor(),
    },
    statusDot: {
      ...styles.statusDot,
      backgroundColor: getStatusColor(),
    },
    detailRow: {
      ...styles.detailRow,
      borderBottomColor: colors.border + "30",
    },
    detailLabel: {
      ...styles.detailLabel,
      color: colors.textSecondary,
    },
    detailValue: {
      ...styles.detailValue,
      color: colors.text,
    },
    detailSubValue: {
      ...styles.detailSubValue,
      color: colors.textSecondary,
    },
  };

  return (
    <View style={dynamicStyles.card}>
      <View style={styles.header}>
        <View style={dynamicStyles.icon}>
          <FontAwesome name="calendar" size={24} color={typeColor} />
        </View>
        <View style={styles.info}>
          <Text style={dynamicStyles.title}>{appointment.title}</Text>
          <Text style={dynamicStyles.type}>
            {APPOINTMENT_TYPE_LABELS[appointment.type]}
          </Text>
          <View style={styles.statusContainer}>
            <View style={dynamicStyles.statusDot} />
            <Text style={dynamicStyles.statusText}>
              {APPOINTMENT_STATUS_LABELS[appointment.status]}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={dynamicStyles.detailRow}>
          <View style={styles.detailIcon}>
            <FontAwesome
              name="calendar-o"
              size={16}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.detailContent}>
            <Text style={dynamicStyles.detailLabel}>Date</Text>
            <Text style={dynamicStyles.detailValue}>
              {formatDate(appointment.date)}
            </Text>
          </View>
        </View>

        <View style={dynamicStyles.detailRow}>
          <View style={styles.detailIcon}>
            <FontAwesome
              name="clock-o"
              size={16}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.detailContent}>
            <Text style={dynamicStyles.detailLabel}>Horaire</Text>
            <Text style={dynamicStyles.detailValue}>
              {formatTime(appointment.startTime)} -{" "}
              {formatTime(appointment.endTime)}
            </Text>
          </View>
        </View>

        <View style={dynamicStyles.detailRow}>
          <View style={styles.detailIcon}>
            <FontAwesome
              name="map-marker"
              size={16}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.detailContent}>
            <Text style={dynamicStyles.detailLabel}>Lieu</Text>
            <Text style={dynamicStyles.detailValue}>
              {appointment.location}
            </Text>
            <ConditionalComponent isValid={!!appointment.center}>
              <Text style={dynamicStyles.detailSubValue}>
                {appointment.center?.address}
              </Text>
            </ConditionalComponent>
          </View>
        </View>

        <ConditionalComponent isValid={!!appointment.contact}>
          <View style={dynamicStyles.detailRow}>
            <View style={styles.detailIcon}>
              <FontAwesome name="user" size={16} color={colors.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={dynamicStyles.detailLabel}>Contact</Text>
              <Text style={dynamicStyles.detailValue}>
                {appointment.contact?.name}
              </Text>
              <Text style={dynamicStyles.detailSubValue}>
                {appointment.contact?.role}
              </Text>
            </View>
          </View>
        </ConditionalComponent>

        <ConditionalComponent isValid={!!appointment.description}>
          <View style={dynamicStyles.detailRow}>
            <View style={styles.detailIcon}>
              <FontAwesome
                name="info-circle"
                size={16}
                color={colors.textSecondary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={dynamicStyles.detailLabel}>Description</Text>
              <Text style={dynamicStyles.detailValue}>
                {appointment.description}
              </Text>
            </View>
          </View>
        </ConditionalComponent>
      </View>
    </View>
  );
};
