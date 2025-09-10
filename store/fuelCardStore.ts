import { create } from "zustand";
import {
  FuelCard,
  FuelCardActions,
  FuelCardFilters,
  FuelCardState,
  Receipt,
} from "../shared/types/fuelCard";

type FuelCardStore = FuelCardState & FuelCardActions;

const applyFiltersToFuelCards = (
  fuelCards: FuelCard[],
  filters: FuelCardFilters
) => {
  let filtered = [...fuelCards];

  if (filters.status) {
    filtered = filtered.filter((fc) => fc.status === filters.status);
  }

  if (filters.driverId) {
    filtered = filtered.filter(
      (fc) => fc.assignedDriverId === filters.driverId
    );
  }

  if (filters.paymentMethod) {
    filtered = filtered.filter((fc) =>
      fc.receipts.some((r) => r.paymentMethod === filters.paymentMethod)
    );
  }

  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (fc) =>
        fc.cardNumber.toLowerCase().includes(query) ||
        fc.assignedDriverName.toLowerCase().includes(query)
    );
  }

  if (filters.dateFrom) {
    filtered = filtered.filter((fc) =>
      fc.receipts.some((r) => new Date(r.date) >= filters.dateFrom!)
    );
  }

  if (filters.dateTo) {
    filtered = filtered.filter((fc) =>
      fc.receipts.some((r) => new Date(r.date) <= filters.dateTo!)
    );
  }

  return filtered;
};

const mockFuelCards: FuelCard[] = [
  {
    id: "card-1",
    cardNumber: "9084634893",
    plafond: 100000.0,
    aConsomme: 10000.0,
    horsCarteTotal: 1000.0,
    status: "Active",
    assignedDriverId: "driver-1",
    assignedDriverName: "John Doe",
    expiryDate: "2025-12-31",
    issueDate: "2024-01-15",
    receipts: [
      {
        id: "receipt-1",
        amount: 2500.0,
        date: "08/01/2025",
        time: "14:30",
        fuelDate: "08/01/2025",
        fuelTime: "14:00",
        stationName: "Station Shell Centre-ville",
        paymentMethod: "Carte carburant",
        vehiclePlateNumber: "95700L15",
        notes: "Plein effectué pendant la tournée du matin",
        createdAt: "2025-01-08T14:30:00Z",
      },
      {
        id: "receipt-2",
        amount: 1800.0,
        date: "07/01/2025",
        time: "16:45",
        fuelDate: "06/01/2025",
        fuelTime: "18:30",
        stationName: "Total Access Hydra",
        paymentMethod: "Hors carte",
        vehiclePlateNumber: "95700L15",
        notes: "Payé de ma poche - plafond de la carte atteint",
        createdAt: "2025-01-07T16:45:00Z",
      },
      {
        id: "receipt-3",
        amount: 3200.0,
        date: "06/01/2025",
        time: "10:15",
        fuelDate: "06/01/2025",
        fuelTime: "10:00",
        stationName: "Naftal Station Bab Ezzouar",
        paymentMethod: "Carte carburant",
        vehiclePlateNumber: "95700L15",
        createdAt: "2025-01-06T10:15:00Z",
      },
    ],
    createdAt: "2024-01-15T00:00:00Z",
    lastModified: "2025-01-08T14:30:00Z",
  },
  {
    id: "card-2",
    cardNumber: "9084634894",
    plafond: 100000.0,
    aConsomme: 8500.0,
    horsCarteTotal: 500.0,
    status: "Active",
    assignedDriverId: "driver-2",
    assignedDriverName: "Jane Smith",
    expiryDate: "2025-11-30",
    issueDate: "2024-02-10",
    receipts: [
      {
        id: "receipt-4",
        amount: 3200.0,
        date: "08/01/2025",
        time: "09:15",
        fuelDate: "08/01/2025",
        fuelTime: "09:00",
        stationName: "Esso Express Cheraga",
        paymentMethod: "Carte carburant",
        vehiclePlateNumber: "SN-UX420-77V1",
        notes: "Déplacement vers Oran - plein de sécurité",
        createdAt: "2025-01-08T09:15:00Z",
      },
      {
        id: "receipt-5",
        amount: 1500.0,
        date: "05/01/2025",
        time: "17:20",
        fuelDate: "05/01/2025",
        fuelTime: "17:15",
        stationName: "Station Sonatrach",
        paymentMethod: "Hors carte",
        vehiclePlateNumber: "SN-UX420-77V1",
        notes: "Urgence - carte temporairement bloquée",
        createdAt: "2025-01-05T17:20:00Z",
      },
    ],
    createdAt: "2024-02-10T00:00:00Z",
    lastModified: "2025-01-08T09:15:00Z",
  },
  {
    id: "card-3",
    cardNumber: "9084634895",
    plafond: 100000.0,
    aConsomme: 15000.0,
    horsCarteTotal: 2000.0,
    status: "Active",
    assignedDriverId: "driver-3",
    assignedDriverName: "Mike Johnson",
    expiryDate: "2025-10-15",
    issueDate: "2024-03-05",
    receipts: [
      {
        id: "receipt-6",
        amount: 2100.0,
        date: "06/01/2025",
        time: "11:20",
        fuelDate: "06/01/2025",
        fuelTime: "11:00",
        stationName: "BP Station Kouba",
        paymentMethod: "Carte carburant",
        vehiclePlateNumber: "98765ABC",
        notes: "Livraison matinale - réservoir à moitié vide",
        createdAt: "2025-01-06T11:20:00Z",
      },
      {
        id: "receipt-7",
        amount: 1500.0,
        date: "05/01/2025",
        time: "18:30",
        fuelDate: "05/01/2025",
        fuelTime: "18:15",
        stationName: "Agip Service Bordj El Kiffan",
        paymentMethod: "Hors carte",
        vehiclePlateNumber: "98765ABC",
        notes: "Plein d'urgence - carte non acceptée par le terminal",
        createdAt: "2025-01-05T18:30:00Z",
      },
      {
        id: "receipt-8",
        amount: 2800.0,
        date: "04/01/2025",
        time: "08:45",
        fuelDate: "03/01/2025",
        fuelTime: "19:30",
        stationName: "Total Energies Rouiba",
        paymentMethod: "Carte carburant",
        vehiclePlateNumber: "98765ABC",
        notes: "Ajouté en retard - oublié de scanner hier soir",
        createdAt: "2025-01-04T08:45:00Z",
      },
    ],
    createdAt: "2024-03-05T00:00:00Z",
    lastModified: "2025-01-06T11:20:00Z",
  },
  {
    id: "card-4",
    cardNumber: "9084634896",
    plafond: 80000.0,
    aConsomme: 6500.0,
    horsCarteTotal: 0.0,
    status: "Inactive",
    assignedDriverId: "driver-4",
    assignedDriverName: "Ahmed Benali",
    expiryDate: "2025-09-20",
    issueDate: "2024-04-12",
    receipts: [
      {
        id: "receipt-9",
        amount: 1900.0,
        date: "03/01/2025",
        time: "15:10",
        fuelDate: "03/01/2025",
        fuelTime: "15:00",
        stationName: "Naftal Bir Mourad Rais",
        paymentMethod: "Carte carburant",
        vehiclePlateNumber: "ALG123456",
        createdAt: "2025-01-03T15:10:00Z",
      },
    ],
    createdAt: "2024-04-12T00:00:00Z",
    lastModified: "2025-01-03T15:10:00Z",
  },
  {
    id: "card-5",
    cardNumber: "9084634897",
    plafond: 120000.0,
    aConsomme: 25000.0,
    horsCarteTotal: 3500.0,
    status: "Expired",
    assignedDriverId: "driver-5",
    assignedDriverName: "Fatima Zohra",
    expiryDate: "2024-12-31",
    issueDate: "2024-01-20",
    receipts: [
      {
        id: "receipt-10",
        amount: 4200.0,
        date: "30/12/2024",
        time: "16:45",
        fuelDate: "30/12/2024",
        fuelTime: "16:30",
        stationName: "Shell Select Alger Centre",
        paymentMethod: "Carte carburant",
        vehiclePlateNumber: "DZ789ABC",
        notes: "Dernier plein avant expiration de la carte",
        createdAt: "2024-12-30T16:45:00Z",
      },
      {
        id: "receipt-11",
        amount: 1800.0,
        date: "02/01/2025",
        time: "14:20",
        fuelDate: "02/01/2025",
        fuelTime: "14:00",
        stationName: "Total Access Hussein Dey",
        paymentMethod: "Hors carte",
        vehiclePlateNumber: "DZ789ABC",
        notes: "Carte expirée - en attente du renouvellement",
        createdAt: "2025-01-02T14:20:00Z",
      },
    ],
    createdAt: "2024-01-20T00:00:00Z",
    lastModified: "2025-01-02T14:20:00Z",
  },
];

export const useFuelCardStore = create<FuelCardStore>((set, get) => ({
  fuelCards: mockFuelCards,
  filteredFuelCards: mockFuelCards,
  selectedFuelCard: null,
  selectedReceipt: null,
  filters: {},
  isLoading: false,
  error: null,
  isEditMode: false,

  fetchFuelCards: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredFuelCards = applyFiltersToFuelCards(
          mockFuelCards,
          state.filters
        );
        return {
          fuelCards: mockFuelCards,
          filteredFuelCards,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des cartes carburant",
        isLoading: false,
      });
    }
  },

  selectFuelCard: (fuelCard: FuelCard | null) => {
    set({ selectedFuelCard: fuelCard, selectedReceipt: null });
  },

  selectReceipt: (receipt: Receipt | null) => {
    set({ selectedReceipt: receipt });
  },

  addReceipt: async (fuelCardId: string, receiptData) => {
    set({ isLoading: true, error: null });
    try {
      const { fuelCards } = get();
      const fuelCard = fuelCards.find((fc) => fc.id === fuelCardId);

      if (!fuelCard) {
        throw new Error("Carte carburant non trouvée");
      }

      if (fuelCard.status === "Expired") {
        throw new Error("Impossible d'ajouter un reçu à une carte expirée");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const newReceipt: Receipt = {
          ...receiptData,
          id: `receipt_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        const updatedFuelCards = state.fuelCards.map((fuelCard) => {
          if (fuelCard.id === fuelCardId) {
            const updatedReceipts = [...fuelCard.receipts, newReceipt];

            const newAConsomme = updatedReceipts
              .filter((r) => r.paymentMethod === "Carte carburant")
              .reduce((sum, r) => sum + r.amount, 0);

            const newHorsCarteTotal = updatedReceipts
              .filter((r) => r.paymentMethod === "Hors carte")
              .reduce((sum, r) => sum + r.amount, 0);

            return {
              ...fuelCard,
              receipts: updatedReceipts,
              aConsomme: newAConsomme,
              horsCarteTotal: newHorsCarteTotal,
              lastModified: new Date().toISOString(),
            };
          }
          return fuelCard;
        });

        const filteredFuelCards = applyFiltersToFuelCards(
          updatedFuelCards,
          state.filters
        );

        const selectedFuelCard =
          state.selectedFuelCard?.id === fuelCardId
            ? updatedFuelCards.find((fc) => fc.id === fuelCardId) ||
              state.selectedFuelCard
            : state.selectedFuelCard;

        return {
          fuelCards: updatedFuelCards,
          filteredFuelCards,
          selectedFuelCard,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'ajout du reçu",
        isLoading: false,
      });
      throw error;
    }
  },

  updateReceipt: async (fuelCardId: string, receiptId: string, receiptData) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const updatedFuelCards = state.fuelCards.map((fuelCard) => {
          if (fuelCard.id === fuelCardId) {
            const updatedReceipts = fuelCard.receipts.map((receipt) =>
              receipt.id === receiptId
                ? { ...receipt, ...receiptData }
                : receipt
            );

            const newAConsomme = updatedReceipts
              .filter((r) => r.paymentMethod === "Carte carburant")
              .reduce((sum, r) => sum + r.amount, 0);

            const newHorsCarteTotal = updatedReceipts
              .filter((r) => r.paymentMethod === "Hors carte")
              .reduce((sum, r) => sum + r.amount, 0);

            return {
              ...fuelCard,
              receipts: updatedReceipts,
              aConsomme: newAConsomme,
              horsCarteTotal: newHorsCarteTotal,
              lastModified: new Date().toISOString(),
            };
          }
          return fuelCard;
        });

        const filteredFuelCards = applyFiltersToFuelCards(
          updatedFuelCards,
          state.filters
        );

        const selectedFuelCard =
          state.selectedFuelCard?.id === fuelCardId
            ? updatedFuelCards.find((fc) => fc.id === fuelCardId) ||
              state.selectedFuelCard
            : state.selectedFuelCard;

        const selectedReceipt =
          state.selectedReceipt?.id === receiptId && selectedFuelCard
            ? selectedFuelCard.receipts.find((r) => r.id === receiptId) ||
              state.selectedReceipt
            : state.selectedReceipt;

        return {
          fuelCards: updatedFuelCards,
          filteredFuelCards,
          selectedFuelCard,
          selectedReceipt,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour du reçu",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteReceipt: async (fuelCardId: string, receiptId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const updatedFuelCards = state.fuelCards.map((fuelCard) => {
          if (fuelCard.id === fuelCardId) {
            const updatedReceipts = fuelCard.receipts.filter(
              (receipt) => receipt.id !== receiptId
            );

            const newAConsomme = updatedReceipts
              .filter((r) => r.paymentMethod === "Carte carburant")
              .reduce((sum, r) => sum + r.amount, 0);

            const newHorsCarteTotal = updatedReceipts
              .filter((r) => r.paymentMethod === "Hors carte")
              .reduce((sum, r) => sum + r.amount, 0);

            return {
              ...fuelCard,
              receipts: updatedReceipts,
              aConsomme: newAConsomme,
              horsCarteTotal: newHorsCarteTotal,
              lastModified: new Date().toISOString(),
            };
          }
          return fuelCard;
        });

        const filteredFuelCards = applyFiltersToFuelCards(
          updatedFuelCards,
          state.filters
        );

        // Update selected fuel card and clear selected receipt if it was deleted
        const selectedFuelCard =
          state.selectedFuelCard?.id === fuelCardId
            ? updatedFuelCards.find((fc) => fc.id === fuelCardId) ||
              state.selectedFuelCard
            : state.selectedFuelCard;

        const selectedReceipt =
          state.selectedReceipt?.id === receiptId
            ? null
            : state.selectedReceipt;

        return {
          fuelCards: updatedFuelCards,
          filteredFuelCards,
          selectedFuelCard,
          selectedReceipt,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la suppression du reçu",
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (newFilters: Partial<FuelCardFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredFuelCards = applyFiltersToFuelCards(
        state.fuelCards,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredFuelCards,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredFuelCards = applyFiltersToFuelCards(state.fuelCards, {});
      return {
        filters: {},
        filteredFuelCards,
      };
    });
  },

  setEditMode: (isEdit: boolean) => {
    set({ isEditMode: isEdit });
  },

  clearError: () => {
    set({ error: null });
  },
}));
