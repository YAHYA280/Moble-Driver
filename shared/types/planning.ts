// shared/types/planning.ts
export type TripStatus = "prevu" | "en_cours" | "termine" | "annule";
export type TripType = "ecole" | "transport" | "maintenance" | "autre";

export interface TripStop {
  id: string;
  name: string;
  address: string;
  arrivalTime: string;
  departureTime?: string;
  passengers?: number;
  type: "pickup" | "dropoff" | "intermediate";
}

export interface AssignedVehicle {
  id: string;
  plateNumber: string;
  model: string;
  brand: string;
}

export interface Trip {
  id: string;
  title: string;
  type: TripType;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  status: TripStatus;
  description?: string;

  // Route information
  startLocation: string;
  endLocation: string;
  stops: TripStop[];
  estimatedDistance?: number; // in km
  estimatedDuration?: number; // in minutes

  // Vehicle and assignment
  assignedVehicle?: AssignedVehicle;
  driverId: string;
  driverName: string;

  // Passengers
  totalPassengers: number;
  confirmedPassengers: number;

  // Additional info
  notes?: string;
  instructions?: string;
  contactNumber?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  canModify: boolean;
  canCancel: boolean;
}

export interface PlanningFilters {
  status?: TripStatus[];
  type?: TripType[];
  vehicleId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface PlanningPreferences {
  defaultView: "month" | "week" | "day" | "list";
  showWeekNumbers: boolean;
  startWeekOn: 0 | 1; // 0 for Sunday, 1 for Monday
  autoRefresh: boolean;
  reminderMinutes: number[];
}

export interface PlanningState {
  trips: Trip[];
  filteredTrips: Trip[];
  filters: PlanningFilters;
  preferences: PlanningPreferences;
  selectedDate: string | null;
  selectedTrip: Trip | null;
  currentView: "month" | "week" | "day" | "list";
  isLoading: boolean;
  error: string | null;
}

export interface PlanningActions {
  // CRUD Operations
  fetchTrips: (monthYear?: string) => Promise<void>;
  fetchTripDetails: (id: string) => Promise<void>;
  updateTripStatus: (
    id: string,
    status: TripStatus,
    notes?: string
  ) => Promise<void>;

  // Filters & View
  setFilters: (filters: Partial<PlanningFilters>) => void;
  clearFilters: () => void;
  setCurrentView: (view: "month" | "week" | "day" | "list") => void;
  setSelectedDate: (date: string | null) => void;
  selectTrip: (trip: Trip | null) => void;

  // Utils
  getFilteredTrips: () => Trip[];
  getTripsForDate: (date: string) => Trip[];
  getUpcomingTrips: (limit?: number) => Trip[];
  getTripCounts: () => {
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  clearError: () => void;
}

// Color mapping for trip types
export const TRIP_TYPE_COLORS: Record<TripType, string> = {
  ecole: "#3b82f6", // Blue
  transport: "#22c55e", // Green
  maintenance: "#f59e0b", // Orange
  autre: "#6b7280", // Gray
};

// Labels for trip types
export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  ecole: "École",
  transport: "Transport",
  maintenance: "Maintenance",
  autre: "Autre",
};

// Labels for trip status
export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  prevu: "Prévu",
  en_cours: "En cours",
  termine: "Terminé",
  annule: "Annulé",
};
