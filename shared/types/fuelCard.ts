// shared/types/fuelCard.ts

export type PaymentMethod = "Carte carburant" | "Hors carte";
export type FuelCardStatus = "Active" | "Inactive" | "Expired";

export interface Receipt {
  id: string;
  amount: number;
  date: string;
  time: string;
  stationName?: string;
  paymentMethod: PaymentMethod;
  photoUri?: string;
  notes?: string;
  vehiclePlateNumber?: string;
  createdAt: string;
}

export interface FuelCard {
  id: string;
  cardNumber: string;
  plafond: number; // Maximum amount/credit limit
  aConsomme: number; // Amount consumed
  horsCarteTotal: number; // Out of pocket total amount
  status: FuelCardStatus;
  assignedDriverId: string;
  assignedDriverName: string;
  expiryDate: string;
  receipts: Receipt[];
  createdAt: string;
  lastModified: string;
}

export interface FuelCardFilters {
  status?: FuelCardStatus;
  driverId?: string;
  searchQuery?: string;
  paymentMethod?: PaymentMethod;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface FuelCardState {
  fuelCards: FuelCard[];
  filteredFuelCards: FuelCard[];
  selectedFuelCard: FuelCard | null;
  selectedReceipt: Receipt | null;
  filters: FuelCardFilters;
  isLoading: boolean;
  error: string | null;
  isEditMode: boolean;
}

export interface FuelCardActions {
  fetchFuelCards: () => Promise<void>;
  selectFuelCard: (fuelCard: FuelCard | null) => void;
  selectReceipt: (receipt: Receipt | null) => void;
  addReceipt: (
    fuelCardId: string,
    receipt: Omit<Receipt, "id" | "createdAt">
  ) => Promise<void>;
  updateReceipt: (
    fuelCardId: string,
    receiptId: string,
    receipt: Partial<Receipt>
  ) => Promise<void>;
  deleteReceipt: (fuelCardId: string, receiptId: string) => Promise<void>;
  setFilters: (filters: Partial<FuelCardFilters>) => void;
  clearFilters: () => void;
  setEditMode: (isEdit: boolean) => void;
  clearError: () => void;
}
