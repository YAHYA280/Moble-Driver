import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { SearchModal } from "../../../shared/components/ui/SearchModal";
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
  | "urgent"
  | "important"
  | "informative";

const AnimatedNotificationCard: React.FC<{
  notification: Notification;
  index: number;
  onPress: () => void;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
  onPin: () => void;
  onUnpin: () => void;
  onDelete: () => void;
}> = ({
  notification,
  index,
  onPress,
  onMarkAsRead,
  onMarkAsUnread,
  onPin,
  onUnpin,
  onDelete,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      }}
    >
      <NotificationCard
        notification={notification}
        onPress={onPress}
        onMarkAsRead={onMarkAsRead}
        onMarkAsUnread={onMarkAsUnread}
        onPin={onPin}
        onUnpin={onUnpin}
        onDelete={onDelete}
      />
    </Animated.View>
  );
};

export const NotificationsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const params = useLocalSearchParams();

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
    setFilters,
    clearFilters,
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

  const headerAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchNotifications();

    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(filterAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    clearFilters();

    if (activeFilter !== "all") {
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
        case "urgent":
        case "important":
        case "informative":
          filters.priority = [activeFilter];
          break;
      }

      if (Object.keys(filters).length > 0) {
        setFilters(filters);
      }
    }
  }, [activeFilter, setFilters, clearFilters]);

  const filteredNotifications = getFilteredNotifications();

  const getNotificationCountsData = () => {
    return getNotificationCounts();
  };

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);

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

  const handleNotificationAction = (actionId: string) => {
    Alert.alert("Action", `Action ${actionId} déclenchée`);
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleSearch = (query: string) => {
    setFilters({ searchQuery: query });
  };
  const handleBackPress = () => {
    const returnTo = params.returnTo as string;

    if (returnTo) {
      router.push(returnTo as any);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/(tabs)");
      }
    }
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

  const renderNotificationItem = ({
    item,
    index,
  }: {
    item: Notification;
    index: number;
  }) => (
    <AnimatedNotificationCard
      notification={item}
      index={index}
      onPress={() => handleNotificationPress(item)}
      onMarkAsRead={() => handleMarkAsRead(item)}
      onMarkAsUnread={() => handleMarkAsUnread(item)}
      onPin={() => handlePin(item)}
      onUnpin={() => handleUnpin(item)}
      onDelete={() => handleDelete(item)}
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
      {/* Animated Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}
      >
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: handleBackPress,
          }}
          title="Notifications"
          subtitle={`${getUnreadCount()} non lues`}
          rightIcons={[
            {
              icon: "search",
              onPress: handleSearchPress,
            },
            {
              icon: "cog",
              onPress: () => {
                router.push("/notifications/settings");
              },
            },
          ]}
        />
      </Animated.View>

      {/* Animated Filter Bar */}
      <Animated.View
        style={{
          opacity: filterAnim,
          transform: [
            {
              translateY: filterAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-30, 0],
              }),
            },
          ],
        }}
      >
        <NotificationFilterBar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          notificationCounts={getNotificationCountsData()}
        />
      </Animated.View>

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

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

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        placeholder="Rechercher notifications..."
        title="Rechercher notifications"
      />

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
