import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";
import { Input } from "../../../../../shared/components/ui/Input";
import {
  DOCUMENT_TYPES,
  DocumentType,
} from "../../../../../shared/types/document";

interface DocumentFormProps {
  documentName: string;
  onDocumentNameChange: (name: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  documentType: DocumentType;
  onDocumentTypeChange: (type: DocumentType) => void;
  style?: ViewStyle;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  documentName,
  onDocumentNameChange,
  description,
  onDescriptionChange,
  documentType,
  onDocumentTypeChange,
  style,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      gap: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    typeSelector: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    },
    typeButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    selectedTypeButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    selectedTypeButtonText: {
      color: "white",
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Document Name Input */}
      <Input
        label="Nom du document *"
        value={documentName}
        onChangeText={onDocumentNameChange}
        placeholder="Saisissez le nom du document"
      />

      {/* Description Input */}
      <Input
        label="Description"
        value={description}
        onChangeText={onDescriptionChange}
        placeholder="Description optionnelle"
        multiline
        numberOfLines={3}
      />

      {/* Document Type Selection */}
      <View>
        <Text style={styles.sectionTitle}>Type de document</Text>
        <View style={styles.typeSelector}>
          {Object.entries(DOCUMENT_TYPES).map(([type, config]) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                documentType === type && styles.selectedTypeButton,
              ]}
              onPress={() => onDocumentTypeChange(type as DocumentType)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  documentType === type && styles.selectedTypeButtonText,
                ]}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};
