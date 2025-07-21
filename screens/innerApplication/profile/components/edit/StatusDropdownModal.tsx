import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";
import ConditionalComponent from "../../../../../shared/components/conditionalComponent/conditionalComponent";

interface StatusOption {
  label: string;
  value: "Actif" | "En congé" | "Inactif";
}

interface StatusDropdownModalProps {
  visible: boolean;
  currentStatus: string;
  options: StatusOption[];
  onSelect: (option: StatusOption) => void;
  onClose: () => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    dropdownContainer: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      width: "100%",
      maxWidth: 350,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: colors.isDark ? 0.4 : 0.25,
          shadowRadius: 20,
        },
        android: {
          elevation: 16,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 8px 32px rgba(0, 0, 0, 0.4)"
            : "0 8px 32px rgba(0, 0, 0, 0.15)",
        },
      }),
    },
    dropdownHeader: {
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "40",
    },
    dropdownTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
    dropdownSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 4,
    },
    optionsContainer: {
      paddingVertical: 8,
    },
    dropdownOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      marginHorizontal: 8,
      marginVertical: 2,
      borderRadius: 12,
      backgroundColor: "transparent",
    },
    selectedOption: {
      backgroundColor: colors.primary + "15",
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    statusIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    optionTextContainer: {
      flex: 1,
    },
    dropdownOptionText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    selectedOptionText: {
      color: colors.primary,
      fontWeight: "600",
    },
    statusDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    checkIconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    dropdownFooter: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border + "40",
    },
    cancelButton: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: `0 4px 12px ${colors.primary}40`,
        },
      }),
    },
    cancelButtonText: {
      fontSize: 16,
      color: "white",
      fontWeight: "600",
    },
  });

const getStatusColor = (status: string) => {
  switch (status) {
    case "Actif":
      return "#4CAF50";
    case "En congé":
      return "#FF9800";
    case "Inactif":
      return "#F44336";
    default:
      return "#666666";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Actif":
      return "checkmark-circle";
    case "En congé":
      return "time";
    case "Inactif":
      return "close-circle";
    default:
      return "radio-button-off";
  }
};

const getStatusDescription = (status: string) => {
  switch (status) {
    case "Actif":
      return "Disponible pour les trajets";
    case "En congé":
      return "Temporairement indisponible";
    case "Inactif":
      return "Non disponible";
    default:
      return "";
  }
};

export const StatusDropdownModal: React.FC<StatusDropdownModalProps> = ({
  visible,
  currentStatus,
  options,
  onSelect,
  onClose,
}) => {
  const colors = useThemeColors();

  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dropdownContainer}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>Sélectionner le statut</Text>
                <Text style={styles.dropdownSubtitle}>
                  Choisissez votre statut de disponibilité
                </Text>
              </View>

              <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownOption,
                      currentStatus === option.value && styles.selectedOption,
                    ]}
                    onPress={() => onSelect(option)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.statusIconContainer,
                        {
                          backgroundColor: getStatusColor(option.value) + "20",
                        },
                      ]}
                    >
                      <Ionicons
                        name={getStatusIcon(option.value) as any}
                        size={18}
                        color={getStatusColor(option.value)}
                      />
                    </View>

                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          currentStatus === option.value &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text style={styles.statusDescription}>
                        {getStatusDescription(option.value)}
                      </Text>
                    </View>

                    <ConditionalComponent
                      isValid={currentStatus === option.value}
                    >
                      <View style={styles.checkIconContainer}>
                        <Ionicons name="checkmark" size={14} color="white" />
                      </View>
                    </ConditionalComponent>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.dropdownFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
