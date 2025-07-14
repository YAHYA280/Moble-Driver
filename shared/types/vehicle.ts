export type VehicleStatus = "En service" | "En maintenance" | "Hors service";
export type MaintenanceType = "Entretien technique" | "Réparation" | "Contrôle";

export interface MaintenanceRecord {
  id: string;
  type: MaintenanceType;
  date: string;
  description: string;
  cost?: number;
  location?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  brand: string;
  year: number;
  status: VehicleStatus;
  imageUrl?: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  mileage: number;
  fuelType: "Essence" | "Diesel" | "Électrique" | "Hybride";
  capacity: number; // Number of passengers
  maintenanceHistory: MaintenanceRecord[];
  assignedDriver?: string;
  registrationDate: string;
  insuranceExpiryDate: string;
  technicalControlDate: string;
}

export interface VehicleFilters {
  status?: VehicleStatus;
  brand?: string;
  year?: number;
  fuelType?: string;
  searchQuery?: string;
}

export interface VehicleState {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  filters: VehicleFilters;
  isLoading: boolean;
  error: string | null;
  selectedVehicle: Vehicle | null;
}

export interface VehicleActions {
  fetchVehicles: () => Promise<void>;
  setFilters: (filters: Partial<VehicleFilters>) => void;
  clearFilters: () => void;
  selectVehicle: (vehicle: Vehicle | null) => void;
  getFilteredVehicles: () => Vehicle[];
  clearError: () => void;
}
