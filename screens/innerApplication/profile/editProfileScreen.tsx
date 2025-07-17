// screens/innerApplication/profile/editProfileScreen.tsx
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { PersonalInfo } from "../../../shared/types/profile";
import { useProfileStore } from "../../../store/profileStore";
import { validateEmail } from "../../../utils/validators";
import { EditProfileFormSection } from "./components/edit/EditProfileFormSection";
import { EditProfilePhotoSection } from "./components/edit/EditProfilePhotoSection";
import { StatusDropdownModal } from "./components/edit/StatusDropdownModal";
import { StatusSelectorSection } from "./components/edit/StatusSelectorSection";

interface StatusOption {
  label: string;
  value: "Actif" | "En congé" | "Inactif";
}

interface FormField {
  key:
    | "fullName"
    | "email"
    | "phoneNumber"
    | "driverId"
    | "yearsOfExperience"
    | "status";
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
  error?: string;
}

export const EditProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const {
    profile,
    updatePersonalInfo,
    uploadProfilePhoto,
    isLoading,
    error,
    clearError,
  } = useProfileStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const photoAnim = useRef(new Animated.Value(0)).current;
  const slideInAnim = useRef(new Animated.Value(50)).current;

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    driverId: "",
    status: "Actif" as "Actif" | "En congé" | "Inactif",
    yearsOfExperience: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    driverId: "",
    status: "",
    yearsOfExperience: "",
  });

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusOptions: StatusOption[] = [
    { label: "Actif", value: "Actif" },
    { label: "En congé", value: "En congé" },
    { label: "Inactif", value: "Inactif" },
  ];

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.personalInfo.fullName,
        phoneNumber: profile.personalInfo.phoneNumber,
        email: profile.personalInfo.email,
        driverId: profile.professionalInfo.driverId,
        status: profile.professionalInfo.status,
        yearsOfExperience:
          profile.professionalInfo.yearsOfExperience.toString(),
      });
    }

    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideInAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(photoAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [profile]);

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      phoneNumber: "",
      email: "",
      driverId: "",
      status: "",
      yearsOfExperience: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Le nom et prénom sont requis";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.driverId.trim()) {
      newErrors.driverId = "Le numéro de permis est requis";
    }

    if (!formData.yearsOfExperience.trim()) {
      newErrors.yearsOfExperience = "Les années d'expérience sont requises";
    } else if (isNaN(Number(formData.yearsOfExperience))) {
      newErrors.yearsOfExperience = "Doit être un nombre";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const updatedInfo: Partial<PersonalInfo> = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      };

      await updatePersonalInfo(updatedInfo);
      Alert.alert("Succès", "Votre profil a été mis à jour avec succès", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (error) {
      clearError();
    }
  };

  const handleStatusSelect = (status: StatusOption) => {
    handleInputChange("status", status.value);
    setShowStatusDropdown(false);
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin de l'autorisation d'accéder à votre galerie pour changer votre photo de profil."
      );
      return false;
    }
    return true;
  };

  const handlePhotoPress = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert("Photo de profil", "Que souhaitez-vous faire ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Prendre une photo",
        onPress: () => openCamera(),
      },
      {
        text: "Choisir dans la galerie",
        onPress: () => openImagePicker(),
      },
    ]);
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission requise",
        "L'autorisation d'accès à la caméra est nécessaire."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadProfilePhoto(result.assets[0].uri);
    }
  };

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadProfilePhoto(result.assets[0].uri);
    }
  };

  if (!profile) {
    return null;
  }

  // Form fields configuration
  const formFields: FormField[] = [
    {
      key: "fullName",
      label: "Nom et prénom",
      value: formData.fullName,
      placeholder: "Saisissez votre nom complet",
      error: errors.fullName,
      editable: true,
    },
    {
      key: "phoneNumber",
      label: "Numéro du téléphone",
      value: formData.phoneNumber,
      placeholder: "Saisissez votre numéro de téléphone",
      keyboardType: "phone-pad",
      error: errors.phoneNumber,
      editable: true,
    },
    {
      key: "email",
      label: "E-mail",
      value: formData.email,
      placeholder: "Saisissez votre email",
      keyboardType: "email-address",
      autoCapitalize: "none",
      error: errors.email,
      editable: true,
    },
    {
      key: "driverId",
      label: "Numéro du permis",
      value: formData.driverId,
      placeholder: "Saisissez votre numéro de permis",
      error: errors.driverId,
      editable: false,
    },
    {
      key: "yearsOfExperience",
      label: "Années d'expériences",
      value: formData.yearsOfExperience,
      placeholder: "Saisissez vos années d'expérience",
      keyboardType: "numeric",
      error: errors.yearsOfExperience,
      editable: true,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    keyboardView: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: Platform.OS === "ios" ? 120 : 80, // Increased bottom padding for iOS
    },
    globalError: {
      backgroundColor: colors.error + "15",
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 20,
      marginBottom: 16, // Reduced from 20 to 16
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    globalErrorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "500",
    },
    buttonContainer: {
      paddingTop: 16, // Reduced from 20 to 16
      paddingHorizontal: 20,
      paddingBottom: Platform.OS === "ios" ? 40 : 20, // Extra padding for iOS
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Modifier mon profil"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideInAnim }],
            },
          ]}
        >
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Profile Photo Section */}
            <Animated.View
              style={{
                transform: [
                  {
                    scale: photoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              }}
            >
              <EditProfilePhotoSection
                profilePhoto={profile.personalInfo.profilePhoto}
                isVerified={profile.isVerified}
                onPhotoPress={handlePhotoPress}
              />
            </Animated.View>

            {/* Error Display */}
            <ConditionalComponent isValid={!!error}>
              <View style={styles.globalError}>
                <Text style={styles.globalErrorText}>{error}</Text>
              </View>
            </ConditionalComponent>

            {/* Form Fields */}
            <EditProfileFormSection
              fields={formFields}
              onFieldChange={handleInputChange}
            />

            {/* Status Selector */}
            <StatusSelectorSection
              status={formData.status}
              onPress={() => setShowStatusDropdown(true)}
            />

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Modifier mon profil"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Status Dropdown Modal */}
      <StatusDropdownModal
        visible={showStatusDropdown}
        currentStatus={formData.status}
        options={statusOptions}
        onSelect={handleStatusSelect}
        onClose={() => setShowStatusDropdown(false)}
      />
    </SafeAreaView>
  );
};
