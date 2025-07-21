// shared/types/calendar.ts
export type AppointmentType =
  | "visite-medicale"
  | "formation"
  | "entretien-rh"
  | "maintenance"
  | "reunion"
  | "autre";

export type AppointmentStatus = "prevu" | "confirme" | "annule" | "reporte";

export interface AppointmentCenter {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface AppointmentContact {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
}

export interface Appointment {
  id: string;
  title: string;
  type: AppointmentType;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  status: AppointmentStatus;
  description?: string;
  location: string;
  center?: AppointmentCenter;
  contact?: AppointmentContact;
  notes?: string;
  isConfirmed: boolean;
  canModify: boolean;
  canCancel: boolean;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  convocationUrl?: string;
}

export interface CalendarFilters {
  types?: AppointmentType[];
  status?: AppointmentStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface CalendarPreferences {
  defaultView: "month" | "list";
  startWeekOn: 0 | 1; // 0 for Sunday, 1 for Monday
  showWeekNumbers: boolean;
  reminderMinutes: number[];
}

export interface CalendarState {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  filters: CalendarFilters;
  preferences: CalendarPreferences;
  selectedDate: string | null;
  selectedAppointment: Appointment | null;
  currentView: "month" | "list";
  isLoading: boolean;
  error: string | null;
}

export interface CalendarActions {
  // CRUD Operations
  fetchAppointments: (monthYear?: string) => Promise<void>;
  fetchAppointmentDetails: (id: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  requestReschedule: (
    id: string,
    reason: string,
    preferredDates?: string[]
  ) => Promise<void>;
  cancelAppointment: (id: string, reason: string) => Promise<void>;

  // Filters & View
  setFilters: (filters: Partial<CalendarFilters>) => void;
  clearFilters: () => void;
  setCurrentView: (view: "month" | "list") => void;
  setSelectedDate: (date: string | null) => void;
  selectAppointment: (appointment: Appointment | null) => void;

  // Preferences
  updatePreferences: (preferences: Partial<CalendarPreferences>) => void;

  // Utils
  getFilteredAppointments: () => Appointment[];
  getAppointmentsForDate: (date: string) => Appointment[];
  getAppointmentCounts: () => {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
  clearError: () => void;
}

// Color mapping for appointment types
export const APPOINTMENT_TYPE_COLORS: Record<AppointmentType, string> = {
  "visite-medicale": "#22c55e", // Green
  formation: "#ef4444", // Red
  "entretien-rh": "#3b82f6", // Blue
  maintenance: "#f59e0b", // Orange
  reunion: "#8b5cf6", // Purple
  autre: "#6b7280", // Gray
};

// Labels for appointment types
export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  "visite-medicale": "Visite médicale",
  formation: "Formation",
  "entretien-rh": "Entretien RH",
  maintenance: "Maintenance",
  reunion: "Réunion",
  autre: "Autre",
};

// Labels for appointment status
export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  prevu: "Prévu",
  confirme: "Confirmé",
  annule: "Annulé",
  reporte: "Reporté",
};
