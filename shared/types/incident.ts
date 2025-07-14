export type IncidentStatus = "En Cours" | "Résolu" | "En attente";
export type IncidentPriority = "Faible" | "Moyenne" | "Élevée";
export type IncidentType =
  | "Problème tapis roulant"
  | "Problème mécanique"
  | "Problème électrique"
  | "Autre";

export interface Incident {
  id: string;
  vehicleId: string;
  vehiclePlateNumber: string;
  type: IncidentType;
  description: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  reportDate: string;
  resolvedDate?: string;
  reportedBy: string;
  location?: string;
  photos?: string[];
  videos?: string[];
}

export interface IncidentFilters {
  status?: IncidentStatus;
  priority?: IncidentPriority;
  type?: IncidentType;
  vehicleId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface IncidentState {
  incidents: Incident[];
  filteredIncidents: Incident[];
  filters: IncidentFilters;
  isLoading: boolean;
  error: string | null;
  selectedIncident: Incident | null;
}

export interface IncidentActions {
  fetchIncidents: () => Promise<void>;
  reportIncident: (
    incident: Omit<Incident, "id" | "reportDate" | "reportedBy">
  ) => Promise<void>;
  setFilters: (filters: Partial<IncidentFilters>) => void;
  clearFilters: () => void;
  selectIncident: (incident: Incident | null) => void;
  getFilteredIncidents: () => Incident[];
  clearError: () => void;
}
