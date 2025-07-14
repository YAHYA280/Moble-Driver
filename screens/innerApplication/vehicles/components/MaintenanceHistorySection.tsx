// screens/innerApplication/vehicles/components/MaintenanceHistorySection.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
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

  const renderMaintenanceItem = (
    maintenance: MaintenanceRecord,
    index: number
  ) => (
    <TouchableOpacity
      key={maintenance.id}
      style={styles.maintenanceItem}
      onPress={() => onMaintenanceItemPress?.(maintenance)}
      activeOpacity={0.7}
    >
      <View style={styles.maintenanceIconContainer}>
        <FontAwesome name="wrench" size={14} color={colors.primary} />
      </View>
      <View style={styles.maintenanceContent}>
        <Text style={styles.maintenanceTitle}>Entretien technique 1</Text>
      </View>
      <Text style={styles.maintenanceDate}>14/08/2025</Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    seeAllButton: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
    },
    maintenanceItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "20",
    },
    maintenanceIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    maintenanceContent: {
      flex: 1,
    },
    maintenanceTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    maintenanceDate: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 32,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: "italic",
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Historique des entretiens</Text>
        {onSeeAllPress && !showAll && maintenanceHistory.length > 5 && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAllButton}>Voir tout</Text>
          </TouchableOpacity>
        )}
      </View>

      {displayedItems.length > 0 ? (
        displayedItems.map((maintenance, index) =>
          renderMaintenanceItem(maintenance, index)
        )
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucun entretien enregistré</Text>
        </View>
      )}
    </View>
  );
};

export { MaintenanceHistorySection };
