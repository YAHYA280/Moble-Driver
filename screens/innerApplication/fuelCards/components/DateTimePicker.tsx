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
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
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
  const [temporaryValue, setTemporaryValue] = useState(value);

  const handlePickerChange = (event: any, selectedValue?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (selectedValue) {
        onChange(selectedValue);
      }
    } else {
      if (selectedValue) {
        setTemporaryValue(selectedValue);
      }
    }
  };

  const handleIOSConfirm = () => {
    onChange(temporaryValue);
    setShowPicker(false);
  };

  const handleIOSCancel = () => {
    setTemporaryValue(value);
    setShowPicker(false);
  };

  const formatDisplayValue = () => {
    if (mode === "date") {
      return value.toLocaleDateString("fr-FR");
    }
    return value.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getModalTitle = () => {
    return mode === "date" ? "Sélectionner la date" : "Sélectionner l'heure";
  };

  const getIconName = () => {
    return mode === "date" ? "calendar" : "clock-o";
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    touchableButton: {
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
    contentWrapper: {
      flex: 1,
    },
    labelText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    valueText: {
      fontSize: 16,
      color: disabled ? colors.textTertiary : colors.text,
      fontWeight: "500",
    },
    iconStyle: {
      marginLeft: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 34,
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
        style={styles.touchableButton}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={styles.contentWrapper}>
          <Text style={styles.labelText}>{label}</Text>
          <Text style={styles.valueText}>{formatDisplayValue()}</Text>
        </View>
        <FontAwesome
          name={getIconName()}
          size={16}
          color={disabled ? colors.textTertiary : colors.textSecondary}
          style={styles.iconStyle}
        />
      </TouchableOpacity>

      <ConditionalComponent isValid={showPicker && Platform.OS === "android"}>
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={handlePickerChange}
        />
      </ConditionalComponent>

      <ConditionalComponent isValid={showPicker && Platform.OS === "ios"}>
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={handleIOSCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              </View>

              <DateTimePicker
                value={temporaryValue}
                mode={mode}
                display="spinner"
                onChange={handlePickerChange}
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
      </ConditionalComponent>
    </View>
  );
};
