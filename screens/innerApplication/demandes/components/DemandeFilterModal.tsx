import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";
import { Checkbox } from "../../../../shared/components/ui/Checkbox";
import { Input } from "../../../../shared/components/ui/Input";
import {
  DEMANDE_STATUS,
  DEMANDE_TYPES,
  DemandeFilters,
  DemandeStatus,
  DemandeType,
} from "../../../../shared/types/demande";

const { height: screenHeight } = Dimensions.get("window");

interface DemandeFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: DemandeFilters) => void;
  onClearFilters?: () => void;
  currentFilters: DemandeFilters;
}

export const DemandeFilterModal: React.FC<DemandeFilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
}) => {
  const colors = useThemeColors();
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Filter state
  const [selectedTypes, setSelectedTypes] = useState<DemandeType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<DemandeStatus[]>([]);
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Initialize state from current filters
  useEffect(() => {
    setSelectedTypes(currentFilters.type || []);
    setSelectedStatuses(currentFilters.status || []);
    setOnlyUrgent(currentFilters.isUrgent || false);
    setDateFrom(currentFilters.dateFrom?.toISOString().split("T")[0] || "");
    setDateTo(currentFilters.dateTo?.toISOString().split("T")[0] || "");
  }, [currentFilters, visible]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleTypeToggle = (type: DemandeType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleStatusToggle = (status: DemandeStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleApplyFilters = () => {
    const filters: DemandeFilters = {};

    if (selectedTypes.length > 0) {
      filters.type = selectedTypes;
    }

    if (selectedStatuses.length > 0) {
      filters.status = selectedStatuses;
    }

    if (onlyUrgent) {
      filters.isUrgent = true;
    }

    if (dateFrom) {
      filters.dateFrom = new Date(dateFrom);
    }

    if (dateTo) {
      filters.dateTo = new Date(dateTo);
    }

    onApplyFilters(filters);
    onClose();
  };

  const resetLocalState = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setOnlyUrgent(false);
    setDateFrom("");
    setDateTo("");
  };

  const handleClearFilters = () => {
    resetLocalState();

    if (onClearFilters) {
      onClearFilters();
    } else {
      onApplyFilters({});
    }

    onClose();
  };

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedStatuses.length > 0 ||
    onlyUrgent ||
    dateFrom.trim() !== "" ||
    dateTo.trim() !== "";

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    container: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: screenHeight * 0.9,
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 -4px 8px rgba(0, 0, 0, 0.3)"
            : "0 -4px 8px rgba(0, 0, 0, 0.15)",
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
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
    contentContainer: {
      flex: 1,
      flexDirection: "column",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    checkboxGroup: {
      gap: 12,
    },
    typeItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
    },
    typeIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    typeLabel: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    statusItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
    },
    statusIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    statusLabel: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    dateRow: {
      flexDirection: "row",
      gap: 12,
    },
    dateInput: {
      flex: 1,
    },
    footer: {
      flexDirection: "row",
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      paddingBottom: Platform.select({
        ios: 34,
        android: 20,
      }),
    },
    footerButton: {
      flex: 1,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[styles.modalOverlay, { opacity: overlayAnim }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Filtres</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Scrollable Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Demande Types */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Types de demandes</Text>
              <View style={styles.checkboxGroup}>
                {Object.entries(DEMANDE_TYPES).map(([type, config]) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.typeItem}
                    onPress={() => handleTypeToggle(type as DemandeType)}
                  >
                    <View
                      style={[
                        styles.typeIcon,
                        { backgroundColor: config.color + "15" },
                      ]}
                    >
                      <FontAwesome
                        name={config.icon as any}
                        size={16}
                        color={config.color}
                      />
                    </View>
                    <Text style={styles.typeLabel}>{config.label}</Text>
                    <Checkbox
                      checked={selectedTypes.includes(type as DemandeType)}
                      onPress={() => handleTypeToggle(type as DemandeType)}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statut</Text>
              <View style={styles.checkboxGroup}>
                {Object.entries(DEMANDE_STATUS).map(([status, config]) => (
                  <TouchableOpacity
                    key={status}
                    style={styles.statusItem}
                    onPress={() => handleStatusToggle(status as DemandeStatus)}
                  >
                    <View
                      style={[
                        styles.statusIcon,
                        { backgroundColor: config.color + "15" },
                      ]}
                    >
                      <FontAwesome
                        name={config.icon as any}
                        size={16}
                        color={config.color}
                      />
                    </View>
                    <Text style={styles.statusLabel}>{config.label}</Text>
                    <Checkbox
                      checked={selectedStatuses.includes(
                        status as DemandeStatus
                      )}
                      onPress={() =>
                        handleStatusToggle(status as DemandeStatus)
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Urgent */}
            <View style={styles.section}>
              <Checkbox
                checked={onlyUrgent}
                onPress={() => setOnlyUrgent(!onlyUrgent)}
                label="Demandes urgentes uniquement"
                size="large"
              />
            </View>

            {/* Date Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Période de demande</Text>
              <View style={styles.dateRow}>
                <View style={styles.dateInput}>
                  <Input
                    label="Du"
                    value={dateFrom}
                    onChangeText={setDateFrom}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                <View style={styles.dateInput}>
                  <Input
                    label="Au"
                    value={dateTo}
                    onChangeText={setDateTo}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer - Fixed at bottom */}
          <View style={styles.footer}>
            <ConditionalComponent isValid={hasActiveFilters}>
              <View style={styles.footerButton}>
                <Button
                  title="Effacer"
                  variant="outline"
                  onPress={handleClearFilters}
                />
              </View>
            </ConditionalComponent>
            <View style={styles.footerButton}>
              <Button title="Appliquer" onPress={handleApplyFilters} />
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};
