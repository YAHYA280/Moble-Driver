// screens/innerApplication/notifications/components/NotificationItemMenu.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Notification } from "../../../../shared/types/notification";

interface NotificationItemMenuProps {
  notification: Notification | null;
  position: { x: number; y: number };
  visible: boolean;
  onClose: () => void;
  onMarkAsRead?: () => void;
  onMarkAsUnread?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onDelete?: () => void;
}

const MENU_WIDTH = 200;
const SCREEN_MARGIN = 16;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const NotificationItemMenu: React.FC<NotificationItemMenuProps> = ({
  notification,
  position,
  visible,
  onClose,
  onMarkAsRead,
  onMarkAsUnread,
  onPin,
  onUnpin,
  onDelete,
}) => {
  const colors = useThemeColors();

  if (!notification || !visible) return null;

  // Calculate menu position while ensuring it stays on screen
  const rawLeft = position.x - MENU_WIDTH / 2;
  const clampedLeft = Math.min(
    Math.max(rawLeft, SCREEN_MARGIN),
    SCREEN_WIDTH - MENU_WIDTH - SCREEN_MARGIN
  );

  // Ensure menu doesn't go below screen
  const maxTop = SCREEN_HEIGHT - 250; // Approximate menu height
  const clampedTop = Math.min(position.y, maxTop);

  const handleToggleRead = () => {
    if (notification.isRead && onMarkAsUnread) {
      onMarkAsUnread();
    } else if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead();
    }
    onClose();
  };

  const handleTogglePin = () => {
    if (notification.isPinned && onUnpin) {
      onUnpin();
    } else if (!notification.isPinned && onPin) {
      onPin();
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    onClose();
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
    },
    menuContainer: {
      position: "absolute",
      width: MENU_WIDTH,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      }),
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    menuIcon: {
      marginRight: 12,
      width: 20,
      textAlign: "center",
    },
    menuText: {
      fontSize: 14,
      fontWeight: "500",
      flex: 1,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 8,
    },
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.menuContainer,
          {
            top: clampedTop,
            left: clampedLeft,
          },
        ]}
      >
        {/* Read/Unread Option */}
        <TouchableOpacity onPress={handleToggleRead} style={styles.menuItem}>
          <FontAwesome
            name={notification.isRead ? "eye-slash" : "eye"}
            size={16}
            style={styles.menuIcon}
            color={colors.primary}
          />
          <Text style={[styles.menuText, { color: colors.text }]}>
            {notification.isRead ? "Marquer non lu" : "Marquer lu"}
          </Text>
        </TouchableOpacity>

        {/* Pin/Unpin Option */}
        <TouchableOpacity onPress={handleTogglePin} style={styles.menuItem}>
          <FontAwesome
            name={notification.isPinned ? "bookmark" : "bookmark-o"}
            size={16}
            style={styles.menuIcon}
            color={notification.isPinned ? colors.warning : colors.primary}
          />
          <Text style={[styles.menuText, { color: colors.text }]}>
            {notification.isPinned ? "Dépingler" : "Épingler"}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Delete Option */}
        <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
          <FontAwesome
            name="trash"
            size={16}
            style={styles.menuIcon}
            color={colors.error}
          />
          <Text style={[styles.menuText, { color: colors.error }]}>
            Supprimer
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
