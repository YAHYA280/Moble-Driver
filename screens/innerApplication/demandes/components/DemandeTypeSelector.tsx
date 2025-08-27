import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { DEMANDE_TYPES, DemandeType } from "../../../../shared/types/demande";

interface DemandeTypeSelectorProps {
  selectedType: DemandeType | null;
  onTypeSelect: (type: DemandeType) => void;
  style?: ViewStyle;
}

export const DemandeTypeSelector: React.FC<DemandeTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  style,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    typesGrid: {
      gap: 12,
    },
    typeCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 4px rgba(0, 0, 0, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.05)",
        },
      }),
    },
    selectedTypeCard: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    typeInfo: {
      flex: 1,
    },
    typeLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    selectedTypeLabel: {
      color: colors.primary,
    },
    typeDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    justificationIndicator: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },
    justificationText: {
      fontSize: 12,
      color: colors.warning,
      marginLeft: 4,
      fontStyle: "italic",
    },
    checkIcon: {
      marginLeft: 12,
    },
  });

  const getTypeDescription = (type: DemandeType): string => {
    switch (type) {
      case "conge":
        return "Demande de congés payés ou RTT";
      case "maladie":
        return "Arrêt maladie avec justificatif médical";
      case "absence":
        return "Absence exceptionnelle justifiée";
      case "autre":
        return "Autre type de demande spécifique";
      default:
        return "";
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>Type de demande *</Text>

      <View style={styles.typesGrid}>
        {Object.entries(DEMANDE_TYPES).map(([type, config]) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeCard,
              selectedType === type && styles.selectedTypeCard,
            ]}
            onPress={() => onTypeSelect(type as DemandeType)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: config.color + "15" },
              ]}
            >
              <FontAwesome
                name={config.icon as any}
                size={20}
                color={config.color}
              />
            </View>

            <View style={styles.typeInfo}>
              <Text
                style={[
                  styles.typeLabel,
                  selectedType === type && styles.selectedTypeLabel,
                ]}
              >
                {config.label}
              </Text>
              <Text style={styles.typeDescription}>
                {getTypeDescription(type as DemandeType)}
              </Text>

              <ConditionalComponent isValid={config.requiresJustification}>
                <View style={styles.justificationIndicator}>
                  <FontAwesome
                    name="exclamation-triangle"
                    size={10}
                    color={colors.warning}
                  />
                  <Text style={styles.justificationText}>
                    Justificatif requis
                  </Text>
                </View>
              </ConditionalComponent>
            </View>

            <ConditionalComponent isValid={selectedType === type}>
              <FontAwesome
                name="check-circle"
                size={20}
                color={colors.primary}
                style={styles.checkIcon}
              />
            </ConditionalComponent>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
