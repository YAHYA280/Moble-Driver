// shared/components/ui/NotificationCard.tsx
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
import { Swipeable } from "react-native-gesture-handler";
import { useThemeColors } from "../../../../hooks/useTheme";
import {
  Notification,
  NotificationPriority,
} from "../../../../shared/types/notification";

type IconType = keyof typeof FontAwesome.glyphMap;

interface SwipeAction {
  icon: IconType;
  label: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

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
  showSwipeActions?: boolean;
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
  showSwipeActions = true,
}) => {
  const colors = useThemeColors();

  const getPriorityConfig = (priority: NotificationPriority) => {
    switch (priority) {
      case "urgent":
        return {
          color: colors.error,
          backgroundColor: colors.error + "15",
          icon: "exclamation-triangle" as IconType,
          borderColor: colors.error + "30",
        };
      case "important":
        return {
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "exclamation-circle" as IconType,
          borderColor: colors.warning + "30",
        };
      case "informative":
        return {
          color: colors.info,
          backgroundColor: colors.info + "15",
          icon: "info-circle" as IconType,
          borderColor: colors.info + "30",
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

  // Define styles inside the component to access colors
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderLeftWidth: 4,
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
      borderWidth: 1.5,
    },
    contentContainer: {
      padding: 16,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    priorityContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      flex: 1,
    },
    priorityIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 2,
    },
    timestamp: {
      fontSize: 12,
      fontWeight: "400",
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    pinnedIcon: {
      marginLeft: 4,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    message: {
      fontSize: 14,
      lineHeight: 20,
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
      gap: 4,
    },
    contextText: {
      fontSize: 11,
      fontWeight: "500",
    },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    action: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
      paddingHorizontal: 12,
      minWidth: 80,
    },
    actionText: {
      fontSize: 12,
      fontWeight: "600",
      marginTop: 4,
    },
  });

  const renderLeftActions = () => {
    const actions: SwipeAction[] = [];

    if (notification.isRead && onMarkAsUnread) {
      actions.push({
        icon: "envelope",
        label: "Non lu",
        color: "#fff",
        backgroundColor: colors.info,
        onPress: onMarkAsUnread,
      });
    } else if (!notification.isRead && onMarkAsRead) {
      actions.push({
        icon: "envelope-open",
        label: "Lu",
        color: "#fff",
        backgroundColor: colors.success,
        onPress: onMarkAsRead,
      });
    }

    if (notification.isPinned && onUnpin) {
      actions.push({
        icon: "bookmark",
        label: "Dépingler",
        color: "#fff",
        backgroundColor: colors.warning,
        onPress: onUnpin,
      });
    } else if (!notification.isPinned && onPin) {
      actions.push({
        icon: "bookmark-o",
        label: "Épingler",
        color: "#fff",
        backgroundColor: colors.primary,
        onPress: onPin,
      });
    }

    return (
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.action, { backgroundColor: action.backgroundColor }]}
            onPress={action.onPress}
          >
            <FontAwesome name={action.icon} size={18} color={action.color} />
            <Text style={[styles.actionText, { color: action.color }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRightActions = () => {
    const actions: SwipeAction[] = [];

    if (onArchive) {
      actions.push({
        icon: "archive",
        label: "Archiver",
        color: "#fff",
        backgroundColor: colors.textSecondary,
        onPress: onArchive,
      });
    }

    if (onDelete) {
      actions.push({
        icon: "trash",
        label: "Supprimer",
        color: "#fff",
        backgroundColor: colors.error,
        onPress: onDelete,
      });
    }

    return (
      <View style={[styles.actionsContainer, { flexDirection: "row-reverse" }]}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.action, { backgroundColor: action.backgroundColor }]}
            onPress={action.onPress}
          >
            <FontAwesome name={action.icon} size={18} color={action.color} />
            <Text style={[styles.actionText, { color: action.color }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const cardContent = (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: notification.isPinned ? colors.primary : colors.border,
          borderLeftColor: priorityConfig.borderColor,
        },
        !notification.isRead && styles.unreadCard,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Priority indicator */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.priorityContainer}>
            <View
              style={[
                styles.priorityIcon,
                { backgroundColor: priorityConfig.backgroundColor },
              ]}
            >
              <FontAwesome
                name={priorityConfig.icon}
                size={16}
                color={priorityConfig.color}
              />
            </View>
            <View style={styles.titleContainer}>
              <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={1}
              >
                {notification.title}
              </Text>
              <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
                {formatTimestamp(notification.timestamp)}
              </Text>
            </View>
          </View>

          <View style={styles.statusContainer}>
            {notification.isPinned && (
              <FontAwesome
                name="bookmark"
                size={16}
                color={colors.primary}
                style={styles.pinnedIcon}
              />
            )}
            {!notification.isRead && (
              <View
                style={[styles.unreadDot, { backgroundColor: colors.primary }]}
              />
            )}
          </View>
        </View>

        <Text
          style={[styles.message, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>

        {notification.context && (
          <View style={styles.contextContainer}>
            {notification.context.vehicleId && (
              <View
                style={[
                  styles.contextTag,
                  { backgroundColor: colors.backgroundSecondary },
                ]}
              >
                <FontAwesome name="car" size={12} color={colors.textTertiary} />
                <Text
                  style={[styles.contextText, { color: colors.textTertiary }]}
                >
                  Véhicule
                </Text>
              </View>
            )}
            {notification.context.routeId && (
              <View
                style={[
                  styles.contextTag,
                  { backgroundColor: colors.backgroundSecondary },
                ]}
              >
                <FontAwesome
                  name="road"
                  size={12}
                  color={colors.textTertiary}
                />
                <Text
                  style={[styles.contextText, { color: colors.textTertiary }]}
                >
                  Trajet
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (!showSwipeActions) {
    return cardContent;
  }

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      leftThreshold={40}
    >
      {cardContent}
    </Swipeable>
  );
};
