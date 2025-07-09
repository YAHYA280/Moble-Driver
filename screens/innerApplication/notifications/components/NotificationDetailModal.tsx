// shared/components/ui/NotificationDetailModal.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
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
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
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

const { height: screenHeight } = Dimensions.get("window");

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
      backgroundColor: colors.background,
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
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
      minHeight: 64,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    headerLeft: {
      width: 50,
      alignItems: "flex-start",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
    },
    headerRight: {
      width: 100,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 8,
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
      paddingBottom: 100, // Extra padding for footer
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
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      lineHeight: 28,
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
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      gap: 12,
      ...Platform.select({
        ios: {
          paddingBottom: 32, // Extra padding for iOS safe area
        },
      }),
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
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        <SafeAreaView style={styles.container} edges={["top"]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesome
                  name="times"
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.headerTitle}>Détails</Text>

            <View style={styles.headerRight}>
              <ConditionalComponent
                isValid={notification.isRead && !!onMarkAsUnread}
              >
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
              </ConditionalComponent>

              <ConditionalComponent
                isValid={!notification.isRead && !!onMarkAsRead}
              >
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
              </ConditionalComponent>

              <ConditionalComponent
                isValid={notification.isPinned && !!onUnpin}
              >
                <TouchableOpacity style={styles.actionButton} onPress={onUnpin}>
                  <FontAwesome
                    name="bookmark"
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </ConditionalComponent>

              <ConditionalComponent isValid={!notification.isPinned && !!onPin}>
                <TouchableOpacity style={styles.actionButton} onPress={onPin}>
                  <FontAwesome
                    name="bookmark-o"
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </ConditionalComponent>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
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
              <ConditionalComponent isValid={notification.isPinned}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Épinglée</Text>
                </View>
              </ConditionalComponent>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.subtitle}>{notification.message}</Text>
            </View>

            {/* Detailed Message */}
            <ConditionalComponent isValid={!!notification.detailedMessage}>
              <View style={styles.messageSection}>
                <Text style={styles.sectionTitle}>Message détaillé</Text>
                <Text style={styles.message}>
                  {notification.detailedMessage}
                </Text>
              </View>
            </ConditionalComponent>

            {/* Context Information */}
            <ConditionalComponent isValid={!!notification.context}>
              <View style={styles.contextSection}>
                <Text style={styles.sectionTitle}>Contexte</Text>
                <View style={styles.contextGrid}>
                  <ConditionalComponent
                    isValid={!!notification.context?.vehicleId}
                  >
                    <View style={styles.contextItem}>
                      <FontAwesome
                        name="car"
                        size={16}
                        color={colors.textTertiary}
                        style={styles.contextIcon}
                      />
                      <Text style={styles.contextText}>Véhicule concerné</Text>
                    </View>
                  </ConditionalComponent>

                  <ConditionalComponent
                    isValid={!!notification.context?.routeId}
                  >
                    <View style={styles.contextItem}>
                      <FontAwesome
                        name="road"
                        size={16}
                        color={colors.textTertiary}
                        style={styles.contextIcon}
                      />
                      <Text style={styles.contextText}>Trajet</Text>
                    </View>
                  </ConditionalComponent>

                  <ConditionalComponent
                    isValid={!!notification.context?.planningId}
                  >
                    <View style={styles.contextItem}>
                      <FontAwesome
                        name="calendar"
                        size={16}
                        color={colors.textTertiary}
                        style={styles.contextIcon}
                      />
                      <Text style={styles.contextText}>Planning</Text>
                    </View>
                  </ConditionalComponent>

                  <ConditionalComponent
                    isValid={!!notification.context?.location}
                  >
                    <View style={styles.contextItem}>
                      <FontAwesome
                        name="map-marker"
                        size={16}
                        color={colors.textTertiary}
                        style={styles.contextIcon}
                      />
                      <Text style={styles.contextText}>
                        {notification.context?.location}
                      </Text>
                    </View>
                  </ConditionalComponent>
                </View>
              </View>
            </ConditionalComponent>

            {/* Action Buttons */}
            <ConditionalComponent
              isValid={
                !!notification.actions && notification.actions.length > 0
              }
            >
              <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>Actions disponibles</Text>
                <View style={styles.actionsList}>
                  {notification.actions?.map((action) => (
                    <Button
                      key={action.id}
                      title={action.label}
                      variant={action.variant || "outline"}
                      onPress={() => onAction?.(action.id)}
                    />
                  ))}
                </View>
              </View>
            </ConditionalComponent>
          </ScrollView>

          {/* Fixed Footer */}
          <View style={styles.footer}>
            <View style={styles.footerActions}>
              <ConditionalComponent isValid={!!onDelete}>
                <Button
                  title="Supprimer"
                  variant="outline"
                  onPress={onDelete!}
                  style={{ flex: 1 }}
                  textStyle={{ color: colors.error }}
                />
              </ConditionalComponent>
              <Button
                title="Fermer"
                variant="primary"
                onPress={onClose}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};
