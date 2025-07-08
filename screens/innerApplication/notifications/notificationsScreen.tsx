// screens/innerApplication/notifications/notificationsScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
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

type FilterType = "all" | "urgent" | "important" | "informative" | "history";

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
    clearError,
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

    if (activeFilter !== "all" && activeFilter !== "history") {
      filters.priority = [activeFilter];
    }

    if (activeFilter === "history") {
      filters.status = ["archived"];
    } else {
      filters.status = ["unread", "read", "pinned"];
    }

    setFilters(filters);
  }, [activeFilter]);

  const filteredNotifications = getFilteredNotifications();

  const getNotificationCounts = () => {
    const counts = {
      all: 0,
      urgent: 0,
      important: 0,
      informative: 0,
      history: 0,
    };

    notifications.forEach((notification) => {
      if (notification.status === "archived") {
        counts.history++;
      } else {
        counts.all++;
        counts[notification.priority]++;
      }
    });

    return counts;
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome
        name="bell-slash"
        size={64}
        color={colors.textTertiary}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {activeFilter === "history"
          ? "Aucune notification archivée"
          : "Aucune notification"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {activeFilter === "history"
          ? "Les notifications archivées apparaîtront ici"
          : "Vous recevrez vos notifications ici"}
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
      {/* Header - Only with settings icon */}
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

      {/* Filter Bar Only */}
      <NotificationFilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        notificationCounts={getNotificationCounts()}
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
