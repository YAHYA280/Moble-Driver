// store/documentStore.ts

import { create } from "zustand";
import {
  DocumentActions,
  DocumentFile,
  DocumentFilters,
  DocumentFolder,
  DocumentSorting,
  DocumentState,
  StorageInfo,
  TOTAL_STORAGE_LIMIT,
} from "../shared/types/document";

type DocumentStore = DocumentState & DocumentActions;

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const applyFilters = (
  documents: DocumentFile[],
  filters: DocumentFilters,
  currentFolderId: string | null
): DocumentFile[] => {
  let filtered = [...documents];

  // Filter by current folder
  if (currentFolderId !== null) {
    filtered = filtered.filter((doc) => doc.folderId === currentFolderId);
  } else {
    // Show only documents without folder when in root
    filtered = filtered.filter((doc) => !doc.folderId);
  }

  // Apply other filters
  if (filters.type && filters.type.length > 0) {
    filtered = filtered.filter((doc) => filters.type!.includes(doc.type));
  }

  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((doc) => filters.status!.includes(doc.status));
  }

  if (filters.dateFrom) {
    filtered = filtered.filter(
      (doc) => new Date(doc.uploadDate) >= filters.dateFrom!
    );
  }

  if (filters.dateTo) {
    filtered = filtered.filter(
      (doc) => new Date(doc.uploadDate) <= filters.dateTo!
    );
  }

  if (filters.sizeMin) {
    filtered = filtered.filter((doc) => doc.size >= filters.sizeMin!);
  }

  if (filters.sizeMax) {
    filtered = filtered.filter((doc) => doc.size <= filters.sizeMax!);
  }

  if (filters.isFavorite) {
    filtered = filtered.filter((doc) => doc.isFavorite);
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((doc) =>
      filters.tags!.some((tag) => doc.tags.includes(tag))
    );
  }

  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
};

const applySorting = (
  documents: DocumentFile[],
  sorting: DocumentSorting
): DocumentFile[] => {
  const sorted = [...documents].sort((a, b) => {
    let comparison = 0;

    switch (sorting.sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "date":
        comparison =
          new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        break;
      case "size":
        comparison = a.size - b.size;
        break;
      case "type":
        comparison = a.type.localeCompare(b.type);
        break;
      default:
        comparison = 0;
    }

    return sorting.sortOrder === "desc" ? -comparison : comparison;
  });

  return sorted;
};

const calculateStorageInfo = (
  documents: DocumentFile[],
  folders: DocumentFolder[]
): StorageInfo => {
  const usedSpace = documents.reduce((total, doc) => total + doc.size, 0);
  const usedPercentage = Math.round((usedSpace / TOTAL_STORAGE_LIMIT) * 100);

  return {
    usedSpace,
    totalSpace: TOTAL_STORAGE_LIMIT,
    usedPercentage,
    documentsCount: documents.length,
    foldersCount: folders.length,
  };
};

// Generate mock data
const generateMockDocuments = (): DocumentFile[] => {
  const baseDate = new Date();

  return [
    {
      id: "doc_1",
      name: "Confirmation de congé",
      type: "PDF",
      size: 3.2 * 1024 * 1024, // 3.2 MB
      mimeType: "application/pdf",
      url: "/documents/confirmation-conge.pdf",
      uploadDate: new Date(
        baseDate.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      modifiedDate: new Date(
        baseDate.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      tags: ["congé", "officiel"],
      isFavorite: false,
      isShared: false,
      version: 1,
      originalName: "confirmation_conge_mars_2025.pdf",
    },
    {
      id: "doc_2",
      name: "Permis de conduire",
      type: "Permis",
      size: 2.1 * 1024 * 1024, // 2.1 MB
      mimeType: "application/pdf",
      url: "/documents/permis-conduire.pdf",
      uploadDate: new Date(
        baseDate.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      modifiedDate: new Date(
        baseDate.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      expiryDate: new Date(
        baseDate.getTime() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      tags: ["permis", "identité"],
      isFavorite: true,
      isShared: false,
      version: 1,
      originalName: "permis_conduire_scan.pdf",
    },
    {
      id: "doc_3",
      name: "Assurance véhicule",
      type: "Assurance",
      size: 1.8 * 1024 * 1024, // 1.8 MB
      mimeType: "application/pdf",
      url: "/documents/assurance-vehicule.pdf",
      uploadDate: new Date(
        baseDate.getTime() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      modifiedDate: new Date(
        baseDate.getTime() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      expiryDate: new Date(
        baseDate.getTime() + 180 * 24 * 60 * 60 * 1000
      ).toISOString(),
      tags: ["assurance", "véhicule"],
      isFavorite: true,
      isShared: false,
      version: 1,
      originalName: "assurance_auto_2025.pdf",
    },
    {
      id: "doc_4",
      name: "Contrat de travail",
      type: "Contrat",
      size: 4.5 * 1024 * 1024, // 4.5 MB
      mimeType: "application/pdf",
      url: "/documents/contrat-travail.pdf",
      uploadDate: new Date(
        baseDate.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      modifiedDate: new Date(
        baseDate.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      tags: ["contrat", "emploi"],
      isFavorite: false,
      isShared: false,
      version: 1,
      originalName: "contrat_travail_signe.pdf",
    },
    {
      id: "doc_5",
      name: "Photo profil",
      type: "Image",
      size: 0.8 * 1024 * 1024, // 0.8 MB
      mimeType: "image/jpeg",
      url: "/documents/photo-profil.jpg",
      thumbnailUrl: "/documents/thumbs/photo-profil-thumb.jpg",
      uploadDate: new Date(
        baseDate.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      modifiedDate: new Date(
        baseDate.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      tags: ["photo", "profil"],
      isFavorite: false,
      isShared: false,
      version: 1,
      originalName: "IMG_20250320_profile.jpg",
    },
    {
      id: "doc_6",
      name: "Facture téléphone",
      type: "Autre",
      size: 0.5 * 1024 * 1024, // 0.5 MB
      mimeType: "application/pdf",
      url: "/documents/facture-telephone.pdf",
      uploadDate: new Date(
        baseDate.getTime() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      modifiedDate: new Date(
        baseDate.getTime() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      tags: ["facture", "téléphone"],
      isFavorite: false,
      isShared: false,
      version: 1,
      originalName: "facture_orange_mars_2025.pdf",
      folderId: "folder_personal",
    },
  ];
};

const generateMockFolders = (): DocumentFolder[] => {
  return [
    {
      id: "folder_personal",
      name: "Documents personnels",
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      documentsCount: 1,
      color: "#3b82f6",
      icon: "user",
      isShared: false,
      size: 0.5 * 1024 * 1024,
    },
    {
      id: "folder_vehicle",
      name: "Documents véhicule",
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      documentsCount: 0,
      color: "#22c55e",
      icon: "car",
      isShared: false,
      size: 0,
    },
    {
      id: "folder_projects",
      name: "Projets",
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      documentsCount: 0,
      color: "#f59e0b",
      icon: "folder",
      isShared: false,
      size: 0,
    },
  ];
};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // State
  documents: [],
  folders: [],
  filteredDocuments: [],
  filters: {},
  sorting: { sortBy: "date", sortOrder: "desc" },
  viewPreferences: {
    viewMode: "list",
    itemsPerPage: 20,
    showThumbnails: true,
    groupByFolder: false,
  },
  storageInfo: {
    usedSpace: 0,
    totalSpace: TOTAL_STORAGE_LIMIT,
    usedPercentage: 0,
    documentsCount: 0,
    foldersCount: 0,
  },
  selectedDocument: null,
  selectedFolder: null,
  currentFolderId: null,
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  error: null,

  // Actions
  fetchDocuments: async (folderId) => {
    set({ isLoading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockDocuments = generateMockDocuments();
      const mockFolders = generateMockFolders();

      set((state) => {
        const filteredDocuments = applySorting(
          applyFilters(mockDocuments, state.filters, state.currentFolderId),
          state.sorting
        );

        const storageInfo = calculateStorageInfo(mockDocuments, mockFolders);

        return {
          documents: mockDocuments,
          folders: mockFolders,
          filteredDocuments,
          storageInfo,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des documents",
        isLoading: false,
      });
    }
  },

  fetchFolders: async () => {
    set({ isLoading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockFolders = generateMockFolders();

      set({ folders: mockFolders, isLoading: false });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des dossiers",
        isLoading: false,
      });
    }
  },

  uploadDocument: async (file, folderId, metadata) => {
    set({ isUploading: true, uploadProgress: 0, error: null });

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        set({ uploadProgress: progress });
      }

      const newDocument: DocumentFile = {
        id: `doc_${Date.now()}`,
        name: metadata?.name || file.name,
        type: metadata?.type || "Autre",
        size: file.size,
        mimeType: file.type,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        status: "active",
        tags: metadata?.tags || [],
        isFavorite: false,
        folderId,
        isShared: false,
        version: 1,
        originalName: file.name,
        ...metadata,
      };

      set((state) => {
        const updatedDocuments = [...state.documents, newDocument];
        const filteredDocuments = applySorting(
          applyFilters(updatedDocuments, state.filters, state.currentFolderId),
          state.sorting
        );
        const storageInfo = calculateStorageInfo(
          updatedDocuments,
          state.folders
        );

        return {
          documents: updatedDocuments,
          filteredDocuments,
          storageInfo,
          isUploading: false,
          uploadProgress: 0,
        };
      });

      return newDocument;
    } catch (error) {
      set({
        error: "Erreur lors de l'upload du document",
        isUploading: false,
        uploadProgress: 0,
      });
      throw error;
    }
  },

  updateDocument: async (id, updates) => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      set((state) => {
        const updatedDocuments = state.documents.map((doc) =>
          doc.id === id
            ? { ...doc, ...updates, modifiedDate: new Date().toISOString() }
            : doc
        );

        const filteredDocuments = applySorting(
          applyFilters(updatedDocuments, state.filters, state.currentFolderId),
          state.sorting
        );

        return {
          documents: updatedDocuments,
          filteredDocuments,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour du document",
        isLoading: false,
      });
    }
  },

  deleteDocument: async (id) => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const updatedDocuments = state.documents.filter((doc) => doc.id !== id);
        const filteredDocuments = applySorting(
          applyFilters(updatedDocuments, state.filters, state.currentFolderId),
          state.sorting
        );
        const storageInfo = calculateStorageInfo(
          updatedDocuments,
          state.folders
        );

        return {
          documents: updatedDocuments,
          filteredDocuments,
          storageInfo,
          selectedDocument:
            state.selectedDocument?.id === id ? null : state.selectedDocument,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la suppression du document",
        isLoading: false,
      });
    }
  },

  downloadDocument: async (id) => {
    const documentFile = get().documents.find((doc) => doc.id === id);
    if (!documentFile) return;

    try {
      // Simulate download
      const link = document.createElement("a");
      link.href = documentFile.url;
      link.download = documentFile.originalName;
      link.click();
    } catch (error) {
      set({ error: "Erreur lors du téléchargement" });
    }
  },
  duplicateDocument: async (id) => {
    const document = get().documents.find((doc) => doc.id === id);
    if (!document) throw new Error("Document not found");

    const duplicatedDocument: DocumentFile = {
      ...document,
      id: `doc_${Date.now()}`,
      name: `${document.name} (copie)`,
      uploadDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    };

    set((state) => {
      const updatedDocuments = [...state.documents, duplicatedDocument];
      const filteredDocuments = applySorting(
        applyFilters(updatedDocuments, state.filters, state.currentFolderId),
        state.sorting
      );
      const storageInfo = calculateStorageInfo(updatedDocuments, state.folders);

      return {
        documents: updatedDocuments,
        filteredDocuments,
        storageInfo,
      };
    });

    return duplicatedDocument;
  },

  moveDocument: async (id, targetFolderId) => {
    await get().updateDocument(id, { folderId: targetFolderId });
  },

  createFolder: async (name, parentId) => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newFolder: DocumentFolder = {
        id: `folder_${Date.now()}`,
        name,
        parentId,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        documentsCount: 0,
        isShared: false,
        size: 0,
      };

      set((state) => ({
        folders: [...state.folders, newFolder],
        isLoading: false,
      }));

      return newFolder;
    } catch (error) {
      set({
        error: "Erreur lors de la création du dossier",
        isLoading: false,
      });
      throw error;
    }
  },

  updateFolder: async (id, updates) => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      set((state) => ({
        folders: state.folders.map((folder) =>
          folder.id === id
            ? { ...folder, ...updates, modifiedDate: new Date().toISOString() }
            : folder
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour du dossier",
        isLoading: false,
      });
    }
  },

  deleteFolder: async (id) => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        // Also remove documents in this folder
        const updatedDocuments = state.documents.filter(
          (doc) => doc.folderId !== id
        );
        const updatedFolders = state.folders.filter(
          (folder) => folder.id !== id
        );

        const filteredDocuments = applySorting(
          applyFilters(updatedDocuments, state.filters, state.currentFolderId),
          state.sorting
        );
        const storageInfo = calculateStorageInfo(
          updatedDocuments,
          updatedFolders
        );

        return {
          documents: updatedDocuments,
          folders: updatedFolders,
          filteredDocuments,
          storageInfo,
          selectedFolder:
            state.selectedFolder?.id === id ? null : state.selectedFolder,
          currentFolderId:
            state.currentFolderId === id ? null : state.currentFolderId,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la suppression du dossier",
        isLoading: false,
      });
    }
  },

  moveFolder: async (id, targetParentId) => {
    await get().updateFolder(id, { parentId: targetParentId });
  },

  toggleFavorite: async (documentId) => {
    const document = get().documents.find((doc) => doc.id === documentId);
    if (!document) return;

    await get().updateDocument(documentId, {
      isFavorite: !document.isFavorite,
    });
  },

  getFavoriteDocuments: () => {
    return get().documents.filter((doc) => doc.isFavorite);
  },

  navigateToFolder: (folderId) => {
    set((state) => {
      const filteredDocuments = applySorting(
        applyFilters(state.documents, state.filters, folderId),
        state.sorting
      );

      return {
        currentFolderId: folderId,
        filteredDocuments,
      };
    });
  },

  goBack: () => {
    const state = get();
    const currentFolder = state.folders.find(
      (f) => f.id === state.currentFolderId
    );
    const parentId = currentFolder?.parentId || null;
    get().navigateToFolder(parentId);
  },

  selectDocument: (document) => {
    set({ selectedDocument: document });
  },

  selectFolder: (folder) => {
    set({ selectedFolder: folder });
  },

  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredDocuments = applySorting(
        applyFilters(state.documents, updatedFilters, state.currentFolderId),
        state.sorting
      );

      return {
        filters: updatedFilters,
        filteredDocuments,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredDocuments = applySorting(
        applyFilters(state.documents, {}, state.currentFolderId),
        state.sorting
      );

      return {
        filters: {},
        filteredDocuments,
      };
    });
  },

  setSorting: (newSorting) => {
    set((state) => {
      const updatedSorting = { ...state.sorting, ...newSorting };
      const filteredDocuments = applySorting(
        applyFilters(state.documents, state.filters, state.currentFolderId),
        updatedSorting
      );

      return {
        sorting: updatedSorting,
        filteredDocuments,
      };
    });
  },

  setViewPreferences: (newPreferences) => {
    set((state) => ({
      viewPreferences: { ...state.viewPreferences, ...newPreferences },
    }));
  },

  searchDocuments: (query) => {
    get().setFilters({ searchQuery: query });
  },

  getRecentDocuments: (limit = 5) => {
    return get()
      .documents.sort(
        (a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      )
      .slice(0, limit);
  },

  fetchStorageInfo: async () => {
    const state = get();
    const storageInfo = calculateStorageInfo(state.documents, state.folders);
    set({ storageInfo });
  },

  cleanupStorage: async () => {
    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate cleanup by removing old temporary files
      set((state) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days ago

        const updatedDocuments = state.documents.filter((doc) => {
          if (doc.status === "active") return true;
          return new Date(doc.uploadDate) > cutoffDate;
        });

        const filteredDocuments = applySorting(
          applyFilters(updatedDocuments, state.filters, state.currentFolderId),
          state.sorting
        );
        const storageInfo = calculateStorageInfo(
          updatedDocuments,
          state.folders
        );

        return {
          documents: updatedDocuments,
          filteredDocuments,
          storageInfo,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du nettoyage",
        isLoading: false,
      });
    }
  },

  getFilteredDocuments: () => {
    return get().filteredDocuments;
  },

  getDocumentsByFolder: (folderId) => {
    return get().documents.filter((doc) => doc.folderId === folderId);
  },

  getFolderPath: (folderId) => {
    const folders = get().folders;
    const path: DocumentFolder[] = [];

    let currentId = folderId;
    while (currentId) {
      const folder = folders.find((f) => f.id === currentId);
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parentId;
    }

    return path;
  },

  getDocumentPreviewUrl: (document) => {
    if (document.thumbnailUrl) return document.thumbnailUrl;
    if (document.mimeType.startsWith("image/")) return document.url;
    return null;
  },

  formatFileSize,

  clearError: () => {
    set({ error: null });
  },
}));
