// store/incidentStore.ts
import { create } from "zustand";
import {
  Incident,
  IncidentActions,
  IncidentFilters,
  IncidentState,
} from "../shared/types/incident";

type IncidentStore = IncidentState & IncidentActions;

// Helper function to apply filters
const applyFiltersToIncidents = (
  incidents: Incident[],
  filters: IncidentFilters
) => {
  let filtered = [...incidents];

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter((i) => i.status === filters.status);
  }

  // Filter by priority
  if (filters.priority) {
    filtered = filtered.filter((i) => i.priority === filters.priority);
  }

  // Filter by type
  if (filters.type) {
    filtered = filtered.filter((i) => i.type === filters.type);
  }

  // Filter by vehicle
  if (filters.vehicleId) {
    filtered = filtered.filter((i) => i.vehicleId === filters.vehicleId);
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (i) =>
        i.description.toLowerCase().includes(query) ||
        i.vehiclePlateNumber.toLowerCase().includes(query) ||
        i.type.toLowerCase().includes(query)
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter(
      (i) => new Date(i.reportDate) >= filters.dateFrom!
    );
  }

  if (filters.dateTo) {
    filtered = filtered.filter(
      (i) => new Date(i.reportDate) <= filters.dateTo!
    );
  }

  // Sort by date (newest first)
  return filtered.sort(
    (a, b) =>
      new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
  );
};

// Mock data based on the incident history image
const mockIncidents: Incident[] = [
  {
    id: "1",
    vehicleId: "95700L15",
    vehiclePlateNumber: "95700L15",
    type: "Problème tapis roulant",
    description: "Problème avec le tapis roulant du véhicule",
    priority: "Élevée",
    status: "En Cours",
    reportDate: "14/08/2025",
    reportedBy: "John Doe",
    location: "Garage principal",
  },
  {
    id: "2",
    vehicleId: "95700L15",
    vehiclePlateNumber: "95700L15",
    type: "Problème tapis roulant",
    description: "Dysfonctionnement du système de tapis roulant",
    priority: "Moyenne",
    status: "Résolu",
    reportDate: "14/08/2025",
    resolvedDate: "16/08/2025",
    reportedBy: "John Doe",
    location: "Station de service",
  },
  {
    id: "3",
    vehicleId: "SN-UX420-77V1",
    vehiclePlateNumber: "SN-UX420-77V1",
    type: "Problème tapis roulant",
    description: "Problème de fonctionnement du tapis roulant",
    priority: "Faible",
    status: "En Cours",
    reportDate: "14/08/2025",
    reportedBy: "Jane Smith",
  },
  {
    id: "4",
    vehicleId: "98765ABC",
    vehiclePlateNumber: "98765ABC",
    type: "Problème tapis roulant",
    description: "Tapis roulant bloqué",
    priority: "Moyenne",
    status: "Résolu",
    reportDate: "14/08/2025",
    resolvedDate: "15/08/2025",
    reportedBy: "Mike Johnson",
  },
  {
    id: "5",
    vehicleId: "957H15",
    vehiclePlateNumber: "957H15",
    type: "Problème tapis roulant",
    description: "Maintenance requise pour le tapis roulant",
    priority: "Faible",
    status: "En Cours",
    reportDate: "14/08/2025",
    reportedBy: "Sarah Wilson",
  },
  {
    id: "6",
    vehicleId: "95700L15",
    vehiclePlateNumber: "95700L15",
    type: "Problème tapis roulant",
    description: "Entretien préventif du tapis roulant",
    priority: "Moyenne",
    status: "Résolu",
    reportDate: "14/08/2025",
    resolvedDate: "17/08/2025",
    reportedBy: "John Doe",
  },
];

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  // State
  incidents: mockIncidents,
  filteredIncidents: mockIncidents,
  filters: {},
  isLoading: false,
  error: null,
  selectedIncident: null,

  // Actions
  fetchIncidents: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredIncidents = applyFiltersToIncidents(
          mockIncidents,
          state.filters
        );
        return {
          incidents: mockIncidents,
          filteredIncidents,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des incidents",
        isLoading: false,
      });
    }
  },

  reportIncident: async (incidentData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newIncident: Incident = {
        ...incidentData,
        id: `incident_${Date.now()}`,
        reportDate: new Date().toLocaleDateString("fr-FR"),
        reportedBy: "John Doe", // In real app, get from auth context
      };

      set((state) => {
        const updatedIncidents = [...state.incidents, newIncident];
        const filteredIncidents = applyFiltersToIncidents(
          updatedIncidents,
          state.filters
        );
        return {
          incidents: updatedIncidents,
          filteredIncidents,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la création de l'incident",
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters: Partial<IncidentFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredIncidents = applyFiltersToIncidents(
        state.incidents,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredIncidents,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredIncidents = applyFiltersToIncidents(state.incidents, {});
      return {
        filters: {},
        filteredIncidents,
      };
    });
  },

  selectIncident: (incident: Incident | null) => {
    set({ selectedIncident: incident });
  },

  getFilteredIncidents: () => {
    return get().filteredIncidents;
  },

  clearError: () => {
    set({ error: null });
  },
}));
