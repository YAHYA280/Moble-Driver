// screens/innerApplication/vehicles/components/MaintenanceHistorySection.tsx
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
    const delay = index * 100; // Stagger animation by 100ms per item
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index, animValue]);

  const styles = StyleSheet.create({
    maintenanceItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "20",
    },
    maintenanceIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    maintenanceContent: {
      flex: 1,
    },
    maintenanceTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
      letterSpacing: 0.2,
    },
    maintenanceDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    maintenanceDate: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
      letterSpacing: 0.2,
    },
    chevron: {
      marginLeft: 8,
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
        <View style={styles.maintenanceIconContainer}>
          <FontAwesome name="wrench" size={16} color={colors.primary} />
        </View>
        <View style={styles.maintenanceContent}>
          <Text style={styles.maintenanceTitle}>{maintenance.type}</Text>
          {maintenance.description && (
            <Text style={styles.maintenanceDescription}>
              {maintenance.description}
            </Text>
          )}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.maintenanceDate}>{maintenance.date}</Text>
          {maintenance.cost && (
            <Text style={styles.maintenanceDescription}>
              {maintenance.cost}€
            </Text>
          )}
        </View>
        <FontAwesome
          name="chevron-right"
          size={12}
          color={colors.textTertiary}
          style={styles.chevron}
        />
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
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
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
    maintenanceList: {},
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
        {onSeeAllPress && !showAll && maintenanceHistory.length > 5 && (
          <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAllPress}>
            <Text style={styles.seeAllButtonText}>Voir tout</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.maintenanceList}>
        {displayedItems.length > 0 ? (
          displayedItems.map((maintenance, index) => (
            <AnimatedMaintenanceItem
              key={maintenance.id}
              maintenance={maintenance}
              index={index}
              onPress={onMaintenanceItemPress}
            />
          ))
        ) : (
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
        )}
      </View>
    </View>
  );
};

export { MaintenanceHistorySection };
