// shared/types/notification.ts
export type NotificationPriority = "urgent" | "important" | "informative";
export type NotificationStatus = "unread" | "read" | "archived" | "pinned";
export type NotificationActionType =
  | "accept"
  | "refuse"
  | "report"
  | "view_planning";

export interface NotificationAction {
  id: string;
  type: NotificationActionType;
  label: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  detailedMessage?: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  timestamp: Date;
  context?: {
    vehicleId?: string;
    routeId?: string;
    planningId?: string;
    location?: string;
  };
  actions?: NotificationAction[];
  isPinned: boolean;
  isRead: boolean;
}

export interface NotificationFilters {
  priority?: NotificationPriority[];
  status?: NotificationStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  prioritySettings: {
    urgent: boolean;
    important: boolean;
    informative: boolean;
  };
}
