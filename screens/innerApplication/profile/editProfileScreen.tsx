// screens/innerApplication/profile/editProfileScreen.tsx
import { Input } from "@/shared/components/ui/Input";
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
    dateOfBirth: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    driverId: "",
    status: "",
    dateOfBirth: "",
    address: "",
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
        dateOfBirth: profile.personalInfo.dateOfBirth || "",
        address: profile.personalInfo.address || "",
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
      dateOfBirth: "",
      address: "",
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

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "La date de naissance est requise";
    }

    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
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
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
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
      key: "dateOfBirth",
      label: "Date de naissance",
      value: formData.dateOfBirth,
      placeholder: "Saisissez votre date de naissance (JJ/MM/AAAA)",
      error: errors.dateOfBirth,
      editable: true,
    },
    {
      key: "address",
      label: "Adresse",
      value: formData.address,
      placeholder: "Saisissez votre adresse complète",
      error: errors.address,
      editable: true,
      autoCapitalize: "words",
    },
    {
      key: "driverId",
      label: "Numéro du permis",
      value: formData.driverId,
      placeholder: "Saisissez votre numéro de permis",
      error: errors.driverId,
      editable: false,
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
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: Platform.OS === "ios" ? 60 : 50,
    },
    photoCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.isDark ? "#000000" : colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }),
    },
    formCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.isDark ? "#000000" : colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }),
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    cardSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
      textAlign: "center",
      lineHeight: 20,
    },
    globalError: {
      backgroundColor: colors.error + "15",
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    globalErrorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 16,
    },
    buttonContainer: {
      paddingTop: 8,
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
            {/* Profile Photo Card */}
            <Animated.View
              style={[
                styles.photoCard,
                {
                  transform: [
                    {
                      scale: photoAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <EditProfilePhotoSection
                profilePhoto={profile.personalInfo.profilePhoto}
                isVerified={profile.isVerified}
                onPhotoPress={handlePhotoPress}
              />
            </Animated.View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.cardTitle}>Informations personnelles</Text>
              <Text style={styles.cardSubtitle}>
                Modifiez vos informations personnelles ci-dessous
              </Text>

              {/* Error Display */}
              <ConditionalComponent isValid={!!error}>
                <View style={styles.globalError}>
                  <Text style={styles.globalErrorText}>{error}</Text>
                </View>
              </ConditionalComponent>

              {/* Form Fields */}
              {formFields.map((field) => (
                <View key={field.key} style={styles.inputContainer}>
                  <Input
                    label={field.label}
                    value={field.value}
                    onChangeText={(value) =>
                      handleInputChange(field.key, value)
                    }
                    placeholder={field.placeholder}
                    keyboardType={field.keyboardType}
                    autoCapitalize={field.autoCapitalize}
                    error={field.error}
                    editable={field.editable}
                  />
                </View>
              ))}

              {/* Status Selector */}
              <View style={styles.inputContainer}>
                <StatusSelectorSection
                  status={formData.status}
                  onPress={() => setShowStatusDropdown(true)}
                />
              </View>

              {/* Submit Button */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Modifier mon profil"
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </View>
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
