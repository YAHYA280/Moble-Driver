// screens/innerApplication/vehicles/components/DocumentsSection.tsx
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

interface DocumentItem {
  id: string;
  icon: string;
  label: string;
  color: string;
  onPress?: () => void;
}

interface DocumentsSectionProps {
  documents?: DocumentItem[];
  onDocumentPress?: (documentType: string) => void;
  style?: ViewStyle;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  onDocumentPress,
  style,
}) => {
  const colors = useThemeColors();

  const defaultDocuments: DocumentItem[] = [
    {
      id: "insurance",
      icon: "shield",
      label: "Assurance",
      color: colors.primary,
      onPress: () => onDocumentPress?.("insurance"),
    },
    {
      id: "registration",
      icon: "credit-card",
      label: "Carte grise",
      color: colors.info,
      onPress: () => onDocumentPress?.("registration"),
    },
    {
      id: "permit",
      icon: "file-text",
      label: "Permis",
      color: colors.primary,
      onPress: () => onDocumentPress?.("permit"),
    },
  ];

  const documentsToRender = documents || defaultDocuments;

  const renderDocumentButton = (document: DocumentItem) => (
    <TouchableOpacity
      key={document.id}
      style={[
        styles.documentButton,
        { backgroundColor: document.color + "15" },
      ]}
      onPress={document.onPress}
      activeOpacity={0.7}
    >
      <FontAwesome
        name={document.icon as any}
        size={14}
        color={document.color}
        style={styles.documentIcon}
      />
      <Text style={[styles.documentText, { color: document.color }]}>
        {document.label}
      </Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    documentsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    documentButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      marginHorizontal: 4,
    },
    documentIcon: {
      marginRight: 6,
    },
    documentText: {
      fontSize: 13,
      fontWeight: "500",
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>Documents associés</Text>
      <View style={styles.documentsContainer}>
        {documentsToRender.map(renderDocumentButton)}
      </View>
    </View>
  );
};

export { DocumentsSection };
