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
import { RouteSheetFilters } from "../../../../shared/types/routeSheet";

interface RouteSheetFilterBarProps {
  filters: RouteSheetFilters;
  onFiltersChange: (filters: Partial<RouteSheetFilters>) => void;
  onClearFilters: () => void;
  style?: ViewStyle;
}

export const RouteSheetFilterBar: React.FC<RouteSheetFilterBarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  style,
}) => {
  const colors = useThemeColors();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [localFilters, setLocalFilters] = useState<RouteSheetFilters>(filters);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  // Remove status options since we're not using status filtering anymore
  const activeFiltersCount = Object.keys(filters).filter(
    (key) =>
      key !== "searchQuery" &&
      filters[key as keyof RouteSheetFilters] !== undefined
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

  const handleFilterChange = (key: keyof RouteSheetFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  const getActiveFiltersDisplay = () => {
    const displays = [];

    if (filters.year) displays.push(`${filters.year}`);

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
      marginLeft: 8,
    },
    clearButtonText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
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
                  <Text style={styles.modalTitle}>
                    Filtrer les feuilles de route
                  </Text>
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
                  {/* Year Filter */}
                  <View style={styles.filterSection}>
                    <Text style={styles.sectionTitle}>Année</Text>
                    <View style={styles.optionRow}>
                      {years.map((year) => (
                        <TouchableOpacity
                          key={year}
                          style={[
                            styles.optionChip,
                            localFilters.year === year &&
                              styles.activeOptionChip,
                          ]}
                          onPress={() => handleFilterChange("year", year)}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              localFilters.year === year &&
                                styles.activeOptionText,
                            ]}
                          >
                            {year}
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
