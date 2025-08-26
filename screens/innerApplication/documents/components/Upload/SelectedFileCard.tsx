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
import { useThemeColors } from "../../../../../hooks/useTheme";
import {
  DOCUMENT_TYPES,
  DocumentType,
} from "../../../../../shared/types/document";

interface SelectedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

interface SelectedFileCardProps {
  file: SelectedFile;
  documentType: DocumentType;
  onRemove: () => void;
  style?: ViewStyle;
}

export const SelectedFileCard: React.FC<SelectedFileCardProps> = ({
  file,
  documentType,
  onRemove,
  style,
}) => {
  const colors = useThemeColors();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
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
    fileIcon: {
      width: 48,
      height: 48,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: DOCUMENT_TYPES[documentType].color + "15",
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    fileSize: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    removeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.error + "15",
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.fileIcon}>
        <FontAwesome
          name={DOCUMENT_TYPES[documentType].icon as any}
          size={20}
          color={DOCUMENT_TYPES[documentType].color}
        />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {file.name}
        </Text>
        <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <FontAwesome name="times" size={16} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
};
