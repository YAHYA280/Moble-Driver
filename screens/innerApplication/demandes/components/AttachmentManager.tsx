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
import { useDocumentUpload } from "../../documents/hooks/useDocumentUpload";

interface SelectedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

interface AttachmentManagerProps {
  attachments: SelectedFile[];
  onAttachmentsChange: (attachments: SelectedFile[]) => void;
  requiresJustification?: boolean;
  style?: ViewStyle;
}

export const AttachmentManager: React.FC<AttachmentManagerProps> = ({
  attachments,
  onAttachmentsChange,
  requiresJustification = false,
  style,
}) => {
  const colors = useThemeColors();
  const { selectFromCamera, selectFromGallery, selectFromFiles } =
    useDocumentUpload();

  const handleAddAttachment = () => {
    Alert.alert(
      "Ajouter un justificatif",
      "Choisissez la source de votre document",
      [
        {
          text: "Caméra",
          onPress: async () => {
            const file = await selectFromCamera();
            if (file) {
              onAttachmentsChange([...attachments, file]);
            }
          },
        },
        {
          text: "Galerie",
          onPress: async () => {
            const file = await selectFromGallery();
            if (file) {
              onAttachmentsChange([...attachments, file]);
            }
          },
        },
        {
          text: "Fichiers",
          onPress: async () => {
            const file = await selectFromFiles();
            if (file) {
              onAttachmentsChange([...attachments, file]);
            }
          },
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    onAttachmentsChange(newAttachments);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "file-image-o";
    if (mimeType === "application/pdf") return "file-pdf-o";
    if (mimeType.includes("document")) return "file-text";
    return "file-o";
  };

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
    requiredIndicator: {
      color: colors.error,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 8,
    },
    attachmentsList: {
      gap: 8,
    },
    attachmentItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    attachmentIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: colors.primary + "15",
    },
    attachmentInfo: {
      flex: 1,
    },
    attachmentName: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    attachmentSize: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    removeButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: colors.error + "15",
    },
    helpText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontStyle: "italic",
      textAlign: "center",
      marginTop: 8,
    },
    requiredText: {
      fontSize: 12,
      color: colors.warning,
      fontStyle: "italic",
      textAlign: "center",
      marginTop: 4,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>
        Justificatifs
        {requiresJustification && (
          <Text style={styles.requiredIndicator}> *</Text>
        )}
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddAttachment}
        activeOpacity={0.7}
      >
        <FontAwesome name="plus" size={16} color={colors.primary} />
        <Text style={styles.addButtonText}>Ajouter un justificatif</Text>
      </TouchableOpacity>

      <ConditionalComponent isValid={attachments.length > 0}>
        <View style={styles.attachmentsList}>
          {attachments.map((attachment, index) => (
            <View key={index} style={styles.attachmentItem}>
              <View style={styles.attachmentIcon}>
                <FontAwesome
                  name={getFileIcon(attachment.type) as any}
                  size={16}
                  color={colors.primary}
                />
              </View>

              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName} numberOfLines={1}>
                  {attachment.name}
                </Text>
                <Text style={styles.attachmentSize}>
                  {formatFileSize(attachment.size)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveAttachment(index)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <FontAwesome name="times" size={14} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ConditionalComponent>

      <Text style={styles.helpText}>
        {requiresJustification
          ? "Un justificatif est requis pour ce type de demande"
          : "Ajoutez des pièces justificatives si nécessaire"}
      </Text>

      <ConditionalComponent
        isValid={requiresJustification && attachments.length === 0}
      >
        <Text style={styles.requiredText}>
          ⚠️ Justificatif obligatoire pour ce type de demande
        </Text>
      </ConditionalComponent>
    </View>
  );
};
