// shared/types/routeSheet.ts

export type TimeSlot = "Matin" | "Midi" | "Après-midi" | "Soir";

export type RouteSheetStatus = "draft" | "submitted" | "archived";

export interface KilometrageData {
  startKm: number;
  endKm: number;
}

export interface TimeSlotData {
  id: string;
  timeSlot: TimeSlot;
  isActive: boolean;
  kilometrage: KilometrageData;
  otherTrips: string; // Description of other trips
  comments: string;
  isCompleted: boolean;
}

export interface DayData {
  date: string; // YYYY-MM-DD format
  timeSlots: TimeSlotData[];
  isCompleted: boolean; // All active time slots are filled
}

export interface RouteSheet {
  id: string;
  month: string; // YYYY-MM format
  year: number;
  monthName: string;
  driverId: string;
  status: RouteSheetStatus;
  days: DayData[];
  createdAt: string;
  lastModified: string;
  submittedAt?: string;
  totalKilometrage: number;
  completionPercentage: number;
}

export interface RouteSheetFilters {
  year?: number;
  status?: RouteSheetStatus;
  searchQuery?: string;
}

export interface RouteSheetState {
  routeSheets: RouteSheet[];
  filteredRouteSheets: RouteSheet[];
  currentRouteSheet: RouteSheet | null;
  selectedDay: DayData | null;
  filters: RouteSheetFilters;
  isLoading: boolean;
  error: string | null;
  isEditMode: boolean;
}

export interface RouteSheetActions {
  fetchRouteSheets: () => Promise<void>;
  getCurrentMonthRouteSheet: () => Promise<RouteSheet | null>;
  createRouteSheet: (month: string) => Promise<RouteSheet>;
  updateTimeSlotData: (
    dayDate: string,
    timeSlot: TimeSlot,
    data: Partial<TimeSlotData>
  ) => Promise<void>;
  toggleTimeSlotActive: (
    dayDate: string,
    timeSlot: TimeSlot,
    isActive: boolean
  ) => Promise<void>;
  saveDayData: (dayDate: string, dayData: DayData) => Promise<void>;
  submitRouteSheet: (routeSheetId: string) => Promise<void>;
  setFilters: (filters: Partial<RouteSheetFilters>) => void;
  clearFilters: () => void;
  setEditMode: (isEdit: boolean) => void;
  selectDay: (day: DayData | null) => void;
  clearError: () => void;
}

// Form validation types
export interface TimeSlotValidation {
  timeSlot: TimeSlot;
  isValid: boolean;
  errors: {
    startKm?: string;
    endKm?: string;
    kilometrage?: string;
  };
}

export interface DayValidation {
  date: string;
  isValid: boolean;
  timeSlots: TimeSlotValidation[];
}

// Constants
export const TIME_SLOTS: TimeSlot[] = ["Matin", "Midi", "Après-midi", "Soir"];

export const TIME_SLOT_COLORS = {
  Matin: "#22c55e",
  Midi: "#f59e0b",
  "Après-midi": "#3b82f6",
  Soir: "#8b5cf6",
} as const;

export const TIME_SLOT_LABELS = {
  Matin: "Matin",
  Midi: "Midi",
  "Après-midi": "Après-midi",
  Soir: "Soir",
} as const;
