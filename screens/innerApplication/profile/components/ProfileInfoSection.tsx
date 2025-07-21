import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Input } from "../../../../shared/components/ui/Input";
import { PersonalInfo } from "../../../../shared/types/profile";

type IconType = keyof typeof FontAwesome.glyphMap;

interface InfoItem {
  id: string;
  label: string;
  value: string;
  icon: IconType;
  editable?: boolean;
  type?: "text" | "email" | "phone";
}

interface ProfileInfoSectionProps {
  title: string;
  personalInfo: PersonalInfo;
  isEditMode?: boolean;
  pendingChanges?: Partial<PersonalInfo>;
  onValueChange?: (field: keyof PersonalInfo, value: string) => void;
  onEditPress?: () => void;
  style?: ViewStyle;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginHorizontal: 16,
      marginTop: -40,
      marginBottom: 16,
      paddingVertical: 24,
      paddingHorizontal: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }),
      zIndex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: 0.3,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
    },
    editButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 6,
    },
    infoItem: {
      marginBottom: 20,
    },
    infoHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
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
    infoLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      letterSpacing: 0.2,
    },
    valueContainer: {
      marginLeft: 44,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      letterSpacing: 0.3,
    },
  });

export const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  title,
  personalInfo,
  isEditMode = false,
  pendingChanges = {},
  onValueChange,
  onEditPress,
  style,
}) => {
  const colors = useThemeColors();

  const styles = createStyles(colors);

  const infoItems: InfoItem[] = [
    {
      id: "fullName",
      label: "Nom et prénom",
      value: pendingChanges.fullName || personalInfo.fullName,
      icon: "user",
      editable: true,
    },
    {
      id: "phoneNumber",
      label: "Numéro du téléphone",
      value: pendingChanges.phoneNumber || personalInfo.phoneNumber,
      icon: "phone",
      editable: true,
      type: "phone",
    },
    {
      id: "email",
      label: "E-mail",
      value: pendingChanges.email || personalInfo.email,
      icon: "envelope",
      editable: true,
      type: "email",
    },
    {
      id: "driverId",
      label: "Numéro du permis",
      value: "836579376558449",
      icon: "credit-card",
      editable: false,
    },
    {
      id: "yearsExperience",
      label: "Années d'expériences",
      value: "10",
      icon: "calendar",
      editable: false,
    },
  ];

  const renderInfoItem = (item: InfoItem) => {
    const getValue = () => {
      if (item.id === "fullName")
        return pendingChanges.fullName || personalInfo.fullName;
      if (item.id === "phoneNumber")
        return pendingChanges.phoneNumber || personalInfo.phoneNumber;
      if (item.id === "email")
        return pendingChanges.email || personalInfo.email;
      return item.value;
    };

    return (
      <View key={item.id} style={styles.infoItem}>
        <View style={styles.infoHeader}>
          <View style={styles.iconContainer}>
            <FontAwesome name={item.icon} size={16} color={colors.primary} />
          </View>
          <Text style={styles.infoLabel}>{item.label}</Text>
        </View>

        <ConditionalComponent
          isValid={Boolean(isEditMode && item.editable)}
          defaultComponent={
            <View style={styles.valueContainer}>
              <Text style={styles.infoValue}>{getValue()}</Text>
            </View>
          }
        >
          <Input
            value={getValue()}
            onChangeText={(value) => {
              if (onValueChange && item.editable) {
                const field = item.id as keyof PersonalInfo;
                onValueChange(field, value);
              }
            }}
            size="small"
            placeholder={item.label}
            keyboardType={
              item.type === "email"
                ? "email-address"
                : item.type === "phone"
                ? "phone-pad"
                : "default"
            }
            editable={item.editable}
          />
        </ConditionalComponent>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <ConditionalComponent isValid={!!onEditPress}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditPress}
            activeOpacity={0.7}
          >
            <FontAwesome
              name={isEditMode ? "check" : "edit"}
              size={14}
              color={colors.primary}
            />
            <Text style={styles.editButtonText}>
              {isEditMode ? "Sauvegarder" : "Modifier"}
            </Text>
          </TouchableOpacity>
        </ConditionalComponent>
      </View>

      {infoItems.map(renderInfoItem)}
    </View>
  );
};
