// shared/components/ui/NotificationFilterBar.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { NotificationPriority } from "../../../../shared/types";

type FilterType = "all" | NotificationPriority | "history";

interface FilterOption {
  id: FilterType;
  label: string;
  icon: keyof typeof FontAwesome.glyphMap;
  count?: number;
}

interface NotificationFilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  notificationCounts: {
    all: number;
    urgent: number;
    important: number;
    informative: number;
    history: number;
  };
  style?: ViewStyle;
}

export const NotificationFilterBar: React.FC<NotificationFilterBarProps> = ({
  activeFilter,
  onFilterChange,
  notificationCounts,
  style,
}) => {
  const colors = useThemeColors();

  const filterOptions: FilterOption[] = [
    {
      id: "all",
      label: "Toutes",
      icon: "list",
      count: notificationCounts.all,
    },
    {
      id: "urgent",
      label: "Urgentes",
      icon: "exclamation-triangle",
      count: notificationCounts.urgent,
    },
    {
      id: "important",
      label: "Importantes",
      icon: "exclamation-circle",
      count: notificationCounts.important,
    },
    {
      id: "informative",
      label: "Informatives",
      icon: "info-circle",
      count: notificationCounts.informative,
    },
    {
      id: "history",
      label: "Historique",
      icon: "history",
      count: notificationCounts.history,
    },
  ];

  const getFilterColors = (filterId: FilterType) => {
    switch (filterId) {
      case "urgent":
        return {
          activeColor: colors.error,
          activeBg: colors.error + "15",
          activeBorder: colors.error + "30",
        };
      case "important":
        return {
          activeColor: colors.warning,
          activeBg: colors.warning + "15",
          activeBorder: colors.warning + "30",
        };
      case "informative":
        return {
          activeColor: colors.info,
          activeBg: colors.info + "15",
          activeBorder: colors.info + "30",
        };
      case "history":
        return {
          activeColor: colors.textSecondary,
          activeBg: colors.textSecondary + "15",
          activeBorder: colors.textSecondary + "30",
        };
      default:
        return {
          activeColor: colors.primary,
          activeBg: colors.primary + "15",
          activeBorder: colors.primary + "30",
        };
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.2 : 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 4px rgba(0, 0, 0, 0.2)"
            : "0 2px 4px rgba(0, 0, 0, 0.05)",
        },
      }),
    },
    scrollView: {
      paddingHorizontal: 12,
    },
    scrollContent: {
      paddingHorizontal: 4,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginHorizontal: 4,
      borderRadius: 20,
      borderWidth: 1,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      minHeight: 36,
    },
    activeFilterButton: {
      borderWidth: 1.5,
    },
    filterIcon: {
      marginRight: 6,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    activeFilterLabel: {
      fontWeight: "600",
    },
    countBadge: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
      paddingHorizontal: 6,
    },
    activeCountBadge: {
      backgroundColor: colors.surface,
    },
    countText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.surface,
    },
    activeCountText: {
      color: colors.primary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.id;
          const filterColors = getFilterColors(option.id);

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterButton,
                isActive && {
                  backgroundColor: filterColors.activeBg,
                  borderColor: filterColors.activeBorder,
                },
                isActive && styles.activeFilterButton,
              ]}
              onPress={() => onFilterChange(option.id)}
              activeOpacity={0.7}
            >
              <FontAwesome
                name={option.icon}
                size={16}
                color={
                  isActive ? filterColors.activeColor : colors.textSecondary
                }
                style={styles.filterIcon}
              />
              <Text
                style={[
                  styles.filterLabel,
                  isActive && {
                    color: filterColors.activeColor,
                  },
                  isActive && styles.activeFilterLabel,
                ]}
              >
                {option.label}
              </Text>
              {option.count !== undefined && option.count > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    isActive && {
                      backgroundColor: filterColors.activeColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isActive && {
                        color: colors.surface,
                      },
                    ]}
                  >
                    {option.count > 99 ? "99+" : option.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
