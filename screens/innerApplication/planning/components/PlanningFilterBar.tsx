// screens/innerApplication/planning/components/PlanningFilterBar.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";
import {
  PlanningFilters,
  TRIP_STATUS_LABELS,
  TRIP_TYPE_LABELS,
  TripStatus,
  TripType,
} from "../../../../shared/types/planning";

interface PlanningFilterBarProps {
  filters: PlanningFilters;
  onFiltersChange: (filters: Partial<PlanningFilters>) => void;
  onClearFilters: () => void;
  onViewToggle: () => void;
  currentView: "month" | "week" | "day" | "list";
  style?: ViewStyle;
}

export const PlanningFilterBar: React.FC<PlanningFilterBarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  onViewToggle,
  currentView,
  style,
}) => {
  const colors = useThemeColors();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [localFilters, setLocalFilters] = useState<PlanningFilters>(filters);

  const tripTypes: TripType[] = ["ecole", "transport", "maintenance", "autre"];
  const tripStatuses: TripStatus[] = ["prevu", "en_cours", "termine", "annule"];

  const activeFiltersCount = Object.keys(filters).filter(
    (key) =>
      key !== "searchQuery" &&
      filters[key as keyof PlanningFilters] !== undefined &&
      (Array.isArray(filters[key as keyof PlanningFilters])
        ? (filters[key as keyof PlanningFilters] as any[]).length > 0
        : true)
  ).length;

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onClearFilters();
    setShowFilterModal(false);
  };

  const handleTypeToggle = (type: TripType) => {
    setLocalFilters((prev) => {
      const currentTypes = prev.type || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter((t) => t !== type)
        : [...currentTypes, type];

      return {
        ...prev,
        type: newTypes.length > 0 ? newTypes : undefined,
      };
    });
  };

  const handleStatusToggle = (status: TripStatus) => {
    setLocalFilters((prev) => {
      const currentStatuses = prev.status || [];
      const newStatuses = currentStatuses.includes(status)
        ? currentStatuses.filter((s) => s !== status)
        : [...currentStatuses, status];

      return {
        ...prev,
        status: newStatuses.length > 0 ? newStatuses : undefined,
      };
    });
  };

  const getActiveFiltersDisplay = () => {
    const displays = [];

    if (filters.type && filters.type.length > 0) {
      displays.push(`${filters.type.length} type(s)`);
    }

    if (filters.status && filters.status.length > 0) {
      displays.push(`${filters.status.length} statut(s)`);
    }

    return displays.join(", ");
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    filterLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
    },
    activeFilterButton: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginLeft: 6,
    },
    activeFilterButtonText: {
      color: colors.primary,
      fontWeight: "600",
    },
    badge: {
      position: "absolute",
      top: -6,
      right: -6,
      backgroundColor: colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
    },
    badgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
    clearButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
    },
    clearButtonText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    viewToggleButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.primary + "15",
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    viewToggleText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 6,
    },
    activeFiltersText: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: 4,
      fontStyle: "italic",
    },
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      width: "90%",
      maxWidth: 400,
      maxHeight: "80%",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    filterSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    optionRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    optionChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeOptionChip: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary,
    },
    optionText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    activeOptionText: {
      color: colors.primary,
      fontWeight: "600",
    },
    modalActions: {
      flexDirection: "row",
      gap: 12,
      marginTop: 20,
    },
  });

  return (
    <>
      <View style={[styles.container, style]}>
        <View style={styles.filterRow}>
          <View style={styles.filterLeft}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFiltersCount > 0 && styles.activeFilterButton,
              ]}
              onPress={() => setShowFilterModal(true)}
              activeOpacity={0.7}
            >
              <FontAwesome
                name="filter"
                size={14}
                color={
                  activeFiltersCount > 0 ? colors.primary : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.filterButtonText,
                  activeFiltersCount > 0 && styles.activeFilterButtonText,
                ]}
              >
                Filtrer
              </Text>
              {activeFiltersCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{activeFiltersCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {activeFiltersCount > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearFilters}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>Effacer</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.viewToggleButton}
            onPress={onViewToggle}
            activeOpacity={0.7}
          >
            <FontAwesome
              name={currentView === "month" ? "list" : "calendar"}
              size={14}
              color={colors.primary}
            />
            <Text style={styles.viewToggleText}>
              {currentView === "month" ? "Liste" : "Calendrier"}
            </Text>
          </TouchableOpacity>
        </View>

        {activeFiltersCount > 0 && (
          <Text style={styles.activeFiltersText}>
            Filtres actifs: {getActiveFiltersDisplay()}
          </Text>
        )}
      </View>

      <Modal
        visible={showFilterModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View style={styles.modal}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Filtrer les trajets</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowFilterModal(false)}
                  >
                    <FontAwesome
                      name="times"
                      size={18}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Type Filter */}
                  <View style={styles.filterSection}>
                    <Text style={styles.sectionTitle}>Types de trajets</Text>
                    <View style={styles.optionRow}>
                      {tripTypes.map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.optionChip,
                            localFilters.type?.includes(type) &&
                              styles.activeOptionChip,
                          ]}
                          onPress={() => handleTypeToggle(type)}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              localFilters.type?.includes(type) &&
                                styles.activeOptionText,
                            ]}
                          >
                            {TRIP_TYPE_LABELS[type]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Status Filter */}
                  <View style={styles.filterSection}>
                    <Text style={styles.sectionTitle}>Statuts</Text>
                    <View style={styles.optionRow}>
                      {tripStatuses.map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.optionChip,
                            localFilters.status?.includes(status) &&
                              styles.activeOptionChip,
                          ]}
                          onPress={() => handleStatusToggle(status)}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              localFilters.status?.includes(status) &&
                                styles.activeOptionText,
                            ]}
                          >
                            {TRIP_STATUS_LABELS[status]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <Button
                    title="Effacer"
                    variant="outline"
                    onPress={handleClearFilters}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Appliquer"
                    onPress={handleApplyFilters}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};
