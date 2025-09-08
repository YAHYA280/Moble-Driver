// screens/innerApplication/geolocation/components/FilterHeader.tsx
import { useThemeColors } from "@/hooks/useTheme";
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TripStatus } from "../../../../shared/types/geolocation";

interface FilterHeaderProps {
  selectedStatus: TripStatus | "Tous";
  onStatusChange: (status: TripStatus | "Tous") => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateFilterPress: () => void;
  onClearFilters: () => void;
  statusCounts: Record<string, number>;
  searchQuery: string;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  selectedStatus,
  onStatusChange,
  startDate,
  endDate,
  onDateFilterPress,
  onClearFilters,
  statusCounts,
  searchQuery,
}) => {
  const colors = useThemeColors();

  const statusOptions: Array<TripStatus | "Tous"> = [
    "Tous",
    "En cours",
    "A venir",
    "Termine",
    "Annule",
  ];

  const formatDateRange = () => {
    if (!startDate && !endDate) return "";
    if (startDate && !endDate)
      return `Depuis ${startDate.toLocaleDateString("fr-FR")}`;
    if (!startDate && endDate)
      return `Jusqu'au ${endDate.toLocaleDateString("fr-FR")}`;
    return `${startDate!.toLocaleDateString(
      "fr-FR"
    )} - ${endDate!.toLocaleDateString("fr-FR")}`;
  };

  const hasActiveFilters = !!(
    searchQuery ||
    selectedStatus !== "Tous" ||
    startDate ||
    endDate
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dateFilterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    activeDateFilterButton: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary,
    },
    dateFilterButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginLeft: 8,
    },
    activeDateFilterButtonText: {
      color: colors.primary,
    },
    statusFilterContainer: {
      marginBottom: 12,
    },
    statusFilterContent: {
      gap: 8,
    },
    statusFilterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeStatusFilterButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    statusFilterButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    activeStatusFilterButtonText: {
      color: "white",
    },
    clearFiltersButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.error + "15",
      alignSelf: "center",
    },
    clearFiltersText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.error,
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.container}>
      {/* Date Filter */}
      <TouchableOpacity
        style={[
          styles.dateFilterButton,
          (startDate || endDate) && styles.activeDateFilterButton,
        ]}
        onPress={onDateFilterPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name="calendar"
          size={16}
          color={startDate || endDate ? colors.primary : colors.textSecondary}
        />
        <Text
          style={[
            styles.dateFilterButtonText,
            (startDate || endDate) && styles.activeDateFilterButtonText,
          ]}
        >
          {startDate || endDate ? formatDateRange() : "Filtre de date"}
        </Text>
      </TouchableOpacity>

      {/* Status Filter Container */}
      <View style={styles.statusFilterContainer}>
        <FlatList
          horizontal
          data={statusOptions}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusFilterContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.statusFilterButton,
                selectedStatus === item && styles.activeStatusFilterButton,
              ]}
              onPress={() => onStatusChange(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusFilterButtonText,
                  selectedStatus === item &&
                    styles.activeStatusFilterButtonText,
                ]}
              >
                {item} ({statusCounts[item]})
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Clear Filters Button */}
      <ConditionalComponent isValid={hasActiveFilters}>
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={onClearFilters}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={16} color={colors.error} />
          <Text style={styles.clearFiltersText}>Effacer les filtres</Text>
        </TouchableOpacity>
      </ConditionalComponent>
    </View>
  );
};
