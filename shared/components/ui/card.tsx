// FILE: shared/components/ui/card.tsx
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

// Interface pour une action d'icône
interface IconAction {
  icon: IconType;
  onPress: () => void;
  size?: number;
  color?: string;
}

// Interface pour les badges/tags
interface Badge {
  text: string;
  backgroundColor?: string;
  textColor?: string;
}

// Interface principale du Card
interface CardProps {
  // Contenu principal
  title: string;
  subtitle?: string;
  description?: string;

  // Contenu secondaire (dates, status, etc.)
  metadata?: string; // Pour dates, heures, etc.
  status?: string; // Pour statuts

  // Icônes et actions
  leftIcon?: {
    icon: IconType;
    backgroundColor?: string;
    iconColor?: string;
    size?: number;
  };
  rightIcons?: IconAction[]; // Peut avoir plusieurs icônes à droite

  // Badges et tags
  badge?: Badge;

  // Styling
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  style?: ViewStyle;

  // Comportement
  onPress?: () => void;
  disabled?: boolean;

  // Layout
  layout?: "default" | "compact" | "detailed";
}

export const card: React.FC<CardProps> = ({
  title,
  subtitle,
  description,
  metadata,
  status,
  leftIcon,
  rightIcons = [],
  badge,
  backgroundColor = "#ffffff",
  borderColor = "#f0f0f0",
  borderWidth = 1,
  borderRadius = 12,
  padding = 16,
  margin = 8,
  style,
  onPress,
  disabled = false,
  layout = "default",
}) => {
  // Rendu de l'icône gauche
  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return (
      <View
        style={[
          styles.leftIconContainer,
          {
            backgroundColor: leftIcon.backgroundColor || "#f8f9fa",
          },
        ]}
      >
        <FontAwesome
          name={leftIcon.icon}
          size={leftIcon.size || 20}
          color={leftIcon.iconColor || "#6366f1"}
        />
      </View>
    );
  };

  // Rendu des icônes droite
  const renderRightIcons = () => {
    if (rightIcons.length === 0) return null;

    return (
      <View style={styles.rightIconsContainer}>
        {rightIcons.map((iconAction, index) => (
          <TouchableOpacity
            key={index}
            style={styles.rightIconButton}
            onPress={iconAction.onPress}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <FontAwesome
              name={iconAction.icon}
              size={iconAction.size || 18}
              color={iconAction.color || "#666"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Rendu du badge
  const renderBadge = () => {
    if (!badge) return null;

    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: badge.backgroundColor || "#e3f2fd",
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            {
              color: badge.textColor || "#1976d2",
            },
          ]}
        >
          {badge.text}
        </Text>
      </View>
    );
  };

  // Rendu du contenu principal selon le layout
  const renderContent = () => {
    switch (layout) {
      case "compact":
        return (
          <View style={styles.contentContainer}>
            <View style={styles.mainContent}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {metadata && (
                <Text style={styles.metadata} numberOfLines={1}>
                  {metadata}
                </Text>
              )}
            </View>
            {status && (
              <Text style={styles.status} numberOfLines={1}>
                {status}
              </Text>
            )}
          </View>
        );

      case "detailed":
        return (
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {renderBadge()}
            </View>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
            {description && (
              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
            )}
            <View style={styles.metadataRow}>
              {metadata && <Text style={styles.metadata}>{metadata}</Text>}
              {status && <Text style={styles.status}>{status}</Text>}
            </View>
          </View>
        );

      default: // "default"
        return (
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {renderBadge()}
            </View>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
            {description && (
              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
            )}
            {(metadata || status) && (
              <View style={styles.footerRow}>
                {metadata && <Text style={styles.metadata}>{metadata}</Text>}
                {status && <Text style={styles.status}>{status}</Text>}
              </View>
            )}
          </View>
        );
    }
  };

  // Container principal
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
          borderWidth,
          borderRadius,
          padding,
          margin,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.cardContent}>
        {renderLeftIcon()}
        {renderContent()}
        {renderRightIcons()}
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    opacity: 0.6,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  leftIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  mainContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c2c2c",
    flex: 1,
    marginRight: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#81919a",
    lineHeight: 18,
    marginBottom: 8,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  metadata: {
    fontSize: 12,
    color: "#81919a",
    fontWeight: "400",
  },
  status: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 8,
  },
  rightIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
