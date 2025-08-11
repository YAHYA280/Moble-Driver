// store/routeSheetStore.ts - Fixed createRouteSheet function

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
  return TIME_SLOTS.map((slot, index) => ({
    id: `${slot.toLowerCase().replace(/[-\s]/g, "_")}-${Date.now()}-${index}`,
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

// Generate comprehensive mock data
const generateMockRouteSheets = (): RouteSheet[] => {
  const sheets: RouteSheet[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

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

  // Create sheets for last 6 months including current month
  for (let i = 0; i < 6; i++) {
    const date = new Date(currentYear, currentDate.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthString = `${year}-${month.toString().padStart(2, "0")}`;

    const days = generateDaysForMonth(year, month);

    // Add realistic data to sheets
    if (i > 0) {
      // For older sheets, add more completed data
      const completedDaysCount = Math.floor(
        days.length * (0.6 + Math.random() * 0.3)
      );
      days.slice(0, completedDaysCount).forEach((day, dayIndex) => {
        // Randomly activate 1-3 time slots per day
        const slotsToActivate = Math.floor(Math.random() * 3) + 1;
        for (
          let slotIndex = 0;
          slotIndex < Math.min(slotsToActivate, TIME_SLOTS.length);
          slotIndex++
        ) {
          const slot = day.timeSlots[slotIndex];
          slot.isActive = true;
          const baseKm = 1000 + dayIndex * 50 + Math.floor(Math.random() * 100);
          slot.kilometrage = {
            startKm: baseKm,
            endKm: baseKm + 80 + Math.floor(Math.random() * 120),
          };
          slot.isCompleted = true;

          if (Math.random() > 0.6) {
            slot.otherTrips = `Trajet supplémentaire - Mission ${dayIndex + 1}`;
          }
          if (Math.random() > 0.7) {
            slot.comments = `Mission effectuée sans incident - Jour ${
              dayIndex + 1
            }`;
          }
        }
        day.isCompleted = checkDayCompletion(day);
      });
    } else if (i === 0) {
      // For current month, add partial data
      const today = new Date().getDate();
      const pastDays = Math.min(today - 1, days.length);

      days.slice(0, pastDays).forEach((day, dayIndex) => {
        if (Math.random() > 0.2) {
          // 80% chance of having some data
          const slot = day.timeSlots[0]; // Morning slot
          slot.isActive = true;
          const baseKm = 1200 + dayIndex * 45;
          slot.kilometrage = {
            startKm: baseKm,
            endKm: baseKm + 95 + Math.floor(Math.random() * 60),
          };
          slot.isCompleted = true;
          day.isCompleted = true;

          // Sometimes add afternoon slot too
          if (Math.random() > 0.5) {
            const afternoonSlot = day.timeSlots[2]; // Afternoon slot
            afternoonSlot.isActive = true;
            afternoonSlot.kilometrage = {
              startKm: slot.kilometrage.endKm,
              endKm:
                slot.kilometrage.endKm + 40 + Math.floor(Math.random() * 30),
            };
            afternoonSlot.isCompleted = true;
          }
        }
      });
    }

    // Determine status based on month
    let status: RouteSheet["status"];
    if (i === 0) {
      status = "draft"; // Current month
    } else if (i === 1) {
      status = "submitted"; // Last month
    } else {
      status = "archived"; // Older months
    }

    const sheet: RouteSheet = {
      id: `sheet_${monthString}_${Date.now()}_${i}`,
      month: monthString,
      year,
      monthName: `${monthNames[month - 1]} ${year}`,
      driverId: "driver_1",
      status,
      days,
      createdAt: new Date(year, month - 1, 1).toISOString(),
      lastModified: new Date(
        year,
        month - 1,
        Math.min(25, new Date().getDate())
      ).toISOString(),
      submittedAt:
        status !== "draft"
          ? new Date(year, month - 1, 28).toISOString()
          : undefined,
      totalKilometrage: calculateTotalKilometrage(days),
      completionPercentage: calculateCompletionPercentage(days),
    };

    sheets.push(sheet);
  }

  return sheets;
};

export const useRouteSheetStore = create<RouteSheetStore>((set, get) => ({
  // State
  routeSheets: [],
  filteredRouteSheets: [],
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
      // Simulate API call with more realistic timing
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockRouteSheets = generateMockRouteSheets();

      set((state) => {
        const filteredRouteSheets = applyFilters(
          mockRouteSheets,
          state.filters
        );

        return {
          routeSheets: mockRouteSheets,
          filteredRouteSheets,
          isLoading: false,
          error: null,
        };
      });
    } catch (error) {
      console.error("fetchRouteSheets: Error occurred:", error);
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

    // Ensure we have loaded route sheets
    if (state.routeSheets.length === 0) {
      await get().fetchRouteSheets();
    }

    const updatedState = get();
    const existingSheet = updatedState.routeSheets.find(
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
    console.log("createRouteSheet: Creating for month", month);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

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
      id: `sheet_${Date.now()}_new_${monthNum}`,
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
      // Check if a sheet for this month already exists
      const existingSheetIndex = state.routeSheets.findIndex(
        (sheet) => sheet.month === month
      );

      let updatedRouteSheets;
      if (existingSheetIndex >= 0) {
        // Replace existing sheet
        updatedRouteSheets = [...state.routeSheets];
        updatedRouteSheets[existingSheetIndex] = newRouteSheet;
      } else {
        // Add new sheet
        updatedRouteSheets = [...state.routeSheets, newRouteSheet];
      }

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

    console.log("createRouteSheet: Created new sheet", newRouteSheet.id);
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

            const updatedDay = { ...day, timeSlots: updatedTimeSlots };
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
