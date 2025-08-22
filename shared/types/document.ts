// shared/types/document.ts

export type DocumentType =
  | "PDF"
  | "Image"
  | "Contrat"
  | "Permis"
  | "Assurance"
  | "Autre";
export type DocumentStatus = "active" | "expired" | "pending";
export type SortBy = "name" | "date" | "size" | "type";
export type SortOrder = "asc" | "desc";

export interface DocumentFile {
  id: string;
  name: string;
  type: DocumentType;
  size: number; // in bytes
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  uploadDate: string;
  modifiedDate: string;
  status: DocumentStatus;
  expiryDate?: string;
  tags: string[];
  isFavorite: boolean;
  folderId?: string;
  description?: string;
  isShared: boolean;
  sharedWith?: string[];
  version: number;
  originalName: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  parentId?: string;
  createdDate: string;
  modifiedDate: string;
  documentsCount: number;
  color?: string;
  icon?: string;
  isShared: boolean;
  size: number; // total size of documents in bytes
}

export interface StorageInfo {
  usedSpace: number; // in bytes
  totalSpace: number; // in bytes
  usedPercentage: number;
  documentsCount: number;
  foldersCount: number;
}

export interface DocumentFilters {
  type?: DocumentType[];
  status?: DocumentStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  sizeMin?: number;
  sizeMax?: number;
  searchQuery?: string;
  folderId?: string;
  isFavorite?: boolean;
  tags?: string[];
}

export interface DocumentSorting {
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface DocumentViewPreferences {
  viewMode: "grid" | "list";
  itemsPerPage: number;
  showThumbnails: boolean;
  groupByFolder: boolean;
}

export interface DocumentState {
  documents: DocumentFile[];
  folders: DocumentFolder[];
  filteredDocuments: DocumentFile[];
  filters: DocumentFilters;
  sorting: DocumentSorting;
  viewPreferences: DocumentViewPreferences;
  storageInfo: StorageInfo;
  selectedDocument: DocumentFile | null;
  selectedFolder: DocumentFolder | null;
  currentFolderId: string | null;
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export interface DocumentActions {
  // CRUD Operations - Documents
  fetchDocuments: (folderId?: string) => Promise<void>;
  uploadDocument: (
    file: File,
    folderId?: string,
    metadata?: Partial<DocumentFile>
  ) => Promise<DocumentFile>;
  updateDocument: (id: string, updates: Partial<DocumentFile>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  downloadDocument: (id: string) => Promise<void>;
  duplicateDocument: (id: string) => Promise<DocumentFile>;
  moveDocument: (id: string, targetFolderId?: string) => Promise<void>;

  // CRUD Operations - Folders
  fetchFolders: () => Promise<void>;
  createFolder: (name: string, parentId?: string) => Promise<DocumentFolder>;
  updateFolder: (id: string, updates: Partial<DocumentFolder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  moveFolder: (id: string, targetParentId?: string) => Promise<void>;

  // Favorites
  toggleFavorite: (documentId: string) => Promise<void>;
  getFavoriteDocuments: () => DocumentFile[];

  // Navigation
  navigateToFolder: (folderId: string | null) => void;
  goBack: () => void;
  selectDocument: (document: DocumentFile | null) => void;
  selectFolder: (folder: DocumentFolder | null) => void;

  // Filters & Sorting
  setFilters: (filters: Partial<DocumentFilters>) => void;
  clearFilters: () => void;
  setSorting: (sorting: Partial<DocumentSorting>) => void;
  setViewPreferences: (preferences: Partial<DocumentViewPreferences>) => void;

  // Search
  searchDocuments: (query: string) => void;
  getRecentDocuments: (limit?: number) => DocumentFile[];

  // Storage
  fetchStorageInfo: () => Promise<void>;
  cleanupStorage: () => Promise<void>;

  // Utils
  getFilteredDocuments: () => DocumentFile[];
  getDocumentsByFolder: (folderId?: string) => DocumentFile[];
  getFolderPath: (folderId?: string) => DocumentFolder[];
  getDocumentPreviewUrl: (document: DocumentFile) => string | null;
  formatFileSize: (bytes: number) => string;
  clearError: () => void;
}

// Constants
export const DOCUMENT_TYPES: Record<
  DocumentType,
  { label: string; icon: string; color: string }
> = {
  PDF: { label: "PDF", icon: "file-pdf-o", color: "#ef4444" },
  Image: { label: "Image", icon: "file-image-o", color: "#22c55e" },
  Contrat: { label: "Contrat", icon: "file-text", color: "#3b82f6" },
  Permis: { label: "Permis", icon: "credit-card", color: "#f59e0b" },
  Assurance: { label: "Assurance", icon: "shield", color: "#8b5cf6" },
  Autre: { label: "Autre", icon: "file-o", color: "#6b7280" },
};

export const MIME_TYPES = {
  PDF: ["application/pdf"],
  Image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
  Contrat: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  Permis: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
  Assurance: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
  Autre: ["*/*"],
};

export const DEFAULT_FOLDERS = [
  { name: "Documents personnels", icon: "user", color: "#3b82f6" },
  { name: "Documents véhicule", icon: "car", color: "#22c55e" },
  { name: "Projets", icon: "folder", color: "#f59e0b" },
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const TOTAL_STORAGE_LIMIT = 100 * 1024 * 1024; // 100MB
