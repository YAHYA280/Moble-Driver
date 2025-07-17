// screens/innerApplication/profile/editProfileScreen.tsx
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
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

export const EditProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const { profile, updatePersonalInfo, isLoading, error, clearError } =
    useProfileStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const photoAnim = useRef(new Animated.Value(0)).current;

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

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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

  const handlePhotoPress = () => {
    Alert.alert("Photo de profil", "Que souhaitez-vous faire ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Changer la photo",
        onPress: () => {
          // In a real app, you would open image picker here
          Alert.alert("Info", "Fonctionnalité bientôt disponible");
        },
      },
    ]);
  };

  const statusOptions = [
    { label: "Actif", value: "Actif" },
    { label: "En congé", value: "En congé" },
    { label: "Inactif", value: "Inactif" },
  ];

  if (!profile) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 20,
      paddingBottom: 120,
    },
    photoSection: {
      alignItems: "center",
      marginBottom: 32,
      paddingHorizontal: 20,
    },
    photoContainer: {
      position: "relative",
      marginBottom: 16,
    },
    profilePhoto: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.backgroundSecondary,
    },
    photoPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.border,
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
      paddingHorizontal: 20,
    },
    inputContainer: {
      marginBottom: 20,
    },
    statusContainer: {
      marginBottom: 20,
    },
    statusLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
      marginBottom: 8,
      marginLeft: 4,
    },
    statusButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.inputBorder,
      backgroundColor: colors.input,
      minHeight: 46,
    },
    statusText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      paddingBottom: 40,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
      marginLeft: 4,
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

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
              <TouchableOpacity onPress={handlePhotoPress} activeOpacity={0.8}>
                <ConditionalComponent
                  isValid={!!profile.personalInfo.profilePhoto}
                  defaultComponent={
                    <View style={styles.photoPlaceholder}>
                      <FontAwesome
                        name="user"
                        size={40}
                        color={colors.textTertiary}
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
                onPress={() => {
                  Alert.alert(
                    "Sélectionner le statut",
                    "Choisissez votre statut",
                    statusOptions.map((option) => ({
                      text: option.label,
                      onPress: () => handleInputChange("status", option.value),
                    }))
                  );
                }}
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
          </View>
        </ScrollView>

        {/* Fixed Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Modifier mon profil"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};
