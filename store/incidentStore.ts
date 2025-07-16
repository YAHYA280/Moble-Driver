// store/incidentStore.ts - Enhanced version with detailed tracking
import { create } from "zustand";
import {
  Incident,
  IncidentActions,
  IncidentComment,
  IncidentFilters,
  IncidentState,
  IncidentUpdate,
} from "../shared/types/incident";

type IncidentStore = IncidentState & IncidentActions;

// Helper function to apply filters (enhanced)
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

  // Filter by assigned technician
  if (filters.assignedTechnician) {
    filtered = filtered.filter(
      (i) => i.assignedTechnician === filters.assignedTechnician
    );
  }

  // Filter by agent response
  if (filters.hasAgentResponse !== undefined) {
    filtered = filtered.filter((i) => {
      const hasAgentComment =
        i.comments?.some((c) => c.role === "agent") || false;
      return filters.hasAgentResponse ? hasAgentComment : !hasAgentComment;
    });
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (i) =>
        i.description.toLowerCase().includes(query) ||
        i.vehiclePlateNumber.toLowerCase().includes(query) ||
        i.type.toLowerCase().includes(query) ||
        i.reportedBy.toLowerCase().includes(query) ||
        (i.assignedTechnician &&
          i.assignedTechnician.toLowerCase().includes(query))
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

// Enhanced mock data with detailed tracking
const mockIncidents: Incident[] = [
  {
    id: "1",
    vehicleId: "95700L15",
    vehiclePlateNumber: "95700L15",
    type: "Problème tapis roulant",
    description:
      "Problème avec le tapis roulant du véhicule - Le tapis ne se déploie plus correctement et émet des bruits anormaux lors du fonctionnement.",
    priority: "Élevée",
    status: "En Cours",
    reportDate: "14/08/2025",
    reportedBy: "John Doe",
    location: "Garage principal - Box 3",
    assignedTechnician: "Ahmed Mansouri",
    estimatedResolutionDate: "15/08/2025",
    tags: ["mécanique", "urgent", "tapis-roulant"],
    comments: [
      {
        id: "c1",
        author: "John Doe",
        role: "reporter",
        content:
          "Problème avec le tapis roulant du véhicule - Le tapis ne se déploie plus correctement et émet des bruits anormaux lors du fonctionnement.",
        timestamp: "14/08/2025 08:30",
      },
      {
        id: "c2",
        author: "Support VSN",
        role: "support",
        content:
          "Votre signalement a été reçu et transmis à notre équipe technique. Ahmed Mansouri, notre technicien spécialisé, prendra en charge votre véhicule dans les plus brefs délais.",
        timestamp: "14/08/2025 09:15",
        isResponse: true,
      },
    ],
    updates: [
      {
        id: "u1",
        timestamp: "14/08/2025 08:30",
        status: "En Cours",
        comment: "Incident signalé et pris en charge",
        updatedBy: "Système",
        role: "support",
      },
    ],
  },
  {
    id: "2",
    vehicleId: "95700L15",
    vehiclePlateNumber: "95700L15",
    type: "Problème tapis roulant",
    description:
      "Dysfonctionnement du système de tapis roulant - Arrêt complet du mécanisme",
    priority: "Moyenne",
    status: "Résolu",
    reportDate: "14/08/2025",
    resolvedDate: "16/08/2025",
    reportedBy: "John Doe",
    location: "Station de service Nord",
    assignedTechnician: "Ahmed Mansouri",
    actualResolutionTime: 48,
    customerSatisfactionRating: 5,
    tags: ["résolu", "tapis-roulant", "maintenance"],
    comments: [
      {
        id: "c1",
        author: "John Doe",
        role: "reporter",
        content:
          "Dysfonctionnement du système de tapis roulant - Arrêt complet du mécanisme",
        timestamp: "14/08/2025 10:00",
      },
      {
        id: "c2",
        author: "Support VSN",
        role: "support",
        content:
          "Votre signalement a été reçu et transmis à notre équipe technique. Un technicien va examiner le véhicule dans les plus brefs délais.",
        timestamp: "14/08/2025 10:30",
        isResponse: true,
      },
      {
        id: "c3",
        author: "Ahmed Mansouri",
        role: "agent",
        content:
          "J'ai inspecté le véhicule. Le problème venait d'un fusible grillé dans le circuit électrique du tapis roulant. J'ai remplacé le fusible défectueux et vérifié l'ensemble du circuit. Le système fonctionne maintenant parfaitement.",
        timestamp: "16/08/2025 14:30",
        isResponse: true,
      },
      {
        id: "c4",
        author: "Support VSN",
        role: "support",
        content:
          "L'intervention a été effectuée avec succès. Le véhicule est de nouveau opérationnel. Merci pour votre signalement qui nous aide à maintenir la qualité de notre service.",
        timestamp: "16/08/2025 15:00",
        isResponse: true,
      },
    ],
    updates: [
      {
        id: "u1",
        timestamp: "14/08/2025 10:00",
        status: "En Cours",
        comment: "Incident signalé",
        updatedBy: "Système",
        role: "support",
      },
      {
        id: "u2",
        timestamp: "16/08/2025 15:00",
        status: "Résolu",
        comment: "Problème résolu - Fusible remplacé",
        updatedBy: "Ahmed Mansouri",
        role: "agent",
      },
    ],
  },
  {
    id: "3",
    vehicleId: "SN-UX420-77V1",
    vehiclePlateNumber: "SN-UX420-77V1",
    type: "Problème tapis roulant",
    description:
      "Problème de fonctionnement du tapis roulant - Déploiement partiel uniquement",
    priority: "Faible",
    status: "En attente",
    reportDate: "14/08/2025",
    reportedBy: "Jane Smith",
    location: "Parking central",
    tags: ["en-attente", "tapis-roulant"],
    comments: [
      {
        id: "c1",
        author: "Jane Smith",
        role: "reporter",
        content:
          "Problème de fonctionnement du tapis roulant - Déploiement partiel uniquement. Le tapis se déploie à moitié puis s'arrête.",
        timestamp: "14/08/2025 16:45",
      },
    ],
    updates: [
      {
        id: "u1",
        timestamp: "14/08/2025 16:45",
        status: "En attente",
        comment: "Incident en attente d'attribution à un technicien",
        updatedBy: "Système",
        role: "support",
      },
    ],
  },
  // Additional incidents with various statuses...
  {
    id: "4",
    vehicleId: "98765ABC",
    vehiclePlateNumber: "98765ABC",
    type: "Problème mécanique",
    description: "Problème de moteur - Bruits anormaux et perte de puissance",
    priority: "Élevée",
    status: "Résolu",
    reportDate: "12/08/2025",
    resolvedDate: "15/08/2025",
    reportedBy: "Mike Johnson",
    location: "Route A1",
    assignedTechnician: "Youssef Benali",
    actualResolutionTime: 72,
    customerSatisfactionRating: 4,
    tags: ["résolu", "moteur", "urgent"],
    comments: [
      {
        id: "c1",
        author: "Mike Johnson",
        role: "reporter",
        content:
          "Problème de moteur - Bruits anormaux et perte de puissance durant le trajet",
        timestamp: "12/08/2025 14:20",
      },
      {
        id: "c2",
        author: "Support VSN",
        role: "support",
        content:
          "Signalement urgent reçu. Youssef Benali a été dépêché immédiatement sur site.",
        timestamp: "12/08/2025 14:30",
        isResponse: true,
      },
      {
        id: "c3",
        author: "Youssef Benali",
        role: "agent",
        content:
          "Intervention d'urgence effectuée. Problème identifié : courroie de distribution défaillante. Remplacement effectué et tests complets réalisés. Véhicule opérationnel.",
        timestamp: "15/08/2025 16:45",
        isResponse: true,
      },
    ],
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

  fetchIncidentDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call for specific incident details
      await new Promise((resolve) => setTimeout(resolve, 500));
      const incident = mockIncidents.find((i) => i.id === id);
      if (incident) {
        set({ selectedIncident: incident, isLoading: false });
      } else {
        set({ error: "Incident non trouvé", isLoading: false });
      }
    } catch (error) {
      set({
        error: "Erreur lors du chargement des détails de l'incident",
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
        tags: ["nouveau"],
        comments: [
          {
            id: "c1",
            author: "John Doe",
            role: "reporter",
            content: incidentData.description,
            timestamp: new Date().toLocaleString("fr-FR"),
          },
        ],
        updates: [
          {
            id: "u1",
            timestamp: new Date().toLocaleString("fr-FR"),
            status: incidentData.status,
            comment: "Incident signalé",
            updatedBy: "Système",
            role: "support",
          },
        ],
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

  updateIncidentStatus: async (incidentId: string, status, comment) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedIncidents = state.incidents.map((incident) => {
          if (incident.id === incidentId) {
            const updatedIncident = {
              ...incident,
              status,
              resolvedDate:
                status === "Résolu"
                  ? new Date().toLocaleDateString("fr-FR")
                  : incident.resolvedDate,
            };

            // Add update to history
            const newUpdate: IncidentUpdate = {
              id: `u_${Date.now()}`,
              timestamp: new Date().toLocaleString("fr-FR"),
              status,
              comment: comment || `Statut mis à jour vers: ${status}`,
              updatedBy: "Support VSN",
              role: "support",
            };

            updatedIncident.updates = [...(incident.updates || []), newUpdate];

            // Add comment if provided
            if (comment) {
              const newComment: IncidentComment = {
                id: `c_${Date.now()}`,
                author: "Support VSN",
                role: "support",
                content: comment,
                timestamp: new Date().toLocaleString("fr-FR"),
                isResponse: true,
              };
              updatedIncident.comments = [
                ...(incident.comments || []),
                newComment,
              ];
            }

            return updatedIncident;
          }
          return incident;
        });

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
        error: "Erreur lors de la mise à jour du statut",
        isLoading: false,
      });
    }
  },

  addComment: async (incidentId: string, comment: string, role) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const updatedIncidents = state.incidents.map((incident) => {
          if (incident.id === incidentId) {
            const newComment: IncidentComment = {
              id: `c_${Date.now()}`,
              author: role === "agent" ? "Technicien Support" : "Support VSN",
              role,
              content: comment,
              timestamp: new Date().toLocaleString("fr-FR"),
              isResponse: true,
            };

            return {
              ...incident,
              comments: [...(incident.comments || []), newComment],
            };
          }
          return incident;
        });

        const filteredIncidents = applyFiltersToIncidents(
          updatedIncidents,
          state.filters
        );

        // Update selected incident if it's the one being modified
        const selectedIncident =
          state.selectedIncident?.id === incidentId
            ? updatedIncidents.find((i) => i.id === incidentId) ||
              state.selectedIncident
            : state.selectedIncident;

        return {
          incidents: updatedIncidents,
          filteredIncidents,
          selectedIncident,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de l'ajout du commentaire",
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
