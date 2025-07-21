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

type IconType = keyof typeof FontAwesome.glyphMap;

interface ProfileMenuItemProps {
  icon: IconType;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
  showArrow?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const createStyles = (colors: any, showArrow: boolean, disabled: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 8,
      opacity: disabled ? 0.6 : 1,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 4px rgba(0, 0, 0, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.05)",
        },
      }),
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    contentContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    titleWithSubtitle: {
      marginBottom: 2,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    rightSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    value: {
      fontSize: 14,
      color: colors.textTertiary,
      marginRight: showArrow ? 8 : 0,
    },
    arrow: {
      marginLeft: 4,
    },
  });

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showArrow = true,
  disabled = false,
  style,
}) => {
  const colors = useThemeColors();

  const styles = createStyles(colors, showArrow, disabled);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={icon} size={20} color={colors.primary} />
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[styles.title, subtitle ? styles.titleWithSubtitle : null]}
        >
          {title}
        </Text>
        <ConditionalComponent isValid={!!subtitle}>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </ConditionalComponent>
      </View>

      <View style={styles.rightSection}>
        <ConditionalComponent isValid={!!value}>
          <Text style={styles.value}>{value}</Text>
        </ConditionalComponent>

        <ConditionalComponent isValid={showArrow}>
          <FontAwesome
            name="chevron-right"
            size={16}
            color={colors.textTertiary}
            style={styles.arrow}
          />
        </ConditionalComponent>
      </View>
    </TouchableOpacity>
  );
};
