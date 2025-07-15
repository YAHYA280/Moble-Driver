import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { MaintenanceRecord } from "../../../../shared/types/vehicle";

interface MaintenanceHistorySectionProps {
  maintenanceHistory: MaintenanceRecord[];
  onSeeAllPress?: () => void;
  onMaintenanceItemPress?: (maintenance: MaintenanceRecord) => void;
  style?: ViewStyle;
  showAll?: boolean;
}

const AnimatedMaintenanceItem: React.FC<{
  maintenance: MaintenanceRecord;
  index: number;
  onPress?: (maintenance: MaintenanceRecord) => void;
}> = ({ maintenance, index, onPress }) => {
  const colors = useThemeColors();
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index, animValue]);

  const getIconBackgroundColor = () => {
    return colors.primary;
  };

  const styles = StyleSheet.create({
    maintenanceItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: getIconBackgroundColor(),
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
    },
    maintenanceTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    maintenanceDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "center",
      marginLeft: 12,
    },
    maintenanceDate: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "400",
    },
  });

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={styles.maintenanceItem}
        onPress={() => onPress?.(maintenance)}
        activeOpacity={0.7}
      >
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome name="wrench" size={20} color="white" />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.maintenanceTitle} numberOfLines={1}>
            {maintenance.type}
          </Text>
          {maintenance.description && (
            <Text style={styles.maintenanceDescription} numberOfLines={1}>
              {maintenance.description}
            </Text>
          )}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          <Text style={styles.maintenanceDate}>{maintenance.date}</Text>
          {maintenance.cost && (
            <Text style={styles.maintenanceDescription}>
              {maintenance.cost}€
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MaintenanceHistorySection: React.FC<MaintenanceHistorySectionProps> = ({
  maintenanceHistory,
  onSeeAllPress,
  onMaintenanceItemPress,
  style,
  showAll = false,
}) => {
  const colors = useThemeColors();

  const displayedItems = showAll
    ? maintenanceHistory
    : maintenanceHistory.slice(0, 5);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: 0.3,
    },
    seeAllButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.primary + "15",
    },
    seeAllButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      letterSpacing: 0.2,
    },
    maintenanceList: {
      marginHorizontal: -16,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    emptyIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Historique des entretiens</Text>
        <ConditionalComponent
          isValid={!!onSeeAllPress && !showAll && maintenanceHistory.length > 5}
        >
          <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAllPress}>
            <Text style={styles.seeAllButtonText}>Voir tout</Text>
          </TouchableOpacity>
        </ConditionalComponent>
      </View>

      <View style={styles.maintenanceList}>
        <ConditionalComponent
          isValid={displayedItems.length > 0}
          defaultComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <FontAwesome
                  name="wrench"
                  size={24}
                  color={colors.textTertiary}
                />
              </View>
              <Text style={styles.emptyTitle}>Aucun entretien enregistré</Text>
              <Text style={styles.emptyText}>
                L&apos;historique des entretiens apparaîtra ici une fois
                qu&apos;ils seront effectués.
              </Text>
            </View>
          }
        >
          <>
            {displayedItems.map((maintenance, index) => (
              <AnimatedMaintenanceItem
                key={maintenance.id}
                maintenance={maintenance}
                index={index}
                onPress={onMaintenanceItemPress}
              />
            ))}
          </>
        </ConditionalComponent>
      </View>
    </View>
  );
};

export { MaintenanceHistorySection };
