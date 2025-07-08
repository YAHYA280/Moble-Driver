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

interface HomeCardProps {
  title: string;
  description: string;

  icon: IconType;
  iconColor?: string;
  iconBackgroundColor?: string;

  backgroundColor?: string;
  style?: ViewStyle;

  onPress: () => void;
  disabled?: boolean;
}

export const HomeCard: React.FC<HomeCardProps> = ({
  title,
  description,
  icon,
  iconColor = "#ffffff",
  iconBackgroundColor = "#6366f1",
  backgroundColor,
  style,
  onPress,
  disabled = false,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      backgroundColor: backgroundColor || colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    disabled: {
      opacity: 0.6,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      backgroundColor: iconBackgroundColor,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
      letterSpacing: 0.3,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      fontWeight: "400",
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Icône */}
      <View style={styles.iconContainer}>
        <FontAwesome name={icon} size={26} color={iconColor} />
      </View>

      {/* Contenu texte */}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
