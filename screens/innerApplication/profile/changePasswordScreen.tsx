import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { Input } from "../../../shared/components/ui/Input";
import { useProfileStore } from "../../../store/profileStore";
import { validatePassword } from "../../../utils/validators";

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    keyboardView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: Platform.OS === "ios" ? 40 : 20,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
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
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 32,
      lineHeight: 22,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 20,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 8,
      marginHorizontal: 4,
      textAlign: "center",
      backgroundColor: colors.error + "15",
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    buttonContainer: {
      paddingTop: 8,
    },
  });

const validateFormData = (formData: any) => {
  const newErrors = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  if (!formData.currentPassword) {
    newErrors.currentPassword = "Mot de passe actuel requis";
  }

  if (!formData.newPassword) {
    newErrors.newPassword = "Nouveau mot de passe requis";
  } else if (!validatePassword(formData.newPassword)) {
    newErrors.newPassword =
      "Le mot de passe doit contenir au moins 6 caractères";
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Confirmation requise";
  } else if (formData.newPassword !== formData.confirmPassword) {
    newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  return {
    errors: newErrors,
    isValid: !Object.values(newErrors).some((error) => error !== ""),
  };
};

export const ChangePasswordScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { changePassword, isLoading, error, clearError } = useProfileStore();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const { errors: newErrors, isValid } = validateFormData(formData);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      Alert.alert("Succès", "Votre mot de passe a été modifié avec succès", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {}
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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Modifier le mot de passe"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Modifier votre mot de passe</Text>
            <Text style={styles.subtitle}>
              Saisissez votre mot de passe actuel puis votre nouveau mot de
              passe.
            </Text>

            {/* Global Error */}
            <ConditionalComponent isValid={!!error}>
              <Text style={styles.errorText}>{error}</Text>
            </ConditionalComponent>

            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Input
                label="Mot de passe actuel"
                value={formData.currentPassword}
                onChangeText={(value) =>
                  handleInputChange("currentPassword", value)
                }
                isPassword
                showPasswordToggle
                placeholder="Saisissez votre mot de passe actuel"
                error={errors.currentPassword}
              />
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Input
                label="Nouveau mot de passe"
                value={formData.newPassword}
                onChangeText={(value) =>
                  handleInputChange("newPassword", value)
                }
                isPassword
                showPasswordToggle
                placeholder="Saisissez votre nouveau mot de passe"
                error={errors.newPassword}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Input
                label="Confirmer le nouveau mot de passe"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                isPassword
                showPasswordToggle
                placeholder="Confirmez votre nouveau mot de passe"
                error={errors.confirmPassword}
              />
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Modifier le mot de passe"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={
                  !formData.currentPassword ||
                  !formData.newPassword ||
                  !formData.confirmPassword ||
                  isLoading
                }
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
