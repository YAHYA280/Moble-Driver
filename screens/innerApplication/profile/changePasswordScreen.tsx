// screens/innerApplication/profile/changePasswordScreen.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { Input } from "../../../shared/components/ui/Input";
import { useProfileStore } from "../../../store/profileStore";
import { validatePassword } from "../../../utils/validators";

export const ChangePasswordScreen: React.FC = () => {
  const { colors } = useTheme();
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

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 32,
      lineHeight: 22,
    },
    form: {
      flex: 1,
    },
    inputContainer: {
      marginBottom: 16,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
      marginLeft: 4,
    },
    buttonContainer: {
      paddingVertical: 20,
      paddingBottom: 40,
    },
    securityNote: {
      backgroundColor: colors.info + "15",
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      borderLeftWidth: 4,
      borderLeftColor: colors.info,
    },
    securityNoteTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.info,
      marginBottom: 4,
    },
    securityNoteText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Modifier le mot de passe"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Modifier votre mot de passe</Text>
        <Text style={styles.subtitle}>
          Pour votre sécurité, veuillez saisir votre mot de passe actuel puis
          votre nouveau mot de passe.
        </Text>

        <View style={styles.securityNote}>
          <Text style={styles.securityNoteTitle}>Conseils de sécurité</Text>
          <Text style={styles.securityNoteText}>
            Utilisez un mot de passe fort avec au moins 6 caractères, incluant
            des lettres, des chiffres et des symboles.
          </Text>
        </View>

        <View style={styles.form}>
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
              variant="outlined"
            />
          </View>

          <View style={styles.inputContainer}>
            <Input
              label="Nouveau mot de passe"
              value={formData.newPassword}
              onChangeText={(value) => handleInputChange("newPassword", value)}
              isPassword
              showPasswordToggle
              placeholder="Saisissez votre nouveau mot de passe"
              error={errors.newPassword}
              variant="outlined"
            />
          </View>

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
              variant="outlined"
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Modifier le mot de passe"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={
              !formData.currentPassword ||
              !formData.newPassword ||
              !formData.confirmPassword
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
