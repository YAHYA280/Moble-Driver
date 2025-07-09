import { create } from "zustand";
import {
  Payslip,
  PayslipActions,
  PayslipFilters,
  PayslipState,
} from "../shared/types/payslip";

type PayslipStore = PayslipState & PayslipActions;

// Helper function to apply filters
const applyFiltersToPayslips = (
  payslips: Payslip[],
  filters: PayslipFilters
) => {
  let filtered = [...payslips];

  // Filter by year
  if (filters.year) {
    filtered = filtered.filter((p) => p.year === filters.year);
  }

  // Filter by month
  if (filters.month) {
    filtered = filtered.filter((p) => p.month === filters.month);
  }

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter((p) => p.status === filters.status);
  }

  // Filter by amount range
  if (filters.minAmount !== undefined) {
    filtered = filtered.filter((p) => p.netSalary >= filters.minAmount!);
  }

  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter((p) => p.netSalary <= filters.maxAmount!);
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.monthYear.toLowerCase().includes(query) ||
        p.netSalary.toString().includes(query) ||
        p.grossSalary.toString().includes(query)
    );
  }

  // Sort by date (newest first)
  return filtered.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};

// Mock data for payslips
const mockPayslips: Payslip[] = [
  {
    id: "957H15/1000$",
    monthYear: "Avril 2025",
    month: 4,
    year: 2025,
    grossSalary: 1000.0,
    netSalary: 800.0,
    status: "available",
    availableDate: "14/08/2025",
    createdDate: "08/2025",
    deductions: [
      { id: "1", label: "CNSS", amount: 270.0, type: "cnss" },
      { id: "2", label: "AMO", amount: 130.0, type: "amo" },
      {
        id: "3",
        label: "IR (Impôt sur le Revenu)",
        amount: 220.0,
        type: "tax",
      },
    ],
    bonuses: [
      {
        id: "1",
        label: "Prime de performance",
        amount: 300.0,
        type: "performance",
      },
    ],
    advances: [],
    overtimeHours: 0,
    overtimeRate: 0,
    pdfUrl: "957H15/1000$.pdf",
    employeeId: "EMP001",
    employeeName: "John Doe",
    employeePosition: "Conducteur",
    companyName: "VSN Transport",
    payPeriodStart: "01/04/2025",
    payPeriodEnd: "30/04/2025",
  },
  {
    id: "957H15/850$",
    monthYear: "Mars 2025",
    month: 3,
    year: 2025,
    grossSalary: 850.0,
    netSalary: 680.0,
    status: "pending",
    availableDate: "14/07/2025",
    createdDate: "07/2025",
    deductions: [
      { id: "1", label: "CNSS", amount: 229.5, type: "cnss" },
      { id: "2", label: "AMO", amount: 110.5, type: "amo" },
      {
        id: "3",
        label: "IR (Impôt sur le Revenu)",
        amount: 187.0,
        type: "tax",
      },
    ],
    bonuses: [],
    advances: [],
    overtimeHours: 0,
    overtimeRate: 0,
    employeeId: "EMP001",
    employeeName: "John Doe",
    employeePosition: "Conducteur",
    companyName: "VSN Transport",
    payPeriodStart: "01/03/2025",
    payPeriodEnd: "31/03/2025",
  },
  {
    id: "957H15/920$",
    monthYear: "Février 2025",
    month: 2,
    year: 2025,
    grossSalary: 920.0,
    netSalary: 736.0,
    status: "available",
    availableDate: "14/06/2025",
    createdDate: "06/2025",
    deductions: [
      { id: "1", label: "CNSS", amount: 248.4, type: "cnss" },
      { id: "2", label: "AMO", amount: 119.6, type: "amo" },
      {
        id: "3",
        label: "IR (Impôt sur le Revenu)",
        amount: 202.4,
        type: "tax",
      },
    ],
    bonuses: [
      { id: "1", label: "Prime de transport", amount: 50.0, type: "transport" },
    ],
    advances: [],
    overtimeHours: 8,
    overtimeRate: 15.0,
    pdfUrl: "957H15/920$.pdf",
    employeeId: "EMP001",
    employeeName: "John Doe",
    employeePosition: "Conducteur",
    companyName: "VSN Transport",
    payPeriodStart: "01/02/2025",
    payPeriodEnd: "28/02/2025",
  },
  {
    id: "957H15/880$",
    monthYear: "Janvier 2025",
    month: 1,
    year: 2025,
    grossSalary: 880.0,
    netSalary: 704.0,
    status: "available",
    availableDate: "14/05/2025",
    createdDate: "05/2025",
    deductions: [
      { id: "1", label: "CNSS", amount: 237.6, type: "cnss" },
      { id: "2", label: "AMO", amount: 114.4, type: "amo" },
      {
        id: "3",
        label: "IR (Impôt sur le Revenu)",
        amount: 193.6,
        type: "tax",
      },
    ],
    bonuses: [],
    advances: [
      {
        id: "1",
        label: "Avance sur salaire",
        amount: 100.0,
        date: "15/01/2025",
      },
    ],
    overtimeHours: 0,
    overtimeRate: 0,
    pdfUrl: "957H15/880$.pdf",
    employeeId: "EMP001",
    employeeName: "John Doe",
    employeePosition: "Conducteur",
    companyName: "VSN Transport",
    payPeriodStart: "01/01/2025",
    payPeriodEnd: "31/01/2025",
  },
];

export const usePayslipStore = create<PayslipStore>((set, get) => ({
  // State
  payslips: mockPayslips,
  filteredPayslips: mockPayslips,
  filters: {},
  isLoading: false,
  error: null,
  selectedPayslip: null,

  // Actions
  fetchPayslips: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredPayslips = applyFiltersToPayslips(
          mockPayslips,
          state.filters
        );
        return {
          payslips: mockPayslips,
          filteredPayslips,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des bulletins de paie",
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters: Partial<PayslipFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredPayslips = applyFiltersToPayslips(
        state.payslips,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredPayslips,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredPayslips = applyFiltersToPayslips(state.payslips, {});
      return {
        filters: {},
        filteredPayslips,
      };
    });
  },

  selectPayslip: (payslip: Payslip | null) => {
    set({ selectedPayslip: payslip });
  },

  downloadPayslip: async (payslipId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate download
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In real app, this would trigger the download
      console.log(`Downloading payslip: ${payslipId}`);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: "Erreur lors du téléchargement",
        isLoading: false,
      });
    }
  },

  getFilteredPayslips: () => {
    return get().filteredPayslips;
  },

  clearError: () => {
    set({ error: null });
  },
}));
