// shared/types/profile.ts
export interface PersonalInfo {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface ProfessionalInfo {
  driverId: string;
  driverLicense: string;
  hireDate: string;
  position: string;
  status: "Actif" | "En congé" | "Inactif";
  contractType: string;
  department: string;
  yearsOfExperience: number;
}

export interface AccountSettings {
  id: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  language: "fr" | "en" | "ar";
  darkMode: boolean;
  biometricAuth: boolean;
  twoFactorAuth: boolean;
}

export interface ProfileModificationHistory {
  id: string;
  modificationDate: string;
  modificationType: "personal" | "professional" | "settings" | "password";
  modifiedBy: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export interface UserProfile {
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  accountSettings: AccountSettings;
  modificationHistory: ProfileModificationHistory[];
  lastUpdated: string;
  isVerified: boolean;
}

export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isEditMode: boolean;
  pendingChanges: Partial<PersonalInfo>;
}

export interface ProfileActions {
  fetchProfile: () => Promise<void>;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => Promise<void>;
  updateAccountSettings: (settings: Partial<AccountSettings>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  uploadProfilePhoto: (photo: string) => Promise<void>;
  deleteProfilePhoto: () => Promise<void>;
  toggleEditMode: () => void;
  setPendingChanges: (changes: Partial<PersonalInfo>) => void;
  clearPendingChanges: () => void;
  clearError: () => void;
}

// EditProfileFormSection

export interface FormField {
  key:
    | "fullName"
    | "email"
    | "phoneNumber"
    | "driverId"
    | "dateOfBirth"
    | "address"
    | "status";
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
  error?: string;
}
