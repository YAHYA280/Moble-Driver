// store/profileStore.ts
import { create } from "zustand";
import {
  PersonalInfo,
  ProfileActions,
  ProfileState,
  UserProfile,
} from "../shared/types/profile";

type ProfileStore = ProfileState & ProfileActions;

// Mock data for profile
const mockProfile: UserProfile = {
  personalInfo: {
    id: "1",
    fullName: "Jean Jacques Martin",
    firstName: "Jean Jacques",
    lastName: "Martin",
    email: "chauffeur@gmail.com",
    phoneNumber: "+14532442224",
    address: "123 Rue de la Paix, Casablanca, Maroc",
    profilePhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    dateOfBirth: "15/03/1985",
    nationality: "Marocaine",
  },
  professionalInfo: {
    driverId: "836579376558449",
    driverLicense: "L123456789",
    hireDate: "01/01/2020",
    position: "Chauffeur Interne",
    status: "Actif",
    contractType: "CDI",
    department: "Transport",
    yearsOfExperience: 10,
  },
  accountSettings: {
    id: "1",
    emailNotifications: true,
    smsNotifications: false,
    language: "fr",
    darkMode: false,
    biometricAuth: true,
    twoFactorAuth: false,
  },
  modificationHistory: [
    {
      id: "1",
      modificationDate: "2025-01-10 14:30",
      modificationType: "personal",
      modifiedBy: "Jean Jacques Martin",
      changes: [
        {
          field: "phoneNumber",
          oldValue: "+14532442223",
          newValue: "+14532442224",
        },
      ],
    },
    {
      id: "2",
      modificationDate: "2025-01-05 09:15",
      modificationType: "settings",
      modifiedBy: "Jean Jacques Martin",
      changes: [
        {
          field: "emailNotifications",
          oldValue: "false",
          newValue: "true",
        },
      ],
    },
    {
      id: "3",
      modificationDate: "2025-01-01 10:00",
      modificationType: "personal",
      modifiedBy: "Jean Jacques Martin",
      changes: [
        {
          field: "address",
          oldValue: "456 Avenue Hassan II, Rabat",
          newValue: "123 Rue de la Paix, Casablanca, Maroc",
        },
        {
          field: "dateOfBirth",
          oldValue: "",
          newValue: "15/03/1985",
        },
      ],
    },
  ],
  lastUpdated: "2025-01-10 14:30",
  isVerified: true,
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  // State
  profile: mockProfile,
  isLoading: false,
  error: null,
  isEditMode: false,
  pendingChanges: {},

  // Actions
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({
        profile: mockProfile,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement du profil",
        isLoading: false,
      });
    }
  },

  updatePersonalInfo: async (info: Partial<PersonalInfo>) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      set((state) => {
        if (!state.profile) return state;

        const updatedProfile = {
          ...state.profile,
          personalInfo: {
            ...state.profile.personalInfo,
            ...info,
          },
          lastUpdated: new Date().toLocaleString("fr-FR"),
        };

        // Add to modification history
        const changes = Object.entries(info).map(([field, newValue]) => ({
          field,
          oldValue: (state.profile!.personalInfo as any)[field] || "",
          newValue: newValue as string,
        }));

        const newModification = {
          id: `mod_${Date.now()}`,
          modificationDate: new Date().toLocaleString("fr-FR"),
          modificationType: "personal" as const,
          modifiedBy: state.profile.personalInfo.fullName,
          changes,
        };

        updatedProfile.modificationHistory = [
          newModification,
          ...state.profile.modificationHistory,
        ];

        return {
          profile: updatedProfile,
          isLoading: false,
          isEditMode: false,
          pendingChanges: {},
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour du profil",
        isLoading: false,
      });
    }
  },

  updateAccountSettings: async (settings) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        if (!state.profile) return state;

        const updatedProfile = {
          ...state.profile,
          accountSettings: {
            ...state.profile.accountSettings,
            ...settings,
          },
          lastUpdated: new Date().toLocaleString("fr-FR"),
        };

        return {
          profile: updatedProfile,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour des paramètres",
        isLoading: false,
      });
    }
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate password validation
      if (oldPassword !== "password123") {
        throw new Error("Ancien mot de passe incorrect");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      set((state) => {
        if (!state.profile) return state;

        const newModification = {
          id: `mod_${Date.now()}`,
          modificationDate: new Date().toLocaleString("fr-FR"),
          modificationType: "password" as const,
          modifiedBy: state.profile.personalInfo.fullName,
          changes: [
            {
              field: "password",
              oldValue: "********",
              newValue: "********",
            },
          ],
        };

        const updatedProfile = {
          ...state.profile,
          modificationHistory: [
            newModification,
            ...state.profile.modificationHistory,
          ],
          lastUpdated: new Date().toLocaleString("fr-FR"),
        };

        return {
          profile: updatedProfile,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors du changement de mot de passe",
        isLoading: false,
      });
    }
  },

  uploadProfilePhoto: async (photo: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      set((state) => {
        if (!state.profile) return state;

        const updatedProfile = {
          ...state.profile,
          personalInfo: {
            ...state.profile.personalInfo,
            profilePhoto: photo,
          },
          lastUpdated: new Date().toLocaleString("fr-FR"),
        };

        return {
          profile: updatedProfile,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du téléchargement de la photo",
        isLoading: false,
      });
    }
  },

  deleteProfilePhoto: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        if (!state.profile) return state;

        const updatedProfile = {
          ...state.profile,
          personalInfo: {
            ...state.profile.personalInfo,
            profilePhoto: undefined,
          },
          lastUpdated: new Date().toLocaleString("fr-FR"),
        };

        return {
          profile: updatedProfile,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la suppression de la photo",
        isLoading: false,
      });
    }
  },

  toggleEditMode: () => {
    set((state) => ({
      isEditMode: !state.isEditMode,
      pendingChanges: !state.isEditMode ? {} : state.pendingChanges,
    }));
  },

  setPendingChanges: (changes: Partial<PersonalInfo>) => {
    set((state) => ({
      pendingChanges: { ...state.pendingChanges, ...changes },
    }));
  },

  clearPendingChanges: () => {
    set({ pendingChanges: {} });
  },

  clearError: () => {
    set({ error: null });
  },
}));
