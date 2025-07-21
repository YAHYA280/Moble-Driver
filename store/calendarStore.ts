// store/calendarStore.ts
import { create } from "zustand";
import {
  Appointment,
  CalendarActions,
  CalendarFilters,
  CalendarPreferences,
  CalendarState,
} from "../shared/types/calendar";

type CalendarStore = CalendarState & CalendarActions;

// Helper function to apply filters
const applyFiltersToAppointments = (
  appointments: Appointment[],
  filters: CalendarFilters
) => {
  let filtered = [...appointments];

  // Filter by types
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter((a) => filters.types!.includes(a.type));
  }

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((a) => filters.status!.includes(a.status));
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query) ||
        a.center?.name.toLowerCase().includes(query) ||
        a.contact?.name.toLowerCase().includes(query)
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter((a) => new Date(a.date) >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    filtered = filtered.filter((a) => new Date(a.date) <= filters.dateTo!);
  }

  // Sort by date and time
  return filtered.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });
};

// Mock data based on the images
const mockAppointments: Appointment[] = [
  {
    id: "1",
    title: "Formation",
    type: "formation",
    date: "2025-04-24",
    startTime: "08:30",
    endTime: "09:00",
    status: "prevu",
    location: "Centre VSN",
    description: "Formation obligatoire pour conducteurs",
    center: {
      id: "center_1",
      name: "Centre de Formation VSN",
      address: "123 Avenue Mohammed V, Casablanca",
      phone: "+212 522 123456",
    },
    contact: {
      id: "contact_1",
      name: "Sophie Sophie",
      role: "Formatrice",
      phone: "+212 661 123456",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2025-04-20T10:00:00",
    updatedAt: "2025-04-20T10:00:00",
    convocationUrl: "https://vsn.com/convocation/formation-1",
  },
  {
    id: "2",
    title: "Visite médicale",
    type: "visite-medicale",
    date: "2025-04-24",
    startTime: "08:30",
    endTime: "09:00",
    status: "prevu",
    location: "VSN",
    description: "Visite médicale périodique obligatoire",
    center: {
      id: "center_2",
      name: "Centre Médical VSN",
      address: "456 Rue Hassan II, Casablanca",
      phone: "+212 522 654321",
    },
    contact: {
      id: "contact_2",
      name: "Dr. Ahmed Benali",
      role: "Médecin du travail",
      phone: "+212 661 654321",
    },
    isConfirmed: false,
    canModify: false,
    canCancel: false,
    reminderSent: false,
    createdAt: "2025-04-20T11:00:00",
    updatedAt: "2025-04-20T11:00:00",
    convocationUrl: "https://vsn.com/convocation/medical-2",
  },
  {
    id: "3",
    title: "Entretien RH",
    type: "entretien-rh",
    date: "2025-04-24",
    startTime: "08:30",
    endTime: "09:00",
    status: "prevu",
    location: "VSN",
    description: "Entretien annuel d'évaluation",
    center: {
      id: "center_3",
      name: "Siège Social VSN",
      address: "789 Boulevard Zerktouni, Casablanca",
      phone: "+212 522 987654",
    },
    contact: {
      id: "contact_3",
      name: "Sarah Alami",
      role: "Responsable RH",
      phone: "+212 661 987654",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2025-04-20T12:00:00",
    updatedAt: "2025-04-20T12:00:00",
    convocationUrl: "https://vsn.com/convocation/rh-3",
  },
  // Additional appointments for different dates
  {
    id: "4",
    title: "Formation Sécurité",
    type: "formation",
    date: "2025-04-25",
    startTime: "09:00",
    endTime: "12:00",
    status: "confirme",
    location: "Centre de Formation Nord",
    description: "Formation sur les nouvelles règles de sécurité routière",
    center: {
      id: "center_1",
      name: "Centre de Formation VSN",
      address: "123 Avenue Mohammed V, Casablanca",
      phone: "+212 522 123456",
    },
    contact: {
      id: "contact_4",
      name: "Mohammed Tazi",
      role: "Formateur Sécurité",
      phone: "+212 661 789012",
    },
    isConfirmed: true,
    canModify: false,
    canCancel: false,
    reminderSent: true,
    createdAt: "2025-04-18T14:00:00",
    updatedAt: "2025-04-22T16:00:00",
  },
  {
    id: "5",
    title: "Maintenance Véhicule",
    type: "maintenance",
    date: "2025-04-26",
    startTime: "14:00",
    endTime: "16:00",
    status: "prevu",
    location: "Garage Central",
    description: "Révision périodique du véhicule 95700L15",
    center: {
      id: "center_4",
      name: "Garage VSN Central",
      address: "321 Rue des Artisans, Casablanca",
      phone: "+212 522 456789",
    },
    contact: {
      id: "contact_5",
      name: "Hassan Mechanic",
      role: "Chef d'atelier",
      phone: "+212 661 456789",
    },
    isConfirmed: false,
    canModify: true,
    canCancel: true,
    reminderSent: false,
    createdAt: "2025-04-21T09:00:00",
    updatedAt: "2025-04-21T09:00:00",
  },
];

const defaultPreferences: CalendarPreferences = {
  defaultView: "month",
  startWeekOn: 1, // Monday
  showWeekNumbers: false,
  reminderMinutes: [15, 30, 60],
};

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  // State
  appointments: mockAppointments,
  filteredAppointments: mockAppointments,
  filters: {},
  preferences: defaultPreferences,
  selectedDate: null,
  selectedAppointment: null,
  currentView: "month",
  isLoading: false,
  error: null,

  // Actions
  fetchAppointments: async (monthYear?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredAppointments = applyFiltersToAppointments(
          mockAppointments,
          state.filters
        );
        return {
          appointments: mockAppointments,
          filteredAppointments,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des rendez-vous",
        isLoading: false,
      });
    }
  },

  fetchAppointmentDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const appointment = mockAppointments.find((a) => a.id === id);
      if (appointment) {
        set({ selectedAppointment: appointment, isLoading: false });
      } else {
        set({ error: "Rendez-vous non trouvé", isLoading: false });
      }
    } catch (error) {
      set({
        error: "Erreur lors du chargement des détails",
        isLoading: false,
      });
    }
  },

  confirmAppointment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedAppointments = state.appointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "confirme" as const,
                isConfirmed: true,
                updatedAt: new Date().toISOString(),
              }
            : appointment
        );

        const filteredAppointments = applyFiltersToAppointments(
          updatedAppointments,
          state.filters
        );

        return {
          appointments: updatedAppointments,
          filteredAppointments,
          selectedAppointment:
            state.selectedAppointment?.id === id
              ? updatedAppointments.find((a) => a.id === id) ||
                state.selectedAppointment
              : state.selectedAppointment,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la confirmation",
        isLoading: false,
      });
    }
  },

  requestReschedule: async (id: string, reason: string, preferredDates?) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      set((state) => {
        const updatedAppointments = state.appointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "reporte" as const,
                notes: `Demande de report: ${reason}`,
                updatedAt: new Date().toISOString(),
              }
            : appointment
        );

        const filteredAppointments = applyFiltersToAppointments(
          updatedAppointments,
          state.filters
        );

        return {
          appointments: updatedAppointments,
          filteredAppointments,
          selectedAppointment:
            state.selectedAppointment?.id === id
              ? updatedAppointments.find((a) => a.id === id) ||
                state.selectedAppointment
              : state.selectedAppointment,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la demande de report",
        isLoading: false,
      });
    }
  },

  cancelAppointment: async (id: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedAppointments = state.appointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "annule" as const,
                notes: `Annulé: ${reason}`,
                updatedAt: new Date().toISOString(),
              }
            : appointment
        );

        const filteredAppointments = applyFiltersToAppointments(
          updatedAppointments,
          state.filters
        );

        return {
          appointments: updatedAppointments,
          filteredAppointments,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de l'annulation",
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters: Partial<CalendarFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredAppointments = applyFiltersToAppointments(
        state.appointments,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredAppointments,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredAppointments = applyFiltersToAppointments(
        state.appointments,
        {}
      );
      return {
        filters: {},
        filteredAppointments,
      };
    });
  },

  setCurrentView: (view: "month" | "list") => {
    set({ currentView: view });
  },

  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
  },

  selectAppointment: (appointment: Appointment | null) => {
    set({ selectedAppointment: appointment });
  },

  updatePreferences: (newPreferences: Partial<CalendarPreferences>) => {
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences },
    }));
  },

  getFilteredAppointments: () => {
    return get().filteredAppointments;
  },

  getAppointmentsForDate: (date: string) => {
    return get().filteredAppointments.filter((a) => a.date === date);
  },

  getAppointmentCounts: () => {
    const appointments = get().appointments;
    const counts = {
      total: appointments.length,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
    };

    appointments.forEach((appointment) => {
      switch (appointment.status) {
        case "confirme":
          counts.confirmed++;
          break;
        case "prevu":
          counts.pending++;
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
