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
import { useThemeColors } from "../../../hooks/useTheme";

type IconType = keyof typeof FontAwesome.glyphMap;

interface IconButton {
  icon: IconType;
  onPress: () => void;
  badge?: number;
  size?: number;
  color?: string;
}

interface HeaderProps {
  title?: string;
  subtitle?: string;
  emoji?: string;

  leftIcon?: IconButton;

  rightIcons?: IconButton[];

  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  style?: ViewStyle;

  onTitlePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  emoji,
  leftIcon,
  rightIcons = [],
  backgroundColor,
  titleColor,
  subtitleColor,
  style,
  onTitlePress,
}) => {
  const colors = useThemeColors();

  const renderIconButton = (iconButton: IconButton, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.iconButton}
      onPress={iconButton.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FontAwesome
          name={iconButton.icon}
          size={iconButton.size || 24}
          color={iconButton.color || colors.icon}
        />
        {iconButton.badge && iconButton.badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {iconButton.badge > 99 ? "99+" : iconButton.badge}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderTitle = () => {
    if (!title && !subtitle) return <View style={styles.titleContainer} />;

    const TitleWrapper = onTitlePress ? TouchableOpacity : View;

    return (
      <TitleWrapper
        style={styles.titleContainer}
        onPress={onTitlePress}
        activeOpacity={onTitlePress ? 0.7 : 1}
      >
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: titleColor || colors.text }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        </View>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: subtitleColor || colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </TitleWrapper>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      minHeight: 60,
      backgroundColor: backgroundColor || colors.headerBackground,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.15,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      zIndex: 10,
    },
    leftSection: {
      width: 30,
      alignItems: "flex-start",
    },
    rightSection: {
      width: 100,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 12,
    },
    titleContainer: {
      flex: 1,
      alignItems: "flex-start",
      paddingHorizontal: 30,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      textAlign: "left",
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "400",
      textAlign: "left",
      marginTop: 2,
    },
    emoji: {
      fontSize: 18,
      marginLeft: 6,
    },
    iconButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 22,
      backgroundColor: colors.isDark
        ? colors.surfaceSecondary
        : "rgba(255, 255, 255, 0.7)",
    },
    iconContainer: {
      position: "relative",
    },
    badge: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
      ...Platform.select({
        ios: {
          shadowColor: colors.error,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    badgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Section gauche */}
      <View style={styles.leftSection}>
        {leftIcon && renderIconButton(leftIcon, -1)}
      </View>

      {/* Section centre/titre (aligné à gauche maintenant) */}
      {renderTitle()}

      {/* Section droite */}
      <View style={styles.rightSection}>
        {rightIcons.map((iconButton, index) =>
          renderIconButton(iconButton, index)
        )}
      </View>
    </View>
  );
};
