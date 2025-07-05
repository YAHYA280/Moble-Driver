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

// Interface pour le HomeCard
interface HomeCardProps {
  // Contenu
  title: string;
  description: string;

  // Icône
  icon: IconType;
  iconColor?: string;
  iconBackgroundColor?: string;

  // Styling
  backgroundColor?: string;
  style?: ViewStyle;

  // Action
  onPress: () => void;
  disabled?: boolean;
}

export const HomeCard: React.FC<HomeCardProps> = ({
  title,
  description,
  icon,
  iconColor = "#ffffff",
  iconBackgroundColor = "#6366f1",
  backgroundColor = "#ffffff",
  style,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Icône */}
      <View
        style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}
      >
        <FontAwesome name={icon} size={24} color={iconColor} />
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c2c2c",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#81919a",
    lineHeight: 18,
  },
});
