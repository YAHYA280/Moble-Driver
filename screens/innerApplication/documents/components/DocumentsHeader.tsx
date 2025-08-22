// screens/innerApplication/documents/components/DocumentsHeader.tsx

import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

interface DocumentsHeaderProps {
  foldersCount: number;
  documentsCount: number;
  onAddFolder: () => void;
  onUploadDocument: () => void;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  foldersCount,
  documentsCount,
  onAddFolder,
  onUploadDocument,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    countsContainer: {
      flex: 1,
    },
    count: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    actionsContainer: {
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.primary + "15",
    },
    actionText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 6,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.countsContainer}>
          <Text style={styles.count}>
            {foldersCount} dossier{foldersCount !== 1 ? "s" : ""}
          </Text>
          <Text style={styles.count}>
            {documentsCount} document{documentsCount !== 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onAddFolder}>
            <FontAwesome name="folder-o" size={14} color={colors.primary} />
            <Text style={styles.actionText}>Dossier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onUploadDocument}
          >
            <FontAwesome name="plus" size={14} color={colors.primary} />
            <Text style={styles.actionText}>Document</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
