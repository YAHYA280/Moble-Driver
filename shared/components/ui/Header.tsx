import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// Types pour les icônes Font Awesome
type IconType = keyof typeof FontAwesome.glyphMap;

// Interface pour un bouton d'icône
interface IconButton {
  icon: IconType;
  onPress: () => void;
  badge?: number; // Pour les notifications
  size?: number;
  color?: string;
}

// Interface principale du Header
interface HeaderProps {
  // Contenu principal
  title?: string;
  subtitle?: string;
  emoji?: string; // Pour les emojis comme 👋 🚗 etc.

  // Icône gauche (généralement retour ou menu)
  leftIcon?: IconButton;

  // Icônes droite (peut être 1 ou 2 icônes)
  rightIcons?: IconButton[];

  // Styling
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  style?: ViewStyle;

  // Comportement
  onTitlePress?: () => void; // Si le titre est cliquable
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  emoji,
  leftIcon,
  rightIcons = [],
  backgroundColor = "#fefeff",
  titleColor = "#2c2c2c",
  subtitleColor = "#81919a",
  style,
  onTitlePress,
}) => {
  // Rendu d'un bouton d'icône avec badge optionnel
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
          color={iconButton.color || "#2c2c2c"}
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

  // Rendu du contenu central (titre + sous-titre + emoji)
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
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
          {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        </View>
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: subtitleColor }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </TitleWrapper>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {/* Section gauche */}
      <View style={styles.leftSection}>
        {leftIcon && renderIconButton(leftIcon, -1)}
      </View>

      {/* Section centre */}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  leftSection: {
    width: 50,
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
    alignItems: "center",
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
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
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
