// store/routeSheetStore.ts

import { create } from "zustand";
import {
  DayData,
  RouteSheet,
  RouteSheetActions,
  RouteSheetFilters,
  RouteSheetState,
  TIME_SLOTS,
  TimeSlotData,
} from "../shared/types/routeSheet";

type RouteSheetStore = RouteSheetState & RouteSheetActions;

// Helper functions
const generateTimeSlots = (): TimeSlotData[] => {
  return TIME_SLOTS.map((slot) => ({
    id: `${slot.toLowerCase()}-${Date.now()}`,
    timeSlot: slot,
    isActive: false,
    kilometrage: { startKm: 0, endKm: 0 },
    otherTrips: "",
    comments: "",
    isCompleted: false,
  }));
};

const generateDaysForMonth = (year: number, month: number): DayData[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: DayData[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day).toISOString().split("T")[0];
    days.push({
      date,
      timeSlots: generateTimeSlots(),
      isCompleted: false,
    });
  }

  return days;
};

const calculateTotalKilometrage = (days: DayData[]): number => {
  return days.reduce((total, day) => {
    return (
      total +
      day.timeSlots.reduce((dayTotal, slot) => {
        if (
          slot.isActive &&
          slot.kilometrage.endKm > slot.kilometrage.startKm
        ) {
          return dayTotal + (slot.kilometrage.endKm - slot.kilometrage.startKm);
        }
        return dayTotal;
      }, 0)
    );
  }, 0);
};

const calculateCompletionPercentage = (days: DayData[]): number => {
  const totalDays = days.length;
  const completedDays = days.filter((day) => day.isCompleted).length;
  return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
};

const checkDayCompletion = (day: DayData): boolean => {
  const activeSlots = day.timeSlots.filter((slot) => slot.isActive);
  if (activeSlots.length === 0) return false;

  return activeSlots.every((slot) => {
    return (
      slot.kilometrage.startKm > 0 &&
      slot.kilometrage.endKm > slot.kilometrage.startKm
    );
  });
};

const applyFilters = (
  routeSheets: RouteSheet[],
  filters: RouteSheetFilters
): RouteSheet[] => {
  let filtered = [...routeSheets];

  if (filters.year) {
    filtered = filtered.filter((sheet) => sheet.year === filters.year);
  }

  if (filters.status) {
    filtered = filtered.filter((sheet) => sheet.status === filters.status);
  }

  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter((sheet) =>
      sheet.monthName.toLowerCase().includes(query)
    );
  }

  return filtered.sort(
    (a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
};

// Mock data
const mockRouteSheets: RouteSheet[] = [
  {
    id: "1",
    month: "2025-01",
    year: 2025,
    monthName: "Janvier 2025",
    driverId: "driver_1",
    status: "draft",
    days: generateDaysForMonth(2025, 1),
    createdAt: "2025-01-01T00:00:00Z",
    lastModified: "2025-01-15T10:30:00Z",
    totalKilometrage: 0,
    completionPercentage: 0,
  },
];

export const useRouteSheetStore = create<RouteSheetStore>((set, get) => ({
  // State
  routeSheets: mockRouteSheets,
  filteredRouteSheets: mockRouteSheets,
  currentRouteSheet: null,
  selectedDay: null,
  filters: {},
  isLoading: false,
  error: null,
  isEditMode: false,

  // Actions
  fetchRouteSheets: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const filteredRouteSheets = applyFilters(
          mockRouteSheets,
          state.filters
        );
        return {
          routeSheets: mockRouteSheets,
          filteredRouteSheets,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des feuilles de route",
        isLoading: false,
      });
    }
  },

  getCurrentMonthRouteSheet: async () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    const state = get();
    const existingSheet = state.routeSheets.find(
      (sheet) => sheet.month === currentMonth
    );

    if (existingSheet) {
      set({ currentRouteSheet: existingSheet });
      return existingSheet;
    }

    // Create new route sheet for current month
    const newSheet = await get().createRouteSheet(currentMonth);
    set({ currentRouteSheet: newSheet });
    return newSheet;
  },

  createRouteSheet: async (month: string) => {
    const [year, monthNum] = month.split("-").map(Number);
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    const newRouteSheet: RouteSheet = {
      id: `sheet_${Date.now()}`,
      month,
      year,
      monthName: `${monthNames[monthNum - 1]} ${year}`,
      driverId: "driver_1",
      status: "draft",
      days: generateDaysForMonth(year, monthNum),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      totalKilometrage: 0,
      completionPercentage: 0,
    };

    set((state) => {
      const updatedRouteSheets = [...state.routeSheets, newRouteSheet];
      const filteredRouteSheets = applyFilters(
        updatedRouteSheets,
        state.filters
      );

      return {
        routeSheets: updatedRouteSheets,
        filteredRouteSheets,
        currentRouteSheet: newRouteSheet,
      };
    });

    return newRouteSheet;
  },

  updateTimeSlotData: async (dayDate, timeSlot, data) => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      set((state) => {
        if (!state.currentRouteSheet) return state;

        const updatedDays = state.currentRouteSheet.days.map((day) => {
          if (day.date === dayDate) {
            const updatedTimeSlots = day.timeSlots.map((slot) => {
              if (slot.timeSlot === timeSlot) {
                const updatedSlot = { ...slot, ...data };
                // Check if slot is completed
                if (updatedSlot.isActive) {
                  updatedSlot.isCompleted =
                    updatedSlot.kilometrage.startKm > 0 &&
                    updatedSlot.kilometrage.endKm >
                      updatedSlot.kilometrage.startKm;
                }
                return updatedSlot;
              }
              return slot;
            });

            const updatedDay = {
              ...day,
              timeSlots: updatedTimeSlots,
            };
            updatedDay.isCompleted = checkDayCompletion(updatedDay);
            return updatedDay;
          }
          return day;
        });

        const updatedRouteSheet = {
          ...state.currentRouteSheet,
          days: updatedDays,
          lastModified: new Date().toISOString(),
          totalKilometrage: calculateTotalKilometrage(updatedDays),
          completionPercentage: calculateCompletionPercentage(updatedDays),
        };

        const updatedRouteSheets = state.routeSheets.map((sheet) =>
          sheet.id === updatedRouteSheet.id ? updatedRouteSheet : sheet
        );

        const filteredRouteSheets = applyFilters(
          updatedRouteSheets,
          state.filters
        );

        return {
          routeSheets: updatedRouteSheets,
          filteredRouteSheets,
          currentRouteSheet: updatedRouteSheet,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour",
        isLoading: false,
      });
    }
  },

  toggleTimeSlotActive: async (dayDate, timeSlot, isActive) => {
    await get().updateTimeSlotData(dayDate, timeSlot, { isActive });
  },

  saveDayData: async (dayDate, dayData) => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        if (!state.currentRouteSheet) return state;

        const updatedDays = state.currentRouteSheet.days.map((day) =>
          day.date === dayDate
            ? { ...dayData, isCompleted: checkDayCompletion(dayData) }
            : day
        );

        const updatedRouteSheet = {
          ...state.currentRouteSheet,
          days: updatedDays,
          lastModified: new Date().toISOString(),
          totalKilometrage: calculateTotalKilometrage(updatedDays),
          completionPercentage: calculateCompletionPercentage(updatedDays),
        };

        const updatedRouteSheets = state.routeSheets.map((sheet) =>
          sheet.id === updatedRouteSheet.id ? updatedRouteSheet : sheet
        );

        const filteredRouteSheets = applyFilters(
          updatedRouteSheets,
          state.filters
        );

        return {
          routeSheets: updatedRouteSheets,
          filteredRouteSheets,
          currentRouteSheet: updatedRouteSheet,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la sauvegarde",
        isLoading: false,
      });
    }
  },

  submitRouteSheet: async (routeSheetId) => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedRouteSheets = state.routeSheets.map((sheet) =>
          sheet.id === routeSheetId
            ? {
                ...sheet,
                status: "submitted" as const,
                submittedAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
              }
            : sheet
        );

        const filteredRouteSheets = applyFilters(
          updatedRouteSheets,
          state.filters
        );

        return {
          routeSheets: updatedRouteSheets,
          filteredRouteSheets,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la soumission",
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredRouteSheets = applyFilters(
        state.routeSheets,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredRouteSheets,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredRouteSheets = applyFilters(state.routeSheets, {});
      return {
        filters: {},
        filteredRouteSheets,
      };
    });
  },

  setEditMode: (isEdit) => {
    set({ isEditMode: isEdit });
  },

  selectDay: (day) => {
    set({ selectedDay: day });
  },

  clearError: () => {
    set({ error: null });
  },
}));
