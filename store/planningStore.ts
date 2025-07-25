// store/planningStore.ts - Updated with matching vehicle IDs
import { create } from "zustand";
import {
  PlanningActions,
  PlanningFilters,
  PlanningPreferences,
  PlanningState,
  Trip,
} from "../shared/types/planning";

type PlanningStore = PlanningState &
  PlanningActions & {
    getUpcomingTrips: (limit?: number) => Trip[];
    getTripsForWeek: (startDate: string, endDate: string) => Trip[];
  };

// Helper function to apply filters
const applyFiltersToTrips = (trips: Trip[], filters: PlanningFilters) => {
  let filtered = [...trips];

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((t) => filters.status!.includes(t.status));
  }

  // Filter by type
  if (filters.type && filters.type.length > 0) {
    filtered = filtered.filter((t) => filters.type!.includes(t.type));
  }

  // Filter by vehicle
  if (filters.vehicleId) {
    filtered = filtered.filter(
      (t) => t.assignedVehicle?.id === filters.vehicleId
    );
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.startLocation.toLowerCase().includes(query) ||
        t.endLocation.toLowerCase().includes(query) ||
        t.assignedVehicle?.plateNumber.toLowerCase().includes(query) ||
        t.stops.some((stop) => stop.name.toLowerCase().includes(query))
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter((t) => new Date(t.date) >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    filtered = filtered.filter((t) => new Date(t.date) <= filters.dateTo!);
  }

  // Sort by date and time
  return filtered.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });
};

// Generate dates for current month and next month
const generateDatesForMonth = (year: number, month: number) => {
  const dates = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

// Get current date info
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

// Generate dates for current and next month
const currentMonthDates = generateDatesForMonth(currentYear, currentMonth);
const nextMonthDates = generateDatesForMonth(nextMonthYear, nextMonth);

// Vehicle assignments that match the vehicle store
const vehicleAssignments = [
  {
    id: "95700L15",
    plateNumber: "95700L15",
    model: "A4",
    brand: "Audi",
  },
  {
    id: "SN-UX420-77V1",
    plateNumber: "SN-UX420-77V1",
    model: "S 580 e 4MATIC Long",
    brand: "Mercedes-Benz",
  },
  {
    id: "98765ABC",
    plateNumber: "98765ABC",
    model: "Transit",
    brand: "Ford",
  },
  {
    id: "957H15-CV56",
    plateNumber: "957H15",
    model: "CV56",
    brand: "Audi",
  },
];

// Mock data with school trips that use matching vehicle IDs
const mockTrips: Trip[] = [
  // Today's trips
  {
    id: "trip_today_1",
    title: "Trajet les écoles",
    type: "ecole",
    date: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "08:30",
    status: "prevu",
    description: "Trajet matinal vers les écoles du secteur",
    startLocation: "Quartier Sghir",
    endLocation: "École Amjad",
    stops: [
      {
        id: "stop_1",
        name: "École Jean Jacques",
        address: "Rue des Écoles",
        arrivalTime: "08:10",
        passengers: 3,
        type: "dropoff",
      },
      {
        id: "stop_2",
        name: "École Amjad",
        address: "Avenue de l'Éducation",
        arrivalTime: "08:25",
        passengers: 4,
        type: "dropoff",
      },
    ],
    assignedVehicle: vehicleAssignments[0], // Audi A4
    driverId: "driver_001",
    driverName: "Jean Jacques",
    totalPassengers: 7,
    confirmedPassengers: 7,
    canModify: true,
    canCancel: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "trip_today_2",
    title: "Trajet les écoles",
    type: "ecole",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "09:30",
    status: "prevu",
    description: "Second trajet écoles",
    startLocation: "Lycée Francais",
    endLocation: "École Francais",
    stops: [
      {
        id: "stop_3",
        name: "Lycée Francais",
        address: "Boulevard Principal",
        arrivalTime: "09:10",
        passengers: 2,
        type: "pickup",
      },
    ],
    assignedVehicle: vehicleAssignments[1], // Mercedes-Benz S 580
    driverId: "driver_001",
    driverName: "Jean Jacques",
    totalPassengers: 2,
    confirmedPassengers: 2,
    canModify: true,
    canCancel: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "trip_today_3",
    title: "Trajet les écoles",
    type: "ecole",
    date: new Date().toISOString().split("T")[0],
    startTime: "11:00",
    endTime: "11:30",
    status: "prevu",
    description: "Trajet de mi-journée",
    startLocation: "École Jean Jacques",
    endLocation: "École Amjad",
    stops: [
      {
        id: "stop_4",
        name: "École Jean Jacques",
        address: "Rue des Écoles",
        arrivalTime: "11:05",
        passengers: 3,
        type: "pickup",
      },
      {
        id: "stop_5",
        name: "École Amjad",
        address: "Avenue de l'Éducation",
        arrivalTime: "11:20",
        passengers: 4,
        type: "dropoff",
      },
    ],
    assignedVehicle: vehicleAssignments[2], // Ford Transit
    driverId: "driver_001",
    driverName: "Jean Jacques",
    totalPassengers: 7,
    confirmedPassengers: 7,
    canModify: true,
    canCancel: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "trip_today_4",
    title: "Trajet les écoles",
    type: "ecole",
    date: new Date().toISOString().split("T")[0],
    startTime: "12:00",
    endTime: "12:30",
    status: "prevu",
    description: "Trajet de fin de matinée",
    startLocation: "École Jean Jacques",
    endLocation: "École Francais",
    stops: [
      {
        id: "stop_6",
        name: "École Jean Jacques",
        address: "Rue des Écoles",
        arrivalTime: "12:05",
        passengers: 3,
        type: "pickup",
      },
    ],
    assignedVehicle: vehicleAssignments[3], // Audi CV56
    driverId: "driver_001",
    driverName: "Jean Jacques",
    totalPassengers: 3,
    confirmedPassengers: 3,
    canModify: true,
    canCancel: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "trip_today_5",
    title: "Trajet les écoles",
    type: "ecole",
    date: new Date().toISOString().split("T")[0],
    startTime: "12:00",
    endTime: "12:30",
    status: "prevu",
    description: "Trajet parallèle",
    startLocation: "Lycée Francais",
    endLocation: "École Amjad",
    stops: [
      {
        id: "stop_7",
        name: "Lycée Francais",
        address: "Boulevard Principal",
        arrivalTime: "12:10",
        passengers: 2,
        type: "pickup",
      },
    ],
    assignedVehicle: vehicleAssignments[0], // Audi A4 (reused)
    driverId: "driver_001",
    driverName: "Jean Jacques",
    totalPassengers: 2,
    confirmedPassengers: 2,
    canModify: true,
    canCancel: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Current month trips
  ...currentMonthDates.slice(1, 15).map((date, index) => ({
    id: `trip_current_${index}`,
    title: "Trajet les écoles",
    type: "ecole" as const,
    date,
    startTime: ["08:00", "09:00", "11:00", "12:00", "14:00"][index % 5],
    endTime: ["08:30", "09:30", "11:30", "12:30", "14:30"][index % 5],
    status: ["prevu", "en_cours", "termine"][index % 3] as any,
    description: "Trajet scolaire quotidien",
    startLocation: ["Quartier Sghir", "Lycée Francais", "École Jean Jacques"][
      index % 3
    ],
    endLocation: ["École Amjad", "École Francais", "École Jean Jacques"][
      index % 3
    ],
    stops: [
      {
        id: `stop_${index}_1`,
        name: ["École Jean Jacques", "École Amjad", "Lycée Francais"][
          index % 3
        ],
        address: "Adresse école",
        arrivalTime: "08:15",
        passengers: Math.floor(Math.random() * 5) + 1,
        type: "dropoff" as const,
      },
    ],
    assignedVehicle: vehicleAssignments[index % vehicleAssignments.length],
    driverId: "driver_001",
    driverName: "Jean Jacques",
    totalPassengers: Math.floor(Math.random() * 8) + 1,
    confirmedPassengers: Math.floor(Math.random() * 8) + 1,
    canModify: true,
    canCancel: index % 3 !== 2, // Can't cancel completed trips
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),

  // Next month trips
  ...nextMonthDates.slice(0, 10).map((date, index) => ({
    id: `trip_next_${index}`,
    title: "Trajet les écoles",
    type: "ecole" as const,
    date,
    startTime: ["08:00", "09:00", "11:00", "12:00", "14:00"][index % 5],
    endTime: ["08:30", "09:30", "11:30", "12:30", "14:30"][index % 5],
    status: "prevu" as const,
    description: "Trajet scolaire planifié",
    startLocation: ["Quartier Sghir", "Lycée Francais", "École Jean Jacques"][
      index % 3
    ],
    endLocation: ["École Amjad", "École Francais", "École Jean Jacques"][
      index % 3
    ],
    stops: [
      {
        id: `stop_next_${index}_1`,
        name: ["École Jean Jacques", "École Amjad", "Lycée Francais"][
          index % 3
        ],
        address: "Adresse école",
        arrivalTime: "08:15",
        passengers: Math.floor(Math.random() * 5) + 1,
        type: "dropoff" as const,
      },
    ],
    assignedVehicle: vehicleAssignments[index % vehicleAssignments.length],
    driverId: "driver_001",
    driverName: "Jean Jacques",
    totalPassengers: Math.floor(Math.random() * 8) + 1,
    confirmedPassengers: Math.floor(Math.random() * 8) + 1,
    canModify: true,
    canCancel: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
];

const defaultPreferences: PlanningPreferences = {
  defaultView: "month",
  showWeekNumbers: false,
  startWeekOn: 1, // Monday
  autoRefresh: true,
  reminderMinutes: [15, 30],
};

export const usePlanningStore = create<PlanningStore>((set, get) => ({
  // State
  trips: mockTrips,
  filteredTrips: mockTrips,
  filters: {},
  preferences: defaultPreferences,
  selectedDate: null,
  selectedTrip: null,
  currentView: "month",
  isLoading: false,
  error: null,

  // Actions
  fetchTrips: async (monthYear?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredTrips = applyFiltersToTrips(mockTrips, state.filters);
        return {
          trips: mockTrips,
          filteredTrips,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des trajets",
        isLoading: false,
      });
    }
  },

  fetchTripDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const trip = mockTrips.find((t) => t.id === id);
      if (trip) {
        set({ selectedTrip: trip, isLoading: false });
      } else {
        set({ error: "Trajet non trouvé", isLoading: false });
      }
    } catch (error) {
      set({
        error: "Erreur lors du chargement des détails",
        isLoading: false,
      });
    }
  },

  updateTripStatus: async (id: string, status, notes) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedTrips = state.trips.map((trip) =>
          trip.id === id
            ? {
                ...trip,
                status,
                notes: notes || trip.notes,
                updatedAt: new Date().toISOString(),
              }
            : trip
        );

        const filteredTrips = applyFiltersToTrips(updatedTrips, state.filters);

        return {
          trips: updatedTrips,
          filteredTrips,
          selectedTrip:
            state.selectedTrip?.id === id
              ? updatedTrips.find((t) => t.id === id) || state.selectedTrip
              : state.selectedTrip,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour du statut",
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters: Partial<PlanningFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredTrips = applyFiltersToTrips(state.trips, updatedFilters);

      return {
        filters: updatedFilters,
        filteredTrips,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredTrips = applyFiltersToTrips(state.trips, {});
      return {
        filters: {},
        filteredTrips,
      };
    });
  },

  setCurrentView: (view: "month" | "week" | "day" | "list") => {
    set({ currentView: view });
  },

  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
  },

  selectTrip: (trip: Trip | null) => {
    set({ selectedTrip: trip });
  },

  getFilteredTrips: () => {
    return get().filteredTrips;
  },

  getTripsForDate: (date: string) => {
    return get().filteredTrips.filter((t) => t.date === date);
  },

  getTripsForWeek: (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return get()
      .filteredTrips.filter((trip) => {
        const tripDate = new Date(trip.date);
        return tripDate >= start && tripDate <= end;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      });
  },

  getUpcomingTrips: (limit: number = 10) => {
    const now = new Date();
    const currentDateTime = now.getTime();

    return get()
      .trips.filter((trip) => {
        // Only include scheduled or in-progress trips
        if (trip.status === "termine" || trip.status === "annule") {
          return false;
        }

        // Create datetime from trip date and start time
        const tripDateTime = new Date(
          `${trip.date}T${trip.startTime}`
        ).getTime();

        // Include trips that are upcoming or currently happening
        return tripDateTime >= currentDateTime - 30 * 60 * 1000; // Include trips up to 30 minutes ago
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, limit);
  },

  getTripCounts: () => {
    const trips = get().trips;
    const counts = {
      total: trips.length,
      scheduled: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    };

    trips.forEach((trip) => {
      switch (trip.status) {
        case "prevu":
          counts.scheduled++;
          break;
        case "en_cours":
          counts.inProgress++;
          break;
        case "termine":
          counts.completed++;
          break;
        case "annule":
          counts.cancelled++;
          break;
      }
    });

    return counts;
  },

  clearError: () => {
    set({ error: null });
  },
}));
