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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20, // Augmenté de 16 à 20
    marginHorizontal: 16,
    marginVertical: 8, // Augmenté de 6 à 8
    borderRadius: 16, // Augmenté de 12 à 16
    // Ombre améliorée selon le design
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
    }),
  },
  disabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 56, // Augmenté de 48 à 56
    height: 56, // Augmenté de 48 à 56
    borderRadius: 16, // Augmenté de 12 à 16
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18, // Augmenté de 16 à 18
    fontWeight: "700", // Augmenté de 600 à 700
    color: "#1f2937", // Couleur plus foncée
    marginBottom: 6, // Augmenté de 4 à 6
    letterSpacing: 0.3, // Améliore la lisibilité
  },
  description: {
    fontSize: 14, // Augmenté de 13 à 14
    color: "#6b7280", // Couleur améliorée
    lineHeight: 20, // Augmenté de 18 à 20
    fontWeight: "400",
  },
});
