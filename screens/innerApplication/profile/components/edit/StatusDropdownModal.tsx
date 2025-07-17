// screens/innerApplication/profile/components/StatusDropdownModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
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

export const StatusDropdownModal: React.FC<StatusDropdownModalProps> = ({
  visible,
  currentStatus,
  options,
  onSelect,
  onClose,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    dropdownContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginHorizontal: 40,
      maxHeight: 300,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    dropdownHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
    },
    dropdownOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    dropdownOptionLast: {
      borderBottomWidth: 0,
    },
    dropdownOptionText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    selectedOption: {
      backgroundColor: colors.primary + "15",
    },
    selectedOptionText: {
      color: colors.primary,
      fontWeight: "600",
    },
    checkIcon: {
      marginLeft: 8,
    },
    dropdownFooter: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    cancelButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
    },
    cancelButtonText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "500",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Sélectionner le statut</Text>
          </View>

          {options.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownOption,
                index === options.length - 1 && styles.dropdownOptionLast,
                currentStatus === option.value && styles.selectedOption,
              ]}
              onPress={() => onSelect(option)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dropdownOptionText,
                  currentStatus === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
              <ConditionalComponent isValid={currentStatus === option.value}>
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={colors.primary}
                  style={styles.checkIcon}
                />
              </ConditionalComponent>
            </TouchableOpacity>
          ))}

          <View style={styles.dropdownFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
