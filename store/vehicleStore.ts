import { create } from "zustand";
import {
  Vehicle,
  VehicleActions,
  VehicleFilters,
  VehicleState,
} from "../shared/types/vehicle";

type VehicleStore = VehicleState & VehicleActions;

// Helper function to apply filters
const applyFiltersToVehicles = (
  vehicles: Vehicle[],
  filters: VehicleFilters
) => {
  let filtered = [...vehicles];

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter((v) => v.status === filters.status);
  }

  // Filter by brand
  if (filters.brand) {
    filtered = filtered.filter((v) => v.brand === filters.brand);
  }

  // Filter by year
  if (filters.year) {
    filtered = filtered.filter((v) => v.year === filters.year);
  }

  // Filter by fuel type
  if (filters.fuelType) {
    filtered = filtered.filter((v) => v.fuelType === filters.fuelType);
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (v) =>
        v.plateNumber.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.brand.toLowerCase().includes(query)
    );
  }

  return filtered;
};

// Mock data based on the screenshots
const mockVehicles: Vehicle[] = [
  {
    id: "95700L15",
    plateNumber: "95700L15",
    model: "A4",
    brand: "Audi",
    year: 2020,
    status: "En service",
    lastMaintenanceDate: "14/08/2025",
    nextMaintenanceDate: "18/12/2024",
    mileage: 45000,
    fuelType: "Diesel",
    capacity: 5,
    assignedDriver: "John Doe",
    registrationDate: "15/03/2020",
    insuranceExpiryDate: "15/03/2025",
    technicalControlDate: "18/06/2024",
    maintenanceHistory: [
      {
        id: "1",
        type: "Entretien technique",
        date: "14/08/2025",
        description: "Entretien technique complet",
      },
      {
        id: "2",
        type: "Entretien technique",
        date: "14/08/2025",
        description: "Vérification des freins et vidange",
      },
      {
        id: "3",
        type: "Entretien technique",
        date: "14/08/2025",
        description: "Contrôle technique annuel",
      },
      {
        id: "4",
        type: "Entretien technique",
        date: "14/08/2025",
        description: "Changement des pneus",
      },
      {
        id: "5",
        type: "Entretien technique",
        date: "14/08/2025",
        description: "Révision générale",
      },
    ],
  },
  {
    id: "SN-UX420-77V1",
    plateNumber: "SN-UX420-77V1",
    model: "S 580 e 4MATIC Long",
    brand: "Mercedes-Benz",
    year: 2023,
    status: "En maintenance",
    lastMaintenanceDate: "14/08/2025",
    nextMaintenanceDate: "20/01/2025",
    mileage: 25000,
    fuelType: "Hybride",
    capacity: 5,
    assignedDriver: "Jane Smith",
    registrationDate: "10/05/2023",
    insuranceExpiryDate: "10/05/2026",
    technicalControlDate: "20/07/2025",
    maintenanceHistory: [
      {
        id: "1",
        type: "Entretien technique",
        date: "14/08/2025",
        description: "Maintenance préventive",
      },
      {
        id: "2",
        type: "Entretien technique",
        date: "14/08/2025",
        description: "Mise à jour logiciel hybride",
      },
    ],
  },
  {
    id: "98765ABC",
    plateNumber: "98765ABC",
    model: "Transit",
    brand: "Ford",
    year: 2019,
    status: "En service",
    lastMaintenanceDate: "14/08/2025",
    nextMaintenanceDate: "05/02/2025",
    mileage: 78000,
    fuelType: "Diesel",
    capacity: 8,
    registrationDate: "20/06/2019",
    insuranceExpiryDate: "20/06/2025",
    technicalControlDate: "05/08/2025",
    maintenanceHistory: [
      {
        id: "1",
        type: "Réparation",
        date: "14/08/2025",
        description: "Réparation moteur",
        cost: 2500,
      },
    ],
  },
  {
    id: "957H15-CV56",
    plateNumber: "957H15",
    model: "CV56",
    brand: "Audi",
    year: 2021,
    status: "En maintenance",
    lastMaintenanceDate: "14/08/2025",
    nextMaintenanceDate: "15/03/2025",
    mileage: 35000,
    fuelType: "Essence",
    capacity: 5,
    registrationDate: "10/01/2021",
    insuranceExpiryDate: "10/01/2026",
    technicalControlDate: "10/01/2025",
    maintenanceHistory: [
      {
        id: "1",
        type: "Entretien technique",
        date: "14/08/2025",
        description: "Entretien standard",
      },
    ],
  },
];

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  // State
  vehicles: mockVehicles,
  filteredVehicles: mockVehicles,
  filters: {},
  isLoading: false,
  error: null,
  selectedVehicle: null,

  // Actions
  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredVehicles = applyFiltersToVehicles(
          mockVehicles,
          state.filters
        );
        return {
          vehicles: mockVehicles,
          filteredVehicles,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des véhicules",
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters: Partial<VehicleFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredVehicles = applyFiltersToVehicles(
        state.vehicles,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredVehicles,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredVehicles = applyFiltersToVehicles(state.vehicles, {});
      return {
        filters: {},
        filteredVehicles,
      };
    });
  },

  selectVehicle: (vehicle: Vehicle | null) => {
    set({ selectedVehicle: vehicle });
  },

  getFilteredVehicles: () => {
    return get().filteredVehicles;
  },

  clearError: () => {
    set({ error: null });
  },
}));
