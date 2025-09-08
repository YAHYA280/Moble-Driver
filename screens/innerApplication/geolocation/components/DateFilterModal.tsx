// screens/innerApplication/geolocation/components/DateFilterModal.tsx
import { useThemeColors } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import type { Theme } from "react-native-calendars/src/types";

interface DateFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (startDate: Date | null, endDate: Date | null) => void;
  currentStartDate: Date | null;
  currentEndDate: Date | null;
}

export const DateFilterModal: React.FC<DateFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentStartDate,
  currentEndDate,
}) => {
  const colors = useThemeColors();
  const [startDate, setStartDate] = useState<Date | null>(currentStartDate);
  const [endDate, setEndDate] = useState<Date | null>(currentEndDate);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return "Non définie";
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateForCalendar = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleCalendarDayPress = (day: DateData) => {
    const selectedDate = new Date(day.year, day.month - 1, day.day);

    if (!isSelectingEndDate && !startDate) {
      // First selection - set start date
      setStartDate(selectedDate);
      setIsSelectingEndDate(true);
    } else if (isSelectingEndDate) {
      // Second selection - set end date
      if (startDate && selectedDate < startDate) {
        // If selected date is before start date, swap them
        setEndDate(startDate);
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
      setIsSelectingEndDate(false);
    } else {
      // Reset and start over
      setStartDate(selectedDate);
      setEndDate(null);
      setIsSelectingEndDate(true);
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};

    if (startDate) {
      const startDateStr = formatDateForCalendar(startDate);
      marked[startDateStr] = {
        startingDay: true,
        color: colors.primary,
        textColor: "white",
      };
    }

    if (endDate) {
      const endDateStr = formatDateForCalendar(endDate);
      marked[endDateStr] = {
        endingDay: true,
        color: colors.primary,
        textColor: "white",
      };
    }

    // Mark days between start and end date
    if (startDate && endDate) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + 1);

      while (currentDate < endDate) {
        const dateStr = formatDateForCalendar(currentDate);
        marked[dateStr] = {
          color: colors.primary + "30",
          textColor: colors.text,
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return marked;
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setIsSelectingEndDate(false);
  };

  const handleApply = () => {
    if (startDate && endDate && startDate > endDate) {
      Alert.alert(
        "Erreur",
        "La date de début doit être antérieure à la date de fin"
      );
      return;
    }
    onApply(startDate, endDate);
    onClose();
  };

  const getCalendarTheme = (): Theme => ({
    backgroundColor: colors.surface,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.text,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: "white",
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textDisabled,
    dotColor: colors.primary,
    selectedDotColor: "white",
    arrowColor: colors.primary,
    disabledArrowColor: colors.textDisabled,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 13,
  });

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      margin: 20,
      width: "90%",
      maxWidth: 400,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
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
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    instructionText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 16,
    },
    calendarContainer: {
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: colors.surface,
      marginBottom: 16,
    },
    selectionInfo: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
    },
    selectionText: {
      fontSize: 14,
      color: colors.text,
      textAlign: "center",
      fontWeight: "500",
    },
    actions: {
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    clearButton: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    applyButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    clearButtonText: {
      color: colors.text,
    },
    applyButtonText: {
      color: "white",
    },
  });

  const getInstructionText = () => {
    if (!startDate) {
      return "Sélectionnez la date de début";
    } else if (isSelectingEndDate) {
      return "Sélectionnez la date de fin";
    } else {
      return "Période sélectionnée";
    }
  };

  const getSelectionText = () => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `Du ${formatDate(startDate)} ${
        isSelectingEndDate ? "(sélectionnez la fin)" : ""
      }`;
    } else if (endDate) {
      return `Jusqu'au ${formatDate(endDate)}`;
    }
    return "Aucune période sélectionnée";
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Sélectionner une période</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Instruction */}
            <Text style={styles.instructionText}>{getInstructionText()}</Text>

            {/* Calendar */}
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleCalendarDayPress}
                markingType="period"
                markedDates={getMarkedDates()}
                theme={getCalendarTheme()}
                firstDay={1}
                enableSwipeMonths={true}
                maxDate={new Date().toISOString().split("T")[0]}
              />
            </View>

            {/* Selection Info */}
            {(startDate || endDate) && (
              <View style={styles.selectionInfo}>
                <Text style={styles.selectionText}>{getSelectionText()}</Text>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.clearButton]}
                onPress={handleClear}
              >
                <Text style={[styles.buttonText, styles.clearButtonText]}>
                  Effacer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.applyButton]}
                onPress={handleApply}
              >
                <Text style={[styles.buttonText, styles.applyButtonText]}>
                  Appliquer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
