// screens/innerApplication/fuelCards/components/DateTimePicker.tsx
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";

interface DateTimePickerComponentProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode: "date" | "time";
  disabled?: boolean;
}

export const DateTimePickerComponent: React.FC<
  DateTimePickerComponentProps
> = ({ label, value, onChange, mode, disabled = false }) => {
  const colors = useThemeColors();
  const [showPicker, setShowPicker] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleChange = (event: any, selectedValue?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (selectedValue) {
        onChange(selectedValue);
      }
    } else {
      // iOS - handle temp value
      if (selectedValue) {
        setTempValue(selectedValue);
      }
    }
  };

  const handleIOSConfirm = () => {
    onChange(tempValue);
    setShowPicker(false);
  };

  const handleIOSCancel = () => {
    setTempValue(value);
    setShowPicker(false);
  };

  const formatValue = () => {
    if (mode === "date") {
      return value.toLocaleDateString("fr-FR");
    }
    return value.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: disabled ? colors.backgroundSecondary : colors.surface,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    content: {
      flex: 1,
    },
    label: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      color: disabled ? colors.textTertiary : colors.text,
      fontWeight: "500",
    },
    icon: {
      marginLeft: 8,
    },
    // iOS Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 34, // Safe area
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    modalActions: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingTop: 16,
      gap: 12,
    },
    cancelButton: {
      flex: 1,
    },
    confirmButton: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{formatValue()}</Text>
        </View>
        <FontAwesome
          name={mode === "date" ? "calendar" : "clock-o"}
          size={16}
          color={disabled ? colors.textTertiary : colors.textSecondary}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Android Picker */}
      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={handleChange}
        />
      )}

      {/* iOS Modal Picker */}
      {showPicker && Platform.OS === "ios" && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={handleIOSCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {mode === "date"
                    ? "Sélectionner la date"
                    : "Sélectionner l'heure"}
                </Text>
              </View>

              <DateTimePicker
                value={tempValue}
                mode={mode}
                display="spinner"
                onChange={handleChange}
                textColor={colors.text}
              />

              <View style={styles.modalActions}>
                <View style={styles.cancelButton}>
                  <Button
                    title="Annuler"
                    onPress={handleIOSCancel}
                    variant="outline"
                  />
                </View>
                <View style={styles.confirmButton}>
                  <Button title="Confirmer" onPress={handleIOSConfirm} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
