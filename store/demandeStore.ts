import { create } from "zustand";
import {
  Demande,
  DemandeActions,
  DemandeAttachment,
  DemandeFilters,
  DemandeState,
} from "../shared/types/demande";

type DemandeStore = DemandeState & DemandeActions;

const applyFilters = (
  demandes: Demande[],
  filters: DemandeFilters
): Demande[] => {
  let filtered = [...demandes];

  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((demande) =>
      filters.status!.includes(demande.status)
    );
  }

  if (filters.type && filters.type.length > 0) {
    filtered = filtered.filter((demande) =>
      filters.type!.includes(demande.type)
    );
  }

  if (filters.dateFrom) {
    filtered = filtered.filter(
      (demande) => new Date(demande.startDate) >= filters.dateFrom!
    );
  }

  if (filters.dateTo) {
    filtered = filtered.filter(
      (demande) => new Date(demande.endDate) <= filters.dateTo!
    );
  }

  if (filters.isUrgent) {
    filtered = filtered.filter((demande) => demande.isUrgent === true);
  }

  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (demande) =>
        demande.title.toLowerCase().includes(query) ||
        demande.description?.toLowerCase().includes(query) ||
        demande.employeeComment?.toLowerCase().includes(query)
    );
  }

  return filtered;
};

const generateMockDemandes = (): Demande[] => {
  const baseDate = new Date();

  return [
    {
      id: "demande_1",
      type: "conge",
      status: "refused",
      title: "Demande de congé",
      description: "Congé pour raisons personnelles",
      startDate: new Date(
        baseDate.getTime() + 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(
        baseDate.getTime() + 20 * 24 * 60 * 60 * 1000
      ).toISOString(),
      requestDate: new Date(
        baseDate.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      processedDate: new Date(
        baseDate.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      employeeComment:
        "Je prends quelques jours pour des raisons personnelles. Merci de votre compréhension",
      managerComment: "Demande refusée car période trop chargée",
      attachments: [
        {
          id: "att_1",
          name: "Demande de congé.pdf",
          type: "application/pdf",
          size: 3.2 * 1024 * 1024,
          url: "/demandes/conge.pdf",
          mimeType: "application/pdf",
        },
      ],
      isUrgent: false,
    },
    {
      id: "demande_2",
      type: "conge",
      status: "accepted",
      title: "Demande de congé",
      description: "Congé annuel planifié",
      startDate: new Date(
        baseDate.getTime() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(
        baseDate.getTime() + 35 * 24 * 60 * 60 * 1000
      ).toISOString(),
      requestDate: new Date(
        baseDate.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      processedDate: new Date(
        baseDate.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      employeeComment: "Congé annuel planifié depuis longtemps",
      managerComment: "Demande approuvée",
      attachments: [],
      isUrgent: false,
    },
    {
      id: "demande_3",
      type: "conge",
      status: "refused",
      title: "Demande de congé",
      description: "Congé de dernière minute",
      startDate: new Date(
        baseDate.getTime() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(
        baseDate.getTime() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      requestDate: new Date(
        baseDate.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      employeeComment: "Demande urgente pour raisons familiales",
      attachments: [],
      isUrgent: true, // URGENT DEMANDE
    },
    {
      id: "demande_4",
      type: "conge",
      status: "accepted",
      title: "Demande de congé",
      description: "Congé pour voyage",
      startDate: new Date(
        baseDate.getTime() + 45 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(
        baseDate.getTime() + 50 * 24 * 60 * 60 * 1000
      ).toISOString(),
      requestDate: new Date(
        baseDate.getTime() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      processedDate: new Date(
        baseDate.getTime() - 12 * 24 * 60 * 60 * 1000
      ).toISOString(),
      employeeComment: "Voyage prévu depuis longtemps",
      managerComment: "Accordé",
      attachments: [],
      isUrgent: false,
    },
    {
      id: "demande_5",
      type: "maladie",
      status: "pending",
      title: "Arrêt maladie",
      description: "Arrêt maladie urgent",
      startDate: new Date(
        baseDate.getTime() + 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(
        baseDate.getTime() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      requestDate: new Date().toISOString(),
      employeeComment: "Arrêt maladie suite à accident",
      attachments: [],
      isUrgent: true, // URGENT DEMANDE
    },
    {
      id: "demande_6",
      type: "conge",
      status: "pending",
      title: "Demande de congé",
      description: "En cours de traitement",
      startDate: new Date(
        baseDate.getTime() + 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(
        baseDate.getTime() + 28 * 24 * 60 * 60 * 1000
      ).toISOString(),
      requestDate: new Date(
        baseDate.getTime() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      employeeComment: "Demande en attente de validation",
      attachments: [],
      isUrgent: false,
    },
    {
      id: "demande_7",
      type: "absence",
      status: "accepted",
      title: "Absence exceptionnelle",
      description: "Absence pour raisons familiales",
      startDate: new Date(
        baseDate.getTime() + 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(
        baseDate.getTime() + 12 * 24 * 60 * 60 * 1000
      ).toISOString(),
      requestDate: new Date(
        baseDate.getTime() - 8 * 24 * 60 * 60 * 1000
      ).toISOString(),
      processedDate: new Date(
        baseDate.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      employeeComment: "Urgence familiale",
      managerComment: "Absence accordée",
      attachments: [],
      isUrgent: true, // URGENT DEMANDE
    },
  ];
};

export const useDemandeStore = create<DemandeStore>((set, get) => ({
  // State
  demandes: [],
  filteredDemandes: [],
  selectedDemande: null,
  filters: {},
  isLoading: false,
  isSubmitting: false,
  error: null,

  // Actions
  fetchDemandes: async () => {
    set({ isLoading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockDemandes = generateMockDemandes();

      set((state) => {
        const filteredDemandes = applyFilters(mockDemandes, state.filters);

        return {
          demandes: mockDemandes,
          filteredDemandes,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des demandes",
        isLoading: false,
      });
    }
  },

  createDemande: async (data) => {
    set({ isSubmitting: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const attachments: DemandeAttachment[] = [];
      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((file, index) => {
          attachments.push({
            id: `att_${Date.now()}_${index}`,
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file),
            mimeType: file.type,
          });
        });
      }

      const newDemande: Demande = {
        id: `demande_${Date.now()}`,
        type: data.type,
        status: "pending",
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        requestDate: new Date().toISOString(),
        employeeComment: data.employeeComment,
        attachments,
        isUrgent: data.isUrgent || false,
      };

      set((state) => {
        const updatedDemandes = [newDemande, ...state.demandes];
        const filteredDemandes = applyFilters(updatedDemandes, state.filters);

        return {
          demandes: updatedDemandes,
          filteredDemandes,
          isSubmitting: false,
        };
      });

      return newDemande;
    } catch (error) {
      set({
        error: "Erreur lors de la création de la demande",
        isSubmitting: false,
      });
      throw error;
    }
  },

  updateDemande: async (id, updates) => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const updatedDemandes = state.demandes.map((demande) =>
          demande.id === id ? { ...demande, ...updates } : demande
        );

        const filteredDemandes = applyFilters(updatedDemandes, state.filters);

        return {
          demandes: updatedDemandes,
          filteredDemandes,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour de la demande",
        isLoading: false,
      });
    }
  },

  deleteDemande: async (id) => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const updatedDemandes = state.demandes.filter(
          (demande) => demande.id !== id
        );
        const filteredDemandes = applyFilters(updatedDemandes, state.filters);

        return {
          demandes: updatedDemandes,
          filteredDemandes,
          selectedDemande:
            state.selectedDemande?.id === id ? null : state.selectedDemande,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la suppression de la demande",
        isLoading: false,
      });
    }
  },

  selectDemande: (demande) => {
    set({ selectedDemande: demande });
  },

  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredDemandes = applyFilters(state.demandes, updatedFilters);

      return {
        filters: updatedFilters,
        filteredDemandes,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const emptyFilters = {};
      const filteredDemandes = applyFilters(state.demandes, emptyFilters);

      return {
        filters: emptyFilters,
        filteredDemandes,
      };
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
