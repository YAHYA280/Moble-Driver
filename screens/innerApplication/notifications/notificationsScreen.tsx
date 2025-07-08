// screens/innerApplication/notifications/notificationsScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { Notification } from "../../../shared/types/notification";
import { useNotificationStore } from "../../../store/notificationStore";
import { NotificationCard } from "./components/NotificationCard";
import { NotificationDetailModal } from "./components/NotificationDetailModal";
import { NotificationFilterBar } from "./components/NotificationFilterBar";

type FilterType =
  | "all"
  | "unread"
  | "read"
  | "pinned"
  | "archived"
  | "urgent"
  | "important"
  | "informative";

export const NotificationsScreen: React.FC = () => {
  const { colors } = useTheme();
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    pinNotification,
    unpinNotification,
    deleteNotification,
    archiveNotification,
    setFilters,
    getFilteredNotifications,
    getUnreadCount,
    getNotificationCounts,
    clearError,
    applyFilters,
  } = useNotificationStore();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Update filters based on active filter
    const filters: any = {};

    switch (activeFilter) {
      case "unread":
        filters.status = ["unread"];
        break;
      case "read":
        filters.status = ["read"];
        break;
      case "pinned":
        filters.status = ["pinned"];
        break;
      case "archived":
        filters.status = ["archived"];
        break;
      case "urgent":
      case "important":
      case "informative":
        filters.priority = [activeFilter];
        filters.status = ["unread", "read", "pinned"]; // Exclude archived for priority filters
        break;
      case "all":
      default:
        filters.status = ["unread", "read", "pinned"]; // Exclude archived by default
        break;
    }

    setFilters(filters);
  }, [activeFilter, setFilters]);

  const filteredNotifications = getFilteredNotifications();

  const getNotificationCountsData = () => {
    return getNotificationCounts();
  };

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);

    // Mark as read when opened
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleMarkAsRead = (notification: Notification) => {
    markAsRead(notification.id);
  };

  const handleMarkAsUnread = (notification: Notification) => {
    markAsUnread(notification.id);
  };

  const handlePin = (notification: Notification) => {
    pinNotification(notification.id);
  };

  const handleUnpin = (notification: Notification) => {
    unpinNotification(notification.id);
  };

  const handleDelete = (notification: Notification) => {
    Alert.alert(
      "Supprimer la notification",
      "Êtes-vous sûr de vouloir supprimer cette notification ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteNotification(notification.id);
            if (showDetailModal) {
              setShowDetailModal(false);
            }
          },
        },
      ]
    );
  };

  const handleArchive = (notification: Notification) => {
    archiveNotification(notification.id);
  };

  const handleNotificationAction = (actionId: string) => {
    // Handle notification actions (accept, refuse, report, etc.)
    console.log("Action triggered:", actionId);
    Alert.alert("Action", `Action ${actionId} déclenchée`);
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const getEmptyStateConfig = () => {
    switch (activeFilter) {
      case "unread":
        return {
          icon: "mail-unread",
          title: "Aucune notification non lue",
          subtitle: "Toutes vos notifications ont été lues",
        };
      case "read":
        return {
          icon: "mail-open",
          title: "Aucune notification lue",
          subtitle: "Les notifications lues apparaîtront ici",
        };
      case "pinned":
        return {
          icon: "bookmark",
          title: "Aucune notification favorite",
          subtitle: "Épinglez vos notifications importantes",
        };
      case "archived":
        return {
          icon: "archive",
          title: "Aucune notification archivée",
          subtitle: "Les notifications archivées apparaîtront ici",
        };
      case "urgent":
        return {
          icon: "warning",
          title: "Aucune notification urgente",
          subtitle: "Les notifications urgentes apparaîtront ici",
        };
      case "important":
        return {
          icon: "alert-circle",
          title: "Aucune notification importante",
          subtitle: "Les notifications importantes apparaîtront ici",
        };
      case "informative":
        return {
          icon: "information-circle",
          title: "Aucune notification informative",
          subtitle: "Les notifications informatives apparaîtront ici",
        };
      default:
        return {
          icon: "notifications-off",
          title: "Aucune notification",
          subtitle: "Vous recevrez vos notifications ici",
        };
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <NotificationCard
      notification={item}
      onPress={() => handleNotificationPress(item)}
      onMarkAsRead={() => handleMarkAsRead(item)}
      onMarkAsUnread={() => handleMarkAsUnread(item)}
      onPin={() => handlePin(item)}
      onUnpin={() => handleUnpin(item)}
      onDelete={() => handleDelete(item)}
      onArchive={() => handleArchive(item)}
    />
  );

  const emptyStateConfig = getEmptyStateConfig();

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name={emptyStateConfig.icon as keyof typeof Ionicons.glyphMap}
        size={64}
        color={colors.textTertiary}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {emptyStateConfig.title}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {emptyStateConfig.subtitle}
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingTop: 64,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 22,
    },
    errorContainer: {
      backgroundColor: colors.error + "15",
      margin: 16,
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Notifications"
        subtitle={`${getUnreadCount()} non lues`}
        rightIcons={[
          {
            icon: "cog",
            onPress: () => {
              router.push("/innerApplication/notifications/settings");
            },
          },
        ]}
      />

      {/* Filter Bar */}
      <NotificationFilterBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        notificationCounts={getNotificationCountsData()}
      />

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Notifications List */}
      <View style={styles.content}>
        <FlatList
          style={styles.listContainer}
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredNotifications.length === 0
              ? { flex: 1 }
              : { paddingBottom: 100 }
          }
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
      </View>

      {/* Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onMarkAsRead={() =>
          selectedNotification && handleMarkAsRead(selectedNotification)
        }
        onMarkAsUnread={() =>
          selectedNotification && handleMarkAsUnread(selectedNotification)
        }
        onPin={() => selectedNotification && handlePin(selectedNotification)}
        onUnpin={() =>
          selectedNotification && handleUnpin(selectedNotification)
        }
        onDelete={() =>
          selectedNotification && handleDelete(selectedNotification)
        }
        onAction={handleNotificationAction}
      />
    </SafeAreaView>
  );
};
