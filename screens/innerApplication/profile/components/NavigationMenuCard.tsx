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
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";

interface NavigationMenuItem {
  id: string;
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  subtitle?: string;
  onPress: () => void;
}

interface NavigationMenuCardProps {
  title: string;
  items: NavigationMenuItem[];
  style?: ViewStyle;
}

const createNavigationItemStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginHorizontal: 8,
      marginVertical: 2,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    arrowContainer: {
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
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
  });

const NavigationItem: React.FC<{ item: NavigationMenuItem }> = ({ item }) => {
  const colors = useThemeColors();
  const styles = createNavigationItemStyles(colors);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={item.icon} size={18} color={colors.primary} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.label}>{item.label}</Text>
        <ConditionalComponent isValid={!!item.subtitle}>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </ConditionalComponent>
      </View>

      <View style={styles.arrowContainer}>
        <FontAwesome
          name="chevron-right"
          size={14}
          color={colors.textTertiary}
        />
      </View>
    </TouchableOpacity>
  );
};

export const NavigationMenuCard: React.FC<NavigationMenuCardProps> = ({
  title,
  items,
  style,
}) => {
  const colors = useThemeColors();
  const styles = createCardStyles(colors);

  return (
    <View style={[styles.container, style]}>
      {items.map((item) => (
        <NavigationItem key={item.id} item={item} />
      ))}
    </View>
  );
};
