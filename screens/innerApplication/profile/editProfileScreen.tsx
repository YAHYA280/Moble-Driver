// screens/innerApplication/profile/editProfileScreen.tsx
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { Input } from "../../../shared/components/ui/Input";
import { PersonalInfo } from "../../../shared/types/profile";
import { useProfileStore } from "../../../store/profileStore";
import { validateEmail } from "../../../utils/validators";

interface StatusOption {
  label: string;
  value: "Actif" | "En congé" | "Inactif";
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
      paddingBottom: 40,
    },
    photoSection: {
      alignItems: "center",
      paddingVertical: 30,
      paddingHorizontal: 20,
    },
    photoContainer: {
      position: "relative",
      marginBottom: 20,
    },
    profilePhoto: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    photoPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.primary + "40",
    },
    editPhotoButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: colors.backgroundSecondary,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    verifiedBadge: {
      position: "absolute",
      top: -5,
      right: -5,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.backgroundSecondary,
    },
    formSection: {
      flex: 1,
      paddingHorizontal: 20,
    },
    inputContainer: {
      marginBottom: 24,
    },
    statusContainer: {
      marginBottom: 24,
    },
    statusLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    statusButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.input,
      minHeight: 48,
    },
    statusText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    buttonContainer: {
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    globalError: {
      backgroundColor: colors.error + "15",
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 20,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    globalErrorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "500",
    },
    // Status Dropdown Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    dropdownContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginHorizontal: 40,
      maxHeight: 300,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    dropdownHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
    },
    dropdownOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    dropdownOptionLast: {
      borderBottomWidth: 0,
    },
    dropdownOptionText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    selectedOption: {
      backgroundColor: colors.primary + "15",
    },
    selectedOptionText: {
      color: colors.primary,
      fontWeight: "600",
    },
    checkIcon: {
      marginLeft: 8,
    },
    dropdownFooter: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    cancelButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
    },
    cancelButtonText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "500",
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
              style={[
                styles.photoSection,
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
              <View style={styles.photoContainer}>
                <TouchableOpacity
                  onPress={handlePhotoPress}
                  activeOpacity={0.8}
                >
                  <ConditionalComponent
                    isValid={!!profile.personalInfo.profilePhoto}
                    defaultComponent={
                      <View style={styles.photoPlaceholder}>
                        <FontAwesome
                          name="user"
                          size={40}
                          color={colors.primary}
                        />
                      </View>
                    }
                  >
                    <Image
                      source={{ uri: profile.personalInfo.profilePhoto }}
                      style={styles.profilePhoto}
                      resizeMode="cover"
                    />
                  </ConditionalComponent>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editPhotoButton}
                  onPress={handlePhotoPress}
                  activeOpacity={0.8}
                >
                  <FontAwesome name="camera" size={14} color="white" />
                </TouchableOpacity>

                <ConditionalComponent isValid={profile.isVerified}>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={14} color="white" />
                  </View>
                </ConditionalComponent>
              </View>
            </Animated.View>

            {/* Error Display */}
            <ConditionalComponent isValid={!!error}>
              <View style={styles.globalError}>
                <Text style={styles.globalErrorText}>{error}</Text>
              </View>
            </ConditionalComponent>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Input
                  label="Nom et prénom"
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange("fullName", value)}
                  placeholder="Saisissez votre nom complet"
                  error={errors.fullName}
                  variant="outlined"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Numéro du téléphone"
                  value={formData.phoneNumber}
                  onChangeText={(value) =>
                    handleInputChange("phoneNumber", value)
                  }
                  placeholder="Saisissez votre numéro de téléphone"
                  keyboardType="phone-pad"
                  error={errors.phoneNumber}
                  variant="outlined"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="E-mail"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  placeholder="Saisissez votre email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  variant="outlined"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Numéro du permis"
                  value={formData.driverId}
                  onChangeText={(value) => handleInputChange("driverId", value)}
                  placeholder="Saisissez votre numéro de permis"
                  error={errors.driverId}
                  variant="outlined"
                  editable={false}
                />
              </View>

              <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Statut</Text>
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() => setShowStatusDropdown(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statusText}>{formData.status}</Text>
                  <FontAwesome
                    name="chevron-down"
                    size={14}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Années d'expériences"
                  value={formData.yearsOfExperience}
                  onChangeText={(value) =>
                    handleInputChange("yearsOfExperience", value)
                  }
                  placeholder="Saisissez vos années d'expérience"
                  keyboardType="numeric"
                  error={errors.yearsOfExperience}
                  variant="outlined"
                />
              </View>

              {/* Submit Button - Now inside ScrollView */}
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
      <Modal
        visible={showStatusDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowStatusDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Sélectionner le statut</Text>
            </View>

            {statusOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownOption,
                  index === statusOptions.length - 1 &&
                    styles.dropdownOptionLast,
                  formData.status === option.value && styles.selectedOption,
                ]}
                onPress={() => handleStatusSelect(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    formData.status === option.value &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                <ConditionalComponent
                  isValid={formData.status === option.value}
                >
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={colors.primary}
                    style={styles.checkIcon}
                  />
                </ConditionalComponent>
              </TouchableOpacity>
            ))}

            <View style={styles.dropdownFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowStatusDropdown(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};
