import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Input } from "../../../../shared/components/ui/Input";
import { DEMANDE_TYPES, DemandeType } from "../../../../shared/types/demande";

interface DemandeFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  employeeComment: string;
}

interface DemandeFormProps {
  data: DemandeFormData;
  selectedType: DemandeType;
  onDataChange: (data: Partial<DemandeFormData>) => void;
  style?: ViewStyle;
}

export const DemandeForm: React.FC<DemandeFormProps> = ({
  data,
  selectedType,
  onDataChange,
  style,
}) => {
  const colors = useThemeColors();
  const typeConfig = DEMANDE_TYPES[selectedType];

  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const calculateDuration = (): number => {
    if (!data.startDate || !data.endDate) return 0;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      onDataChange({ startDate: selectedDate.toISOString() });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      onDataChange({ endDate: selectedDate.toISOString() });
    }
  };

  const styles = StyleSheet.create({
    container: {
      gap: 20,
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    datesRow: {
      flexDirection: "row",
      gap: 12,
    },
    dateInput: {
      flex: 1,
    },
    dateButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      minHeight: 48,
    },
    dateButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    dateButtonPlaceholder: {
      color: colors.textTertiary,
    },
    durationIndicator: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: colors.primary + "15",
      alignSelf: "center",
      marginTop: 8,
    },
    durationText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 6,
    },
    requiredIndicator: {
      color: colors.error,
    },
    labelText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 6,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <View style={styles.section}>
        <Input
          label="Titre de la demande *"
          value={data.title}
          onChangeText={(title) => onDataChange({ title })}
          placeholder="Ex: Congé du 15 au 20 mars"
        />
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Input
          label="Description"
          value={data.description}
          onChangeText={(description) => onDataChange({ description })}
          placeholder="Description optionnelle de votre demande"
          multiline={true}
          numberOfLines={3}
        />
      </View>

      {/* Dates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Période <Text style={styles.requiredIndicator}>*</Text>
        </Text>

        <View style={styles.datesRow}>
          <View style={styles.dateInput}>
            <Text style={styles.labelText}>Date de début</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  !data.startDate && styles.dateButtonPlaceholder,
                ]}
              >
                {data.startDate ? formatDate(data.startDate) : "Sélectionner"}
              </Text>
              <FontAwesome
                name="calendar"
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.dateInput}>
            <Text style={styles.labelText}>Date de fin</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  !data.endDate && styles.dateButtonPlaceholder,
                ]}
              >
                {data.endDate ? formatDate(data.endDate) : "Sélectionner"}
              </Text>
              <FontAwesome
                name="calendar"
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ConditionalComponent
          isValid={
            !!(data.startDate && data.endDate && calculateDuration() > 0)
          }
        >
          <View style={styles.durationIndicator}>
            <FontAwesome name="clock-o" size={14} color={colors.primary} />
            <Text style={styles.durationText}>
              {calculateDuration()} jour{calculateDuration() > 1 ? "s" : ""}
            </Text>
          </View>
        </ConditionalComponent>
      </View>

      {/* Employee Comment */}
      <View style={styles.section}>
        <Input
          label={`Motif / Commentaire${
            typeConfig.requiresJustification ? " *" : ""
          }`}
          value={data.employeeComment}
          onChangeText={(employeeComment) => onDataChange({ employeeComment })}
          placeholder={
            selectedType === "maladie"
              ? "Précisez la nature de votre arrêt maladie"
              : selectedType === "absence"
              ? "Justifiez votre demande d'absence"
              : "Motif de votre demande (optionnel)"
          }
          multiline={true}
          numberOfLines={4}
        />
      </View>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={data.startDate ? new Date(data.startDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleStartDateChange}
          minimumDate={new Date()}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={data.endDate ? new Date(data.endDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleEndDateChange}
          minimumDate={data.startDate ? new Date(data.startDate) : new Date()}
        />
      )}
    </View>
  );
};
