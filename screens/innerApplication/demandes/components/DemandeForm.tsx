import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
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
  isUrgent: boolean;
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

  const handleDatePress = (type: "start" | "end") => {
    // In a real app, you would open a date picker
    Alert.alert(
      "Sélectionner une date",
      "Fonctionnalité de sélection de date à implémenter"
    );
  };

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
    urgentToggle: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    urgentToggleActive: {
      borderColor: colors.error,
      backgroundColor: colors.error + "10",
    },
    urgentIcon: {
      marginRight: 12,
    },
    urgentText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      flex: 1,
    },
    urgentTextActive: {
      color: colors.error,
    },
    urgentSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    checkIcon: {
      marginLeft: 12,
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
              onPress={() => handleDatePress("start")}
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
              onPress={() => handleDatePress("end")}
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
              {calculateDuration()} jour{calculateDuration() > 1 ? "s" : ""}{" "}
              demandé{calculateDuration() > 1 ? "s" : ""}
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

      {/* Urgent Toggle */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.urgentToggle,
            data.isUrgent && styles.urgentToggleActive,
          ]}
          onPress={() => onDataChange({ isUrgent: !data.isUrgent })}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="exclamation-triangle"
            size={20}
            color={data.isUrgent ? colors.error : colors.textTertiary}
            style={styles.urgentIcon}
          />

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.urgentText,
                data.isUrgent && styles.urgentTextActive,
              ]}
            >
              Demande urgente
            </Text>
            <Text style={styles.urgentSubtext}>Traitement prioritaire</Text>
          </View>

          <ConditionalComponent isValid={data.isUrgent}>
            <FontAwesome
              name="check-circle"
              size={20}
              color={colors.error}
              style={styles.checkIcon}
            />
          </ConditionalComponent>
        </TouchableOpacity>
      </View>
    </View>
  );
};
