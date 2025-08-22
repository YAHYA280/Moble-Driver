// screens/innerApplication/documents/components/DocumentFilterModal.tsx

import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";
import { Checkbox } from "../../../../shared/components/ui/Checkbox";
import { Input } from "../../../../shared/components/ui/Input";
import {
  DOCUMENT_TYPES,
  DocumentFilters,
  DocumentType,
} from "../../../../shared/types/document";

interface DocumentFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: DocumentFilters) => void;
  currentFilters: DocumentFilters;
}

export const DocumentFilterModal: React.FC<DocumentFilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const colors = useThemeColors();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Filter state
  const [selectedTypes, setSelectedTypes] = useState<DocumentType[]>(
    currentFilters.type || []
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    currentFilters.status || []
  );
  const [onlyFavorites, setOnlyFavorites] = useState(
    currentFilters.isFavorite || false
  );
  const [dateFrom, setDateFrom] = useState(
    currentFilters.dateFrom?.toISOString().split("T")[0] || ""
  );
  const [dateTo, setDateTo] = useState(
    currentFilters.dateTo?.toISOString().split("T")[0] || ""
  );
  const [sizeMin, setSizeMin] = useState(
    currentFilters.sizeMin
      ? String(Math.round(currentFilters.sizeMin / (1024 * 1024)))
      : ""
  );
  const [sizeMax, setSizeMax] = useState(
    currentFilters.sizeMax
      ? String(Math.round(currentFilters.sizeMax / (1024 * 1024)))
      : ""
  );

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
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
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleTypeToggle = (type: DocumentType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleApplyFilters = () => {
    const filters: DocumentFilters = {};

    if (selectedTypes.length > 0) {
      filters.type = selectedTypes;
    }

    if (selectedStatuses.length > 0) {
      filters.status = selectedStatuses as any;
    }

    if (onlyFavorites) {
      filters.isFavorite = true;
    }

    if (dateFrom) {
      filters.dateFrom = new Date(dateFrom);
    }

    if (dateTo) {
      filters.dateTo = new Date(dateTo);
    }

    if (sizeMin) {
      filters.sizeMin = parseInt(sizeMin) * 1024 * 1024; // Convert MB to bytes
    }

    if (sizeMax) {
      filters.sizeMax = parseInt(sizeMax) * 1024 * 1024; // Convert MB to bytes
    }

    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setOnlyFavorites(false);
    setDateFrom("");
    setDateTo("");
    setSizeMin("");
    setSizeMax("");
    onApplyFilters({});
    onClose();
  };

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedStatuses.length > 0 ||
    onlyFavorites ||
    dateFrom ||
    dateTo ||
    sizeMin ||
    sizeMax;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "90%",
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
    dateRow: {
      flexDirection: "row",
      gap: 12,
    },
    dateInput: {
      flex: 1,
    },
    sizeRow: {
      flexDirection: "row",
      gap: 12,
      alignItems: "flex-end",
    },
    sizeInput: {
      flex: 1,
    },
    sizeUnit: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
      textAlign: "center",
    },
    footer: {
      flexDirection: "row",
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
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

      <SafeAreaView
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filtres</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome
                name="times"
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Document Types */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Types de documents</Text>
              <View style={styles.checkboxGroup}>
                {Object.entries(DOCUMENT_TYPES).map(([type, config]) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.typeItem}
                    onPress={() => handleTypeToggle(type as DocumentType)}
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
                      checked={selectedTypes.includes(type as DocumentType)}
                      onPress={() => handleTypeToggle(type as DocumentType)}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statut</Text>
              <View style={styles.checkboxGroup}>
                {[
                  { value: "active", label: "Actif" },
                  { value: "expired", label: "Expiré" },
                  { value: "pending", label: "En attente" },
                ].map((status) => (
                  <Checkbox
                    key={status.value}
                    checked={selectedStatuses.includes(status.value)}
                    onPress={() => handleStatusToggle(status.value)}
                    label={status.label}
                  />
                ))}
              </View>
            </View>

            {/* Favorites */}
            <View style={styles.section}>
              <Checkbox
                checked={onlyFavorites}
                onPress={() => setOnlyFavorites(!onlyFavorites)}
                label="Favoris uniquement"
                size="large"
              />
            </View>

            {/* Date Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Période</Text>
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

            {/* File Size */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Taille du fichier</Text>
              <View style={styles.sizeRow}>
                <View style={styles.sizeInput}>
                  <Input
                    label="Taille min"
                    value={sizeMin}
                    onChangeText={setSizeMin}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                  <Text style={styles.sizeUnit}>MB</Text>
                </View>
                <View style={styles.sizeInput}>
                  <Input
                    label="Taille max"
                    value={sizeMax}
                    onChangeText={setSizeMax}
                    placeholder="50"
                    keyboardType="numeric"
                  />
                  <Text style={styles.sizeUnit}>MB</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <ConditionalComponent isValid={!!hasActiveFilters}>
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
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};
