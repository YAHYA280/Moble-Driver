export type PayslipStatus = "available" | "pending" | "processing";

export interface PayslipDeduction {
  id: string;
  label: string;
  amount: number;
  type: "cnss" | "amo" | "tax" | "other";
}

export interface PayslipBonus {
  id: string;
  label: string;
  amount: number;
  type: "performance" | "overtime" | "transport" | "other";
}

export interface PayslipAdvance {
  id: string;
  label: string;
  amount: number;
  date: string;
}

export interface Payslip {
  id: string;
  monthYear: string;
  month: number;
  year: number;
  grossSalary: number;
  netSalary: number;
  status: PayslipStatus;
  availableDate: string;
  createdDate: string;
  deductions: PayslipDeduction[];
  bonuses: PayslipBonus[];
  advances: PayslipAdvance[];
  overtimeHours: number;
  overtimeRate: number;
  pdfUrl?: string;
  employeeId: string;
  employeeName: string;
  employeePosition: string;
  companyName: string;
  payPeriodStart: string;
  payPeriodEnd: string;
}

export interface PayslipFilters {
  year?: number;
  month?: number;
  status?: PayslipStatus;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

export interface PayslipState {
  payslips: Payslip[];
  filteredPayslips: Payslip[];
  filters: PayslipFilters;
  isLoading: boolean;
  error: string | null;
  selectedPayslip: Payslip | null;
}

export interface PayslipActions {
  fetchPayslips: () => Promise<void>;
  setFilters: (filters: Partial<PayslipFilters>) => void;
  clearFilters: () => void;
  selectPayslip: (payslip: Payslip | null) => void;
  downloadPayslip: (payslipId: string) => Promise<void>;
  getFilteredPayslips: () => Payslip[];
  clearError: () => void;
}
