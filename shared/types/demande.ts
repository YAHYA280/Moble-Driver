export type DemandeStatus = "pending" | "accepted" | "refused";

export type DemandeType = "conge" | "maladie" | "absence" | "autre";

export interface Demande {
  id: string;
  type: DemandeType;
  status: DemandeStatus;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  requestDate: string;
  processedDate?: string;
  employeeComment?: string;
  managerComment?: string;
  attachments: DemandeAttachment[];
  isUrgent?: boolean;
}

export interface DemandeAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  mimeType: string;
}

export interface CreateDemandeData {
  type: DemandeType;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  employeeComment?: string;
  attachments?: File[];
  isUrgent?: boolean;
}

// UPDATED: Added isUrgent filter
export interface DemandeFilters {
  status?: DemandeStatus[];
  type?: DemandeType[];
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
  isUrgent?: boolean; // NEW: Filter for urgent demandes only
}

export interface DemandeState {
  demandes: Demande[];
  filteredDemandes: Demande[];
  selectedDemande: Demande | null;
  filters: DemandeFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export interface DemandeActions {
  fetchDemandes: () => Promise<void>;
  createDemande: (data: CreateDemandeData) => Promise<Demande>;
  updateDemande: (id: string, updates: Partial<Demande>) => Promise<void>;
  deleteDemande: (id: string) => Promise<void>;
  selectDemande: (demande: Demande | null) => void;
  setFilters: (filters: Partial<DemandeFilters>) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const DEMANDE_TYPES = {
  conge: {
    label: "Congé payé",
    icon: "calendar",
    color: "#22c55e",
    requiresJustification: false,
  },
  maladie: {
    label: "Arrêt maladie",
    icon: "heartbeat",
    color: "#ef4444",
    requiresJustification: true,
  },
  absence: {
    label: "Absence exceptionnelle",
    icon: "clock-o",
    color: "#f59e0b",
    requiresJustification: true,
  },
  autre: {
    label: "Autre demande",
    icon: "file-text",
    color: "#8b5cf6",
    requiresJustification: false,
  },
} as const;

export const DEMANDE_STATUS = {
  pending: {
    label: "En attente",
    color: "#f59e0b",
    icon: "clock-o",
  },
  accepted: {
    label: "Accepté",
    color: "#22c55e",
    icon: "check-circle",
  },
  refused: {
    label: "Refusé",
    color: "#ef4444",
    icon: "times-circle",
  },
} as const;
