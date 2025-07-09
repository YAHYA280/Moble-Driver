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
import { useThemeColors } from "../../../hooks/useTheme";

type IconType = keyof typeof FontAwesome.glyphMap;

interface SidebarItem {
  id: string;
  label: string;
  icon: IconType;
  onPress: () => void;
  badge?: number;
  isActive?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  style?: ViewStyle;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  title,
  style,
  onClose,
  showCloseButton = true,
}) => {
  const colors = useThemeColors();

  const renderItem = (item: SidebarItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.item,
        {
          backgroundColor: item.isActive
            ? colors.primary + "15"
            : "transparent",
          borderLeftColor: item.isActive ? colors.primary : "transparent",
        },
      ]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemLeft}>
          <FontAwesome
            name={item.icon}
            size={18}
            color={item.isActive ? colors.primary : colors.iconSecondary}
            style={styles.itemIcon}
          />
          <Text
            style={[
              styles.itemLabel,
              {
                color: item.isActive ? colors.primary : colors.textSecondary,
                fontWeight: item.isActive ? "600" : "500",
              },
            ]}
          >
            {item.label}
          </Text>
        </View>

        <ConditionalComponent isValid={!!(item.badge && item.badge > 0)}>
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <Text style={styles.badgeText}>
              {item.badge && item.badge > 99 ? "99+" : item.badge}
            </Text>
          </View>
        </ConditionalComponent>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "2px 0 8px rgba(0, 0, 0, 0.3)"
            : "2px 0 8px rgba(0, 0, 0, 0.1)",
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
      paddingTop: 8,
    },
    item: {
      marginHorizontal: 8,
      marginVertical: 2,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: "transparent",
    },
    itemContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    itemLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    itemIcon: {
      marginRight: 12,
    },
    itemLabel: {
      fontSize: 16,
      flex: 1,
    },
    badge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
    },
    badgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
  });

  return (
    <View style={[styles.container, style]}>
      <ConditionalComponent isValid={!!(title || showCloseButton)}>
        <View style={styles.header}>
          <ConditionalComponent isValid={!!title}>
            <Text style={styles.title}>{title}</Text>
          </ConditionalComponent>

          <ConditionalComponent isValid={showCloseButton && !!onClose}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome
                name="times"
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </ConditionalComponent>
        </View>
      </ConditionalComponent>

      <View style={styles.content}>{items.map(renderItem)}</View>
    </View>
  );
};
