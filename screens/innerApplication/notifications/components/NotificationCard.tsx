import { Ionicons } from "@expo/vector-icons";
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
import { Notification } from "../../../../shared/types/notification";
import { NotificationItemMenu } from "../../../innerApplication/notifications/components/NotificationItemMenu";

interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
  onMarkAsRead?: () => void;
  onMarkAsUnread?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  style?: ViewStyle;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  onMarkAsRead,
  onMarkAsUnread,
  onPin,
  onUnpin,
  onDelete,
  onArchive,
  style,
}) => {
  const colors = useThemeColors();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const getNotificationTypeIcon = () => {
    const title = notification.title.toLowerCase();

    if (title.includes("trajet")) {
      return "car" as keyof typeof Ionicons.glyphMap;
    } else if (title.includes("email") || title.includes("modif")) {
      return "mail" as keyof typeof Ionicons.glyphMap;
    } else if (title.includes("congé") || title.includes("refus")) {
      return "close-circle" as keyof typeof Ionicons.glyphMap;
    } else if (title.includes("départ")) {
      return "time" as keyof typeof Ionicons.glyphMap;
    } else if (title.includes("rappel")) {
      return "notifications" as keyof typeof Ionicons.glyphMap;
    } else if (title.includes("trophée")) {
      return "trophy" as keyof typeof Ionicons.glyphMap;
    } else if (title.includes("conseil")) {
      return "bulb" as keyof typeof Ionicons.glyphMap;
    }

    return "notifications" as keyof typeof Ionicons.glyphMap;
  };

  const getIconColor = () => {
    switch (notification.priority) {
      case "urgent":
        return colors.error;
      case "important":
        return colors.warning;
      case "informative":
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const typeIcon = getNotificationTypeIcon();
  const iconColor = getIconColor();

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return "À l'instant";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays === 1) {
      return "Hier";
    } else if (diffInDays < 7) {
      return `${diffInDays}j`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const handleMenuPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setShowMenu(true);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 12,
      padding: 16,
      minHeight: 80,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: colors.isDark ? 0.3 : 0.05,
          shadowRadius: 3,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 1px 3px rgba(0, 0, 0, 0.3)"
            : "0 1px 3px rgba(0, 0, 0, 0.05)",
        },
      }),
    },
    unreadContainer: {
      backgroundColor: colors.backgroundSecondary,
      borderLeftWidth: 3,
      borderLeftColor: iconColor,
    },
    leftSection: {
      marginRight: 12,
      alignItems: "center",
      position: "relative",
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    unreadDot: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: iconColor,
    },
    contentSection: {
      flex: 1,
      justifyContent: "center",
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: notification.isRead ? "500" : "600",
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    timestamp: {
      fontSize: 12,
      fontWeight: "400",
      color: colors.textTertiary,
    },
    message: {
      fontSize: 14,
      lineHeight: 18,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    statusIcon: {
      fontSize: 12,
    },
    pinnedIcon: {
      color: colors.warning,
    },
    archivedIcon: {
      color: colors.textTertiary,
    },
    rightSection: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
    },
    menuButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
  });

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          !notification.isRead && styles.unreadContainer,
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Left Section - Icon */}
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Ionicons name={typeIcon} size={20} color={iconColor} />
          </View>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {notification.title}
            </Text>
            <Text style={styles.timestamp}>
              {formatTimestamp(notification.timestamp)}
            </Text>
          </View>

          <Text style={styles.message} numberOfLines={1}>
            {notification.message}
          </Text>

          <View style={styles.statusRow}>
            {notification.isPinned && (
              <Ionicons
                name="bookmark"
                size={12}
                style={[styles.statusIcon, styles.pinnedIcon]}
              />
            )}
            {notification.status === "archived" && (
              <Ionicons
                name="archive"
                size={12}
                style={[styles.statusIcon, styles.archivedIcon]}
              />
            )}
          </View>
        </View>

        {/* Right Section - Menu */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleMenuPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Menu Modal */}
      <NotificationItemMenu
        notification={notification}
        position={menuPosition}
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onMarkAsRead={onMarkAsRead}
        onMarkAsUnread={onMarkAsUnread}
        onPin={onPin}
        onUnpin={onUnpin}
        onArchive={onArchive}
        onDelete={onDelete}
      />
    </>
  );
};
