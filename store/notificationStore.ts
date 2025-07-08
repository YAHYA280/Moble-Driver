// store/notificationStore.ts
import { create } from "zustand";
import {
  Notification,
  NotificationFilters,
  NotificationPreferences,
} from "../shared/types/notification";

interface NotificationState {
  notifications: Notification[];
  filters: NotificationFilters;
  preferences: NotificationPreferences;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  // CRUD Operations
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  pinNotification: (id: string) => void;
  unpinNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
  archiveNotification: (id: string) => void;

  // Filters
  setFilters: (filters: Partial<NotificationFilters>) => void;
  clearFilters: () => void;

  // Preferences
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;

  // Utils
  getFilteredNotifications: () => Notification[];
  getUnreadCount: () => number;
  getNotificationCounts: () => {
    all: number;
    unread: number;
    read: number;
    pinned: number;
    archived: number;
    urgent: number;
    important: number;
    informative: number;
  };
  clearError: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

// Mock data for development
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouveau trajet",
    message: "Trajet ajouté - 25 avril, 08h30",
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
    message: "Email modifié - voir détails",
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
    message: "Ta demande du 26 avril annulée",
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
    title: "Départ imminent",
    message: "Départ dans 30 min",
    detailedMessage:
      "Votre prochain trajet commence dans 30 minutes. Veuillez vous diriger vers le véhicule assigné et effectuer les vérifications d'usage.",
    priority: "urgent",
    status: "unread",
    timestamp: new Date(2025, 3, 14, 15, 30),
    context: {
      vehicleId: "vehicle_101",
      routeId: "route_202",
    },
    actions: [
      { id: "4", type: "accept", label: "J'y vais", variant: "primary" },
      { id: "5", type: "report", label: "Problème", variant: "outline" },
    ],
    isPinned: false,
    isRead: false,
  },
  {
    id: "5",
    title: "Rappel planning",
    message: "N'oubliez pas votre rendez-vous de 14h",
    detailedMessage:
      "Votre rendez-vous avec le superviseur est prévu à 14h en salle de réunion.",
    priority: "informative",
    status: "read",
    timestamp: new Date(2025, 3, 13, 12, 0),
    isPinned: false,
    isRead: true,
  },
  {
    id: "6",
    title: "Trophée débloqué",
    message: "Félicitations ! Conducteur du mois",
    detailedMessage:
      "Vous avez été élu conducteur du mois grâce à vos excellentes performances.",
    priority: "informative",
    status: "archived",
    timestamp: new Date(2025, 3, 1, 9, 0),
    isPinned: false,
    isRead: true,
  },
  {
    id: "7",
    title: "Conseil de sécurité",
    message: "Vérifiez toujours vos rétroviseurs",
    detailedMessage:
      "Rappel de sécurité: Pensez à vérifier et ajuster vos rétroviseurs avant chaque départ.",
    priority: "informative",
    status: "archived",
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
      set({ notifications: mockNotifications, isLoading: false });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des notifications",
        isLoading: false,
      });
    }
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
              status: notification.isPinned
                ? ("pinned" as const)
                : ("read" as const),
            }
          : notification
      ),
    }));
  },

  markAsUnread: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: false,
              status: notification.isPinned
                ? ("pinned" as const)
                : ("unread" as const),
            }
          : notification
      ),
    }));
  },

  pinNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isPinned: true, status: "pinned" as const }
          : notification
      ),
    }));
  },

  unpinNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isPinned: false,
              status: notification.isRead
                ? ("read" as const)
                : ("unread" as const),
            }
          : notification
      ),
    }));
  },

  deleteNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    }));
  },

  archiveNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              status: "archived" as const,
              isPinned: false,
            }
          : notification
      ),
    }));
  },

  setFilters: (newFilters: Partial<NotificationFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  updatePreferences: (newPreferences: Partial<NotificationPreferences>) => {
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences },
    }));
  },

  getFilteredNotifications: () => {
    const { notifications, filters } = get();
    let filtered = [...notifications];

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter((n) => filters.priority!.includes(n.priority));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((n) => filters.status!.includes(n.status));
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((n) => n.timestamp >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter((n) => n.timestamp <= filters.dateTo!);
    }

    // Sort: pinned first, then by timestamp (newest first)
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  },

  getUnreadCount: () => {
    return get().notifications.filter(
      (n) => !n.isRead && n.status !== "archived"
    ).length;
  },

  getNotificationCounts: () => {
    const notifications = get().notifications;
    const counts = {
      all: 0,
      unread: 0,
      read: 0,
      pinned: 0,
      archived: 0,
      urgent: 0,
      important: 0,
      informative: 0,
    };

    notifications.forEach((notification) => {
      // Count by status
      if (notification.status === "archived") {
        counts.archived++;
      } else {
        counts.all++;

        if (notification.isPinned) {
          counts.pinned++;
        }

        if (notification.isRead) {
          counts.read++;
        } else {
          counts.unread++;
        }
      }

      // Count by priority (excluding archived)
      if (notification.status !== "archived") {
        counts[notification.priority]++;
      }
    });

    return counts;
  },

  clearError: () => {
    set({ error: null });
  },
}));
