import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { UserProfile } from "../../../../shared/types/profile";

interface PersonalInfoCardProps {
  profile: UserProfile;
  style?: ViewStyle;
}

interface InfoItemProps {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  value: string;
  isStatus?: boolean;
}

const createInfoItemStyles = (
  colors: any,
  statusColor: string,
  isStatus: boolean
) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    label: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    value: {
      fontSize: 16,
      fontWeight: "600",
      color: statusColor,
    },
    statusIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: statusColor,
      marginRight: 8,
    },
    valueRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

const createCardStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      ...Platform.select({
        ios: {
          shadowColor: colors.isDark ? "#000000" : colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.5 : 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.5)"
            : "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
    },
  });

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  isStatus = false,
}) => {
  const colors = useThemeColors();

  const getStatusColor = () => {
    if (!isStatus) return colors.text;

    switch (value) {
      case "Actif":
        return colors.success;
      case "En congé":
        return colors.warning;
      case "Inactif":
        return colors.error;
      default:
        return colors.text;
    }
  };

  const statusColor = getStatusColor();
  const styles = createInfoItemStyles(colors, statusColor, isStatus);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <ConditionalComponent isValid={isStatus}>
            <View style={styles.statusIndicator} />
          </ConditionalComponent>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>
    </View>
  );
};

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  profile,
  style,
}) => {
  const colors = useThemeColors();

  const styles = createCardStyles(colors);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate.split("/").reverse().join("-"));
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = profile.personalInfo.dateOfBirth
    ? calculateAge(profile.personalInfo.dateOfBirth)
    : null;

  return (
    <View style={[styles.container, style]}>
      <InfoItem
        icon="phone"
        label="Téléphone"
        value={profile.personalInfo.phoneNumber}
      />

      <InfoItem
        icon="envelope"
        label="Email"
        value={profile.personalInfo.email}
      />

      <InfoItem
        icon="credit-card"
        label="Numéro de permis"
        value={profile.professionalInfo.driverId}
      />

      <InfoItem
        icon="circle"
        label="Statut"
        value={profile.professionalInfo.status}
        isStatus={true}
      />

      <ConditionalComponent isValid={!!age}>
        <InfoItem icon="calendar" label="Âge" value={`${age} ans`} />
      </ConditionalComponent>

      <ConditionalComponent isValid={!!profile.personalInfo.address}>
        <InfoItem
          icon="map-marker"
          label="Adresse"
          value={profile.personalInfo.address}
        />
      </ConditionalComponent>
    </View>
  );
};
