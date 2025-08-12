import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
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
import { TimeSlot } from "../../../../shared/types/routeSheet";

interface CustomTimePickerProps {
  visible: boolean;
  timeSlot: TimeSlot;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  onClose: () => void;
  title: string;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  visible,
  timeSlot,
  selectedTime,
  onTimeSelect,
  onClose,
  title,
}) => {
  const colors = useThemeColors();
  const [tempSelectedTime, setTempSelectedTime] = useState(selectedTime);

  const getTimeRange = (slot: TimeSlot): string[] => {
    switch (slot) {
      case "Matin":
        return [
          "06:00",
          "06:30",
          "07:00",
          "07:30",
          "08:00",
          "08:30",
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
        ];
      case "Midi":
        return [
          "11:00",
          "11:30",
          "12:00",
          "12:30",
          "13:00",
          "13:30",
          "14:00",
          "14:30",
          "15:00",
        ];
      case "Après-midi":
        return [
          "13:00",
          "13:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
          "17:00",
          "17:30",
          "18:00",
          "18:30",
        ];
      case "Soir":
        return [
          "17:00",
          "17:30",
          "18:00",
          "18:30",
          "19:00",
          "19:30",
          "20:00",
          "20:30",
          "21:00",
          "21:30",
          "22:00",
          "22:30",
        ];
      default:
        return ["09:00"];
    }
  };

  const timeOptions = getTimeRange(timeSlot);

  const handleConfirm = () => {
    onTimeSelect(tempSelectedTime);
    onClose();
  };

  const renderTimeItem = ({ item }: { item: string }) => {
    const isSelected = item === tempSelectedTime;

    return (
      <TouchableOpacity
        style={[
          styles.timeItem,
          {
            backgroundColor: isSelected
              ? colors.primary
              : colors.backgroundSecondary,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => setTempSelectedTime(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.timeText,
            { color: isSelected ? "white" : colors.text },
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    timeGrid: {
      marginBottom: 20,
    },
    timeItem: {
      flex: 1,
      margin: 4,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: "center",
      minWidth: 80,
    },
    timeText: {
      fontSize: 16,
      fontWeight: "500",
    },
    actions: {
      flexDirection: "row",
      gap: 12,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <FontAwesome
                    name="times"
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <FlatList
                data={timeOptions}
                renderItem={renderTimeItem}
                keyExtractor={(item) => item}
                numColumns={3}
                style={styles.timeGrid}
                showsVerticalScrollIndicator={false}
              />

              <View style={styles.actions}>
                <Button
                  title="Annuler"
                  variant="outline"
                  onPress={onClose}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Confirmer"
                  onPress={handleConfirm}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
