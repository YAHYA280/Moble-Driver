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
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
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

  const getIconBackgroundColor = () => {
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
  const iconColor = getIconBackgroundColor();

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMinutes < 1) {
      return "À l'instant";
    } else if (diffInMinutes === 1) {
      return "Il y a 1 min";
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInHours === 1) {
      return "Il y a 1 heure";
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heures`;
    } else if (diffInDays === 1) {
      return "Il y a 1 jour";
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jours`;
    } else if (diffInWeeks === 1) {
      return "Il y a 1 semaine";
    } else if (diffInWeeks < 4) {
      return `Il y a ${diffInWeeks} semaines`;
    } else if (diffInMonths === 1) {
      return "Il y a 1 mois";
    } else if (diffInMonths < 12) {
      return `Il y a ${diffInMonths} mois`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const handleMenuPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setShowMenu(true);
  };

  const handleMenuAction = (action: () => void) => {
    setShowMenu(false);
    // Add a small delay to ensure menu closes before action
    setTimeout(() => {
      action();
    }, 100);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    unreadContainer: {
      borderLeftWidth: 4,
      borderLeftColor: iconColor,
    },
    leftSection: {
      marginRight: 16,
      alignItems: "center",
      position: "relative",
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: iconColor,
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
      backgroundColor: colors.error,
    },
    contentSection: {
      flex: 1,
      justifyContent: "center",
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    title: {
      fontSize: 18,
      fontWeight: notification.isRead ? "500" : "700",
      color: colors.text,
      flex: 1,
      marginRight: 8,
      letterSpacing: 0.3,
    },
    message: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
      marginBottom: 8,
      fontWeight: "400",
    },
    bottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
    timestamp: {
      fontSize: 12,
      fontWeight: "400",
      color: colors.textTertiary,
    },
    rightSection: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
    },
    menuButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.isDark
        ? colors.surfaceSecondary
        : "rgba(255, 255, 255, 0.7)",
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
            <Ionicons name={typeIcon} size={26} color="white" />
          </View>
          <ConditionalComponent isValid={!notification.isRead}>
            <View style={styles.unreadDot} />
          </ConditionalComponent>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {notification.title}
            </Text>
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>

          <View style={styles.bottomRow}>
            <View style={styles.statusRow}>
              <ConditionalComponent isValid={notification.isPinned}>
                <Ionicons
                  name="bookmark"
                  size={12}
                  style={[styles.statusIcon, styles.pinnedIcon]}
                />
              </ConditionalComponent>
            </View>

            <Text style={styles.timestamp}>
              {formatTimestamp(notification.timestamp)}
            </Text>
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
        onMarkAsRead={() => handleMenuAction(() => onMarkAsRead?.())}
        onMarkAsUnread={() => handleMenuAction(() => onMarkAsUnread?.())}
        onPin={() => handleMenuAction(() => onPin?.())}
        onUnpin={() => handleMenuAction(() => onUnpin?.())}
        onDelete={() => handleMenuAction(() => onDelete?.())}
      />
    </>
  );
};
