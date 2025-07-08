// store/notificationStore.ts
import { create } from "zustand";
import {
  Notification,
  NotificationActions,
  NotificationFilters,
  NotificationPreferences,
  NotificationState,
} from "../shared/types/notification";

type NotificationStore = NotificationState & NotificationActions;

// Helper function to apply filters
const applyFiltersToNotifications = (
  notifications: Notification[],
  filters: NotificationFilters
) => {
  let filtered = [...notifications];

  // Filter by priority
  if (filters.priority && filters.priority.length > 0) {
    filtered = filtered.filter((n) => filters.priority!.includes(n.priority));
  }

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((n) => filters.status!.includes(n.status));
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query) ||
        (n.detailedMessage && n.detailedMessage.toLowerCase().includes(query))
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter((n) => n.timestamp >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    filtered = filtered.filter((n) => n.timestamp <= filters.dateTo!);
  }

  // Sort: pinned first, then by timestamp (newest first)
  return filtered.sort((a, b) => {
    // Pinned notifications always come first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // If both are pinned or both are not pinned, sort by timestamp
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

// Mock data with updated notifications based on images
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouveau trajet",
    message: "Trajet ajouté - 25 avril, 08h30.",
    detailedMessage:
      "Un nouveau trajet a été programmé pour le 25 avril à 08h30. Veuillez consulter votre planning pour plus de détails.",
    priority: "important",
    status: "unread",
    timestamp: new Date(2025, 3, 14, 8, 30),
    context: {
      routeId: "route_123",
      planningId: "planning_456",
    },
    actions: [
      { id: "1", type: "accept", label: "Accepter", variant: "primary" },
      {
        id: "2",
        type: "view_planning",
        label: "Voir planning",
        variant: "outline",
      },
    ],
    isPinned: false,
    isRead: false,
  },
  {
    id: "2",
    title: "Modif. Email",
    message: "Email modifié - voir détails.",
    detailedMessage:
      "Votre adresse email a été modifiée avec succès. Si ce n'est pas vous qui avez effectué cette modification, veuillez contacter le support.",
    priority: "informative",
    status: "read",
    timestamp: new Date(2025, 3, 14, 10, 15),
    isPinned: false,
    isRead: true,
  },
  {
    id: "3",
    title: "Refus de congé",
    message: "Ta demande du 26 avril annulée.",
    detailedMessage:
      "Votre demande de congé pour le 26 avril a été refusée. Raison: Manque d'effectif. Veuillez contacter votre superviseur pour plus d'informations.",
    priority: "urgent",
    status: "pinned",
    timestamp: new Date(2025, 3, 14, 14, 0),
    context: {
      planningId: "leave_789",
    },
    actions: [
      {
        id: "3",
        type: "report",
        label: "Signaler un problème",
        variant: "danger",
      },
    ],
    isPinned: true,
    isRead: false,
  },
  {
    id: "4",
    title: "Nouveau trajet",
    message: "Trajet ajouté - 25 avril, 08h30.",
    detailedMessage:
      "Un nouveau trajet a été programmé pour le 25 avril à 08h30. Veuillez vous préparer à l'heure.",
    priority: "important",
    status: "unread",
    timestamp: new Date(2025, 3, 14, 15, 30),
    context: {
      vehicleId: "vehicle_101",
      routeId: "route_202",
    },
    actions: [
      { id: "4", type: "accept", label: "Accepter", variant: "primary" },
      { id: "5", type: "refuse", label: "Refuser", variant: "outline" },
    ],
    isPinned: false,
    isRead: false,
  },
  {
    id: "5",
    title: "Modif. trajet",
    message: "Trajet modifié - voir détails.",
    detailedMessage:
      "Votre trajet a été modifié. Veuillez vérifier les nouveaux horaires dans votre planning.",
    priority: "informative",
    status: "read",
    timestamp: new Date(2025, 3, 14, 16, 0),
    isPinned: false,
    isRead: true,
  },
  {
    id: "6",
    title: "Trajet annulé",
    message: "Trajet du 26 avril annulé.",
    detailedMessage:
      "Le trajet prévu pour le 26 avril a été annulé en raison de conditions météorologiques.",
    priority: "urgent",
    status: "unread",
    timestamp: new Date(2025, 3, 14, 17, 15),
    isPinned: false,
    isRead: false,
  },
  {
    id: "7",
    title: "Départ imminent",
    message: "Départ dans 30 min.",
    detailedMessage:
      "Votre prochain trajet commence dans 30 minutes. Veuillez vous diriger vers le véhicule assigné.",
    priority: "urgent",
    status: "unread",
    timestamp: new Date(2025, 3, 14, 18, 0),
    context: {
      vehicleId: "vehicle_103",
      routeId: "route_305",
    },
    isPinned: false,
    isRead: false,
  },
  {
    id: "8",
    title: "Rappel planning",
    message: "N'oubliez pas votre rendez-vous de 14h.",
    detailedMessage:
      "Votre rendez-vous avec le superviseur est prévu à 14h en salle de réunion.",
    priority: "informative",
    status: "read",
    timestamp: new Date(2025, 3, 13, 12, 0),
    isPinned: false,
    isRead: true,
  },
  {
    id: "9",
    title: "Trophée débloqué",
    message: "Félicitations ! Conducteur du mois.",
    detailedMessage:
      "Vous avez été élu conducteur du mois grâce à vos excellentes performances.",
    priority: "informative",
    status: "read",
    timestamp: new Date(2025, 3, 1, 9, 0),
    isPinned: false,
    isRead: true,
  },
  {
    id: "10",
    title: "Conseil de sécurité",
    message: "Vérifiez toujours vos rétroviseurs.",
    detailedMessage:
      "Rappel de sécurité: Pensez à vérifier et ajuster vos rétroviseurs avant chaque départ.",
    priority: "informative",
    status: "read",
    timestamp: new Date(2025, 2, 28, 8, 0),
    isPinned: false,
    isRead: true,
  },
];

const defaultPreferences: NotificationPreferences = {
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  soundEnabled: true,
  vibrationEnabled: true,
  prioritySettings: {
    urgent: true,
    important: true,
    informative: true,
  },
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  // State
  notifications: mockNotifications,
  filteredNotifications: mockNotifications,
  filters: {},
  preferences: defaultPreferences,
  isLoading: false,
  error: null,

  // Actions
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredNotifications = applyFiltersToNotifications(
          mockNotifications,
          state.filters
        );
        return {
          notifications: mockNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des notifications",
        isLoading: false,
      });
    }
  },

  markAsRead: (id: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      set((state) => {
        const updatedNotifications = state.notifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
                status: notification.isPinned
                  ? ("pinned" as const)
                  : ("read" as const),
              }
            : notification
        );

        const filteredNotifications = applyFiltersToNotifications(
          updatedNotifications,
          state.filters
        );

        return {
          notifications: updatedNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    }, 300);
  },

  markAsUnread: (id: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      set((state) => {
        const updatedNotifications = state.notifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: false,
                status: notification.isPinned
                  ? ("pinned" as const)
                  : ("unread" as const),
              }
            : notification
        );

        const filteredNotifications = applyFiltersToNotifications(
          updatedNotifications,
          state.filters
        );

        return {
          notifications: updatedNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    }, 300);
  },

  pinNotification: (id: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      set((state) => {
        const updatedNotifications = state.notifications.map((notification) =>
          notification.id === id
            ? { ...notification, isPinned: true, status: "pinned" as const }
            : notification
        );

        const filteredNotifications = applyFiltersToNotifications(
          updatedNotifications,
          state.filters
        );

        return {
          notifications: updatedNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    }, 300);
  },

  unpinNotification: (id: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      set((state) => {
        const updatedNotifications = state.notifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isPinned: false,
                status: notification.isRead
                  ? ("read" as const)
                  : ("unread" as const),
              }
            : notification
        );

        const filteredNotifications = applyFiltersToNotifications(
          updatedNotifications,
          state.filters
        );

        return {
          notifications: updatedNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    }, 300);
  },

  deleteNotification: (id: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      set((state) => {
        const updatedNotifications = state.notifications.filter(
          (notification) => notification.id !== id
        );

        const filteredNotifications = applyFiltersToNotifications(
          updatedNotifications,
          state.filters
        );

        return {
          notifications: updatedNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    }, 300);
  },

  setFilters: (newFilters: Partial<NotificationFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredNotifications = applyFiltersToNotifications(
        state.notifications,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredNotifications,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredNotifications = applyFiltersToNotifications(
        state.notifications,
        {}
      );

      return {
        filters: {},
        filteredNotifications,
      };
    });
  },

  applyFilters: () => {
    set((state) => {
      const filteredNotifications = applyFiltersToNotifications(
        state.notifications,
        state.filters
      );
      return { filteredNotifications };
    });
  },

  updatePreferences: (newPreferences: Partial<NotificationPreferences>) => {
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences },
    }));
  },

  getFilteredNotifications: () => {
    return get().filteredNotifications;
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },

  getNotificationCounts: () => {
    const notifications = get().notifications;
    const counts = {
      all: 0,
      unread: 0,
      read: 0,
      pinned: 0,
      urgent: 0,
      important: 0,
      informative: 0,
    };

    notifications.forEach((notification) => {
      // Count all non-archived notifications
      counts.all++;

      // Count by status
      if (notification.isPinned) {
        counts.pinned++;
      }

      if (notification.isRead) {
        counts.read++;
      } else {
        counts.unread++;
      }

      // Count by priority
      counts[notification.priority]++;
    });

    return counts;
  },

  clearError: () => {
    set({ error: null });
  },
}));
