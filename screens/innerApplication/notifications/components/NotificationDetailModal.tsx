// shared/components/ui/NotificationDetailModal.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";
import {
  Notification,
  NotificationPriority,
} from "../../../../shared/types/notification";

interface NotificationDetailModalProps {
  notification: Notification | null;
  visible: boolean;
  onClose: () => void;
  onMarkAsRead?: () => void;
  onMarkAsUnread?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onDelete?: () => void;
  onAction?: (actionId: string) => void;
}

export const NotificationDetailModal: React.FC<
  NotificationDetailModalProps
> = ({
  notification,
  visible,
  onClose,
  onMarkAsRead,
  onMarkAsUnread,
  onPin,
  onUnpin,
  onDelete,
  onAction,
}) => {
  const colors = useThemeColors();

  if (!notification) return null;

  const getPriorityConfig = (priority: NotificationPriority) => {
    switch (priority) {
      case "urgent":
        return {
          color: colors.error,
          backgroundColor: colors.error + "15",
          icon: "exclamation-triangle" as keyof typeof FontAwesome.glyphMap,
          label: "Urgente",
        };
      case "important":
        return {
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "exclamation-circle" as keyof typeof FontAwesome.glyphMap,
          label: "Importante",
        };
      case "informative":
        return {
          color: colors.info,
          backgroundColor: colors.info + "15",
          icon: "info-circle" as keyof typeof FontAwesome.glyphMap,
          label: "Information",
        };
    }
  };

  const priorityConfig = getPriorityConfig(notification.priority);

  const formatFullTimestamp = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: colors.isDark
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(0, 0, 0, 0.5)",
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 8,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    prioritySection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      padding: 16,
      backgroundColor: priorityConfig.backgroundColor,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: priorityConfig.color,
    },
    priorityIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: priorityConfig.color + "20",
      marginRight: 12,
    },
    priorityInfo: {
      flex: 1,
    },
    priorityLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: priorityConfig.color,
      marginBottom: 2,
    },
    timestamp: {
      fontSize: 13,
      color: colors.textSecondary,
      textTransform: "capitalize",
    },
    statusBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: notification.isPinned
        ? colors.primary + "15"
        : colors.backgroundSecondary,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: notification.isPinned ? colors.primary : colors.textSecondary,
    },
    titleSection: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      lineHeight: 30,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    messageSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    message: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
    },
    contextSection: {
      marginBottom: 24,
    },
    contextGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    contextItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      minWidth: "45%",
    },
    contextIcon: {
      marginRight: 8,
    },
    contextText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    actionsSection: {
      marginBottom: 32,
    },
    actionsList: {
      gap: 12,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      gap: 12,
    },
    footerActions: {
      flexDirection: "row",
      gap: 12,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Détails</Text>

          <View style={styles.actionButtons}>
            {notification.isRead
              ? onMarkAsUnread && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onMarkAsUnread}
                  >
                    <FontAwesome
                      name="envelope"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                )
              : onMarkAsRead && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onMarkAsRead}
                  >
                    <FontAwesome
                      name="envelope-open"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                )}

            {notification.isPinned
              ? onUnpin && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onUnpin}
                  >
                    <FontAwesome
                      name="bookmark"
                      size={16}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )
              : onPin && (
                  <TouchableOpacity style={styles.actionButton} onPress={onPin}>
                    <FontAwesome
                      name="bookmark-o"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome
                name="times"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Priority Section */}
          <View style={styles.prioritySection}>
            <View style={styles.priorityIcon}>
              <FontAwesome
                name={priorityConfig.icon}
                size={20}
                color={priorityConfig.color}
              />
            </View>
            <View style={styles.priorityInfo}>
              <Text style={styles.priorityLabel}>{priorityConfig.label}</Text>
              <Text style={styles.timestamp}>
                {formatFullTimestamp(notification.timestamp)}
              </Text>
            </View>
            {notification.isPinned && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Épinglée</Text>
              </View>
            )}
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.subtitle}>{notification.message}</Text>
          </View>

          {/* Detailed Message */}
          {notification.detailedMessage && (
            <View style={styles.messageSection}>
              <Text style={styles.sectionTitle}>Message détaillé</Text>
              <Text style={styles.message}>{notification.detailedMessage}</Text>
            </View>
          )}

          {/* Context Information */}
          {notification.context && (
            <View style={styles.contextSection}>
              <Text style={styles.sectionTitle}>Contexte</Text>
              <View style={styles.contextGrid}>
                {notification.context.vehicleId && (
                  <View style={styles.contextItem}>
                    <FontAwesome
                      name="car"
                      size={16}
                      color={colors.textTertiary}
                      style={styles.contextIcon}
                    />
                    <Text style={styles.contextText}>Véhicule concerné</Text>
                  </View>
                )}
                {notification.context.routeId && (
                  <View style={styles.contextItem}>
                    <FontAwesome
                      name="road"
                      size={16}
                      color={colors.textTertiary}
                      style={styles.contextIcon}
                    />
                    <Text style={styles.contextText}>Trajet</Text>
                  </View>
                )}
                {notification.context.planningId && (
                  <View style={styles.contextItem}>
                    <FontAwesome
                      name="calendar"
                      size={16}
                      color={colors.textTertiary}
                      style={styles.contextIcon}
                    />
                    <Text style={styles.contextText}>Planning</Text>
                  </View>
                )}
                {notification.context.location && (
                  <View style={styles.contextItem}>
                    <FontAwesome
                      name="map-marker"
                      size={16}
                      color={colors.textTertiary}
                      style={styles.contextIcon}
                    />
                    <Text style={styles.contextText}>
                      {notification.context.location}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          {notification.actions && notification.actions.length > 0 && (
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Actions disponibles</Text>
              <View style={styles.actionsList}>
                {notification.actions.map((action) => (
                  <Button
                    key={action.id}
                    title={action.label}
                    variant={action.variant || "outline"}
                    onPress={() => onAction?.(action.id)}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerActions}>
            {onDelete && (
              <Button
                title="Supprimer"
                variant="outline"
                onPress={onDelete}
                style={{ flex: 1 }}
                textStyle={{ color: colors.error }}
              />
            )}
            <Button
              title="Fermer"
              variant="primary"
              onPress={onClose}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
