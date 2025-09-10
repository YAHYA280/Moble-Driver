// store/fuelCardStore.ts

import { create } from "zustand";
import {
  FuelCard,
  FuelCardActions,
  FuelCardFilters,
  FuelCardState,
  Receipt,
} from "../shared/types/fuelCard";

type FuelCardStore = FuelCardState & FuelCardActions;

// Helper function to apply filters
const applyFiltersToFuelCards = (
  fuelCards: FuelCard[],
  filters: FuelCardFilters
) => {
  let filtered = [...fuelCards];

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter((fc) => fc.status === filters.status);
  }

  // Filter by driver ID
  if (filters.driverId) {
    filtered = filtered.filter(
      (fc) => fc.assignedDriverId === filters.driverId
    );
  }

  // Filter by payment method (based on receipts)
  if (filters.paymentMethod) {
    filtered = filtered.filter((fc) =>
      fc.receipts.some((r) => r.paymentMethod === filters.paymentMethod)
    );
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (fc) =>
        fc.cardNumber.toLowerCase().includes(query) ||
        fc.assignedDriverName.toLowerCase().includes(query)
    );
  }

  // Filter by date range
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

// Mock data
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
    receipts: [
      {
        id: "receipt-1",
        amount: 2500.0,
        date: "2025-01-08",
        time: "14:30",
        stationName: "Station Shell Centre-ville",
        paymentMethod: "Carte carburant",
        vehiclePlateNumber: "95700L15",
        createdAt: "2025-01-08T14:30:00Z",
      },
      {
        id: "receipt-2",
        amount: 1800.0,
        date: "2025-01-07",
        time: "16:45",
        stationName: "Total Access",
        paymentMethod: "Hors carte",
        vehiclePlateNumber: "95700L15",
        notes: "Paid from personal money - card limit reached",
        createdAt: "2025-01-07T16:45:00Z",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
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
    receipts: [
      {
        id: "receipt-3",
        amount: 3200.0,
        date: "2025-01-08",
        time: "09:15",
        stationName: "Esso Express",
        paymentMethod: "Carte carburant",
        vehiclePlateNumber: "SN-UX420-77V1",
        createdAt: "2025-01-08T09:15:00Z",
      },
    ],
    createdAt: "2024-02-01T00:00:00Z",
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
    receipts: [
      {
        id: "receipt-4",
        amount: 2100.0,
        date: "2025-01-06",
        time: "11:20",
        stationName: "BP Station",
        paymentMethod: "Carte carburant",
        vehiclePlateNumber: "98765ABC",
        createdAt: "2025-01-06T11:20:00Z",
      },
      {
        id: "receipt-5",
        amount: 1500.0,
        date: "2025-01-05",
        time: "18:30",
        stationName: "Agip Service",
        paymentMethod: "Hors carte",
        vehiclePlateNumber: "98765ABC",
        notes: "Emergency refuel - card not working",
        createdAt: "2025-01-05T18:30:00Z",
      },
    ],
    createdAt: "2024-03-01T00:00:00Z",
    lastModified: "2025-01-06T11:20:00Z",
  },
];

export const useFuelCardStore = create<FuelCardStore>((set, get) => ({
  // State
  fuelCards: mockFuelCards,
  filteredFuelCards: mockFuelCards,
  selectedFuelCard: null,
  selectedReceipt: null,
  filters: {},
  isLoading: false,
  error: null,
  isEditMode: false,

  // Actions
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

            // Update consumption amounts
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

        // Update selected fuel card if it's the one being modified
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
        error: "Erreur lors de l'ajout du reçu",
        isLoading: false,
      });
    }
  },

  updateReceipt: async (fuelCardId: string, receiptId: string, receiptData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const updatedFuelCards = state.fuelCards.map((fuelCard) => {
          if (fuelCard.id === fuelCardId) {
            const updatedReceipts = fuelCard.receipts.map((receipt) =>
              receipt.id === receiptId
                ? { ...receipt, ...receiptData }
                : receipt
            );

            // Recalculate consumption amounts
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

        // Update selected fuel card and receipt if they're the ones being modified
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

            // Recalculate consumption amounts
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
