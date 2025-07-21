export type IncidentStatus = "En Cours" | "Résolu" | "En attente";
export type IncidentPriority = "Faible" | "Moyenne" | "Élevée";
export type IncidentType =
  | "Problème tapis roulant"
  | "Problème mécanique"
  | "Problème électrique"
  | "Autre";

export interface IncidentComment {
  id: string;
  author: string;
  role: "reporter" | "support" | "agent";
  content: string;
  timestamp: string;
  isResponse?: boolean;
}

export interface IncidentUpdate {
  id: string;
  timestamp: string;
  status: IncidentStatus;
  comment?: string;
  updatedBy: string;
  role: "support" | "agent";
}

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

  comments?: IncidentComment[];
  updates?: IncidentUpdate[];
  assignedTechnician?: string;
  estimatedResolutionDate?: string;
  actualResolutionTime?: number;
  customerSatisfactionRating?: number;
  internalNotes?: string;
  tags?: string[];
  relatedIncidents?: string[];
}

export interface IncidentFilters {
  status?: IncidentStatus;
  priority?: IncidentPriority;
  type?: IncidentType;
  vehicleId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
  assignedTechnician?: string;
  hasAgentResponse?: boolean;
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
  fetchIncidentDetails: (id: string) => Promise<void>;
  reportIncident: (
    incident: Omit<Incident, "id" | "reportDate" | "reportedBy">
  ) => Promise<void>;
  updateIncidentStatus: (
    incidentId: string,
    status: IncidentStatus,
    comment?: string
  ) => Promise<void>;
  addComment: (
    incidentId: string,
    comment: string,
    role: IncidentComment["role"]
  ) => Promise<void>;
  setFilters: (filters: Partial<IncidentFilters>) => void;
  clearFilters: () => void;
  selectIncident: (incident: Incident | null) => void;
  getFilteredIncidents: () => Incident[];
  clearError: () => void;
}
