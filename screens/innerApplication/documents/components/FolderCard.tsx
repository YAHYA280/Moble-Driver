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
import { DocumentFolder } from "../../../../shared/types/document";

interface FolderCardProps {
  folder: DocumentFolder;
  onPress: () => void;
  onLongPress?: () => void;
  onFavoritePress?: () => void;
  style?: ViewStyle;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onPress,
  onLongPress,
  onFavoritePress,
  style,
}) => {
  const colors = useThemeColors();

  const handleFavoritePress = () => {
    onFavoritePress?.();
  };

  const styles = StyleSheet.create({
    container: {
      width: "48%",
      aspectRatio: 1.2,
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
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
    favoriteButton: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
      zIndex: 1,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      backgroundColor: colors.primary + "15",
    },
    name: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 4,
    },
    count: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <FontAwesome
          name={folder.isFavorite ? "star" : "star-o"}
          size={12}
          color={folder.isFavorite ? colors.warning : colors.textTertiary}
        />
      </TouchableOpacity>

      {/* Folder Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome
          name={(folder.icon as any) || "folder"}
          size={24}
          color={colors.primary}
        />
      </View>

      {/* Folder Info */}
      <Text style={styles.name} numberOfLines={2}>
        {folder.name}
      </Text>
      <Text style={styles.count}>
        {folder.documentsCount} document{folder.documentsCount !== 1 ? "s" : ""}
      </Text>
    </TouchableOpacity>
  );
};
