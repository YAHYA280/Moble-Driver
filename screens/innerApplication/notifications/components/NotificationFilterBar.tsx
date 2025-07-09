import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { NotificationPriority } from "../../../../shared/types";

type FilterType = "all" | "unread" | "read" | "pinned" | NotificationPriority;

interface FilterOption {
  id: FilterType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  count?: number;
}

interface NotificationFilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  notificationCounts: {
    all: number;
    unread: number;
    read: number;
    pinned: number;
    urgent: number;
    important: number;
    informative: number;
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
      id: "unread",
      label: "Non lues",
      icon: "radio-button-on",
      count: notificationCounts.unread,
    },
    {
      id: "read",
      label: "Lues",
      icon: "checkmark-circle",
      count: notificationCounts.read,
    },
    {
      id: "pinned",
      label: "Favorites",
      icon: "bookmark",
      count: notificationCounts.pinned,
    },
    {
      id: "urgent",
      label: "Urgentes",
      icon: "warning",
      count: notificationCounts.urgent,
    },
    {
      id: "important",
      label: "Importantes",
      icon: "alert-circle",
      count: notificationCounts.important,
    },
    {
      id: "informative",
      label: "Infos",
      icon: "information-circle",
      count: notificationCounts.informative,
    },
  ];

  const getFilterColors = (filterId: FilterType) => {
    switch (filterId) {
      case "urgent":
        return {
          activeColor: colors.error,
          activeBg: colors.error + "15",
          activeBorder: colors.error,
        };
      case "important":
        return {
          activeColor: colors.warning,
          activeBg: colors.warning + "15",
          activeBorder: colors.warning,
        };
      case "informative":
        return {
          activeColor: colors.info,
          activeBg: colors.info + "15",
          activeBorder: colors.info,
        };
      case "unread":
        return {
          activeColor: colors.primary,
          activeBg: colors.primary + "15",
          activeBorder: colors.primary,
        };
      case "read":
        return {
          activeColor: colors.success,
          activeBg: colors.success + "15",
          activeBorder: colors.success,
        };
      case "pinned":
        return {
          activeColor: colors.warning,
          activeBg: colors.warning + "15",
          activeBorder: colors.warning,
        };
      default:
        return {
          activeColor: colors.primary,
          activeBg: colors.primary + "15",
          activeBorder: colors.primary,
        };
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    scrollView: {
      paddingHorizontal: 16,
    },
    scrollContent: {
      paddingRight: 16,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 8,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: "transparent",
      minHeight: 36,
    },
    activeFilterButton: {
      borderColor: "transparent",
    },
    filterIcon: {
      marginRight: 6,
    },
    filterLabel: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    activeFilterLabel: {
      fontWeight: "600",
    },
    countContainer: {
      marginLeft: 6,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.textTertiary,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 5,
    },
    activeCountContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    countText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.surface,
    },
    activeCountText: {
      fontWeight: "700",
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
          const hasCount = option.count !== undefined && option.count > 0;

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
              <Ionicons
                name={option.icon}
                size={14}
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

              <ConditionalComponent isValid={hasCount}>
                <View
                  style={[
                    styles.countContainer,
                    isActive && styles.activeCountContainer,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isActive && {
                        color: filterColors.activeColor,
                      },
                      isActive && styles.activeCountText,
                    ]}
                  >
                    {option.count! > 99 ? "99+" : option.count!.toString()}
                  </Text>
                </View>
              </ConditionalComponent>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
