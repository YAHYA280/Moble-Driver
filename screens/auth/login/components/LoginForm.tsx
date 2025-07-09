import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { Button } from "../../../../shared/components/ui/Button";
import { Checkbox } from "../../../../shared/components/ui/Checkbox";
import { Input } from "../../../../shared/components/ui/Input";
import { useAuthStore } from "../../../../store/authStore";
import { validateEmail, validatePassword } from "../../../../utils/validators";

export const LoginForm: React.FC = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("Loisbecket@gmail.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { login, isLoading, error } = useAuthStore();

  const formFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const formAnimation = Animated.timing(formFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    const buttonAnimation = Animated.timing(buttonFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    formAnimation.start();

    setTimeout(() => {
      buttonAnimation.start();
    }, 400);
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login({ email, password, rememberMe });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    formSection: {
      flex: 1,
      justifyContent: "flex-start",
    },
    inputsContainer: {
      marginBottom: 24,
    },
    optionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 32,
      paddingHorizontal: 4,
      minHeight: 32,
    },
    checkboxWrapper: {
      flex: 1,
      marginRight: 12,
      justifyContent: "center",
      alignItems: "flex-start",
    },
    forgotPasswordWrapper: {
      justifyContent: "center",
      alignItems: "flex-end",
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    forgotPassword: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: "600",
      textAlign: "right",
      ...Platform.select({
        android: {
          includeFontPadding: false,
          textAlignVertical: "center",
        },
      }),
    },
    errorContainer: {
      marginVertical: 16,
      paddingHorizontal: 4,
    },
    errorText: {
      fontSize: 14,
      color: colors.error,
      textAlign: "center",
      lineHeight: 20,
    },
    buttonsSection: {
      marginTop: "auto",
      paddingTop: 24,
      paddingBottom: Platform.OS === "android" ? 32 : 16,
    },
  });

  return (
    <View style={styles.container}>
      {/* Form Section - All content including button */}
      <View style={styles.formSection}>
        {/* Form Inputs */}
        <Animated.View
          style={[styles.inputsContainer, { opacity: formFadeAnim }]}
        >
          <Input
            label="Adresse e-mail ou Nom d'utilisateur"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            isPassword
            showPasswordToggle
            error={errors.password}
          />
        </Animated.View>

        {/* Options Row - Above button */}
        <Animated.View
          style={[styles.optionsContainer, { opacity: formFadeAnim }]}
        >
          <View style={styles.checkboxWrapper}>
            <Checkbox
              checked={rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
              label="Se souvenir de moi"
              size="medium"
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordWrapper}
            onPress={() => router.push("/auth/forgot-password")}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Error Message */}
        <ConditionalComponent isValid={Boolean(error)}>
          <Animated.View
            style={[styles.errorContainer, { opacity: formFadeAnim }]}
          >
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        </ConditionalComponent>

        {/* Button Section - Within form section, at bottom */}
        <Animated.View
          style={[styles.buttonsSection, { opacity: buttonFadeAnim }]}
        >
          <Button
            title="Se connecter"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
          />
        </Animated.View>
      </View>
    </View>
  );
};
