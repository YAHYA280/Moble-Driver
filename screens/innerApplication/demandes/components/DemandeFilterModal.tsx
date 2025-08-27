import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";
import { Checkbox } from "../../../../shared/components/ui/Checkbox";
import {
  DEMANDE_STATUS,
  DemandeFilters,
  DemandeStatus,
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

  // Simplified filter state - only status
  const [selectedStatuses, setSelectedStatuses] = useState<DemandeStatus[]>([]);

  // Initialize state from current filters
  useEffect(() => {
    setSelectedStatuses(currentFilters.status || []);
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

  const handleStatusToggle = (status: DemandeStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleApplyFilters = () => {
    const filters: DemandeFilters = {};

    if (selectedStatuses.length > 0) {
      filters.status = selectedStatuses;
    }

    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);

    if (onClearFilters) {
      onClearFilters();
    } else {
      onApplyFilters({});
    }

    onClose();
  };

  const hasActiveFilters = selectedStatuses.length > 0;

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
      height: screenHeight * 0.6, // Smaller modal
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
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    checkboxGroup: {
      gap: 16,
    },
    statusItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
    },
    statusIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    statusLabel: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    footer: {
      flexDirection: "row",
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
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
          <Text style={styles.title}>Filtrer par statut</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Choisir le statut</Text>

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
                      size={20}
                      color={config.color}
                    />
                  </View>
                  <Text style={styles.statusLabel}>{config.label}</Text>
                  <Checkbox
                    checked={selectedStatuses.includes(status as DemandeStatus)}
                    onPress={() => handleStatusToggle(status as DemandeStatus)}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer */}
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
