import { FontAwesome } from "@expo/vector-icons";
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
import {
  Notification,
  NotificationPriority,
} from "../../../../shared/types/notification";
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

  const getPriorityConfig = (priority: NotificationPriority) => {
    switch (priority) {
      case "urgent":
        return {
          color: colors.error,
          backgroundColor: colors.error + "15",
          icon: "exclamation-triangle" as keyof typeof FontAwesome.glyphMap,
          borderColor: colors.error,
        };
      case "important":
        return {
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "exclamation-circle" as keyof typeof FontAwesome.glyphMap,
          borderColor: colors.warning,
        };
      case "informative":
        return {
          color: colors.info,
          backgroundColor: colors.info + "15",
          icon: "info-circle" as keyof typeof FontAwesome.glyphMap,
          borderColor: colors.info,
        };
    }
  };

  const priorityConfig = getPriorityConfig(notification.priority);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return diffInMinutes < 1 ? "À l'instant" : `Il y a ${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleMenuPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setShowMenu(true);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: priorityConfig.borderColor,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    unreadCard: {
      backgroundColor: colors.isDark ? colors.card : colors.surface,
      borderWidth: 1.5,
      borderColor: priorityConfig.borderColor + "40",
    },
    contentContainer: {
      padding: 16,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    priorityIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: priorityConfig.backgroundColor,
      marginRight: 12,
    },
    contentSection: {
      flex: 1,
      marginRight: 8,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    timestamp: {
      fontSize: 12,
      fontWeight: "400",
      color: colors.textTertiary,
    },
    rightSection: {
      alignItems: "flex-end",
      minWidth: 24,
    },
    menuButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
      marginBottom: 8,
    },
    statusIndicators: {
      alignItems: "center",
      gap: 4,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: priorityConfig.borderColor,
    },
    pinnedIcon: {
      color: colors.primary,
    },
    message: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    contextContainer: {
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
    },
    contextTag: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.backgroundSecondary,
      gap: 4,
    },
    contextText: {
      fontSize: 11,
      fontWeight: "500",
      color: colors.textTertiary,
    },
  });

  return (
    <>
      <TouchableOpacity
        style={[styles.card, !notification.isRead && styles.unreadCard, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            {/* Priority Icon */}
            <View style={styles.priorityIcon}>
              <FontAwesome
                name={priorityConfig.icon}
                size={20}
                color={priorityConfig.color}
              />
            </View>

            {/* Main Content */}
            <View style={styles.contentSection}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>
                  {notification.title}
                </Text>
                <Text style={styles.timestamp}>
                  {formatTimestamp(notification.timestamp)}
                </Text>
              </View>

              <Text style={styles.message} numberOfLines={2}>
                {notification.message}
              </Text>

              {notification.context && (
                <View style={styles.contextContainer}>
                  {notification.context.vehicleId && (
                    <View style={styles.contextTag}>
                      <FontAwesome
                        name="car"
                        size={12}
                        color={colors.textTertiary}
                      />
                      <Text style={styles.contextText}>Véhicule</Text>
                    </View>
                  )}
                  {notification.context.routeId && (
                    <View style={styles.contextTag}>
                      <FontAwesome
                        name="road"
                        size={12}
                        color={colors.textTertiary}
                      />
                      <Text style={styles.contextText}>Trajet</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Right Section - Menu & Status */}
            <View style={styles.rightSection}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={handleMenuPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome
                  name="ellipsis-v"
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.statusIndicators}>
                {!notification.isRead && <View style={styles.unreadDot} />}
                {notification.isPinned && (
                  <FontAwesome
                    name="bookmark"
                    size={12}
                    style={styles.pinnedIcon}
                  />
                )}
              </View>
            </View>
          </View>
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
