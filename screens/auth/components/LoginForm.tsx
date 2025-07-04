import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "../../../shared/components/ui/Button";
import { Checkbox } from "../../../shared/components/ui/Checkbox";
import { Input } from "../../../shared/components/ui/Input";
import { useAuthStore } from "../../../store/authStore";
import { validateEmail, validatePassword } from "../../../utils/validators";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("Loisbecket@gmail.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { login, isLoading, error } = useAuthStore();

  // Animation values for form elements
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const formFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Stagger the animations for a smooth cascade effect
    const titleAnimation = Animated.timing(titleFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

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

    titleAnimation.start();

    setTimeout(() => {
      formAnimation.start();
    }, 200);

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

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google login not implemented yet");
  };

  return (
    <View style={styles.container}>
      {/* Animated Title Section */}
      <Animated.View style={[styles.titleSection, { opacity: titleFadeAnim }]}>
        <Text style={styles.title}>Connexion</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Pas encore de compte ? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={styles.link}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Animated Form Section */}
      <Animated.View style={[styles.formSection, { opacity: formFadeAnim }]}>
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

        <View style={styles.optionsContainer}>
          <Checkbox
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            label="Se souvenir de moi"
          />

          <TouchableOpacity
            onPress={() => router.push("/auth/forgot-password")}
          >
            <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Error Message */}
      {error && (
        <Animated.View
          style={[styles.errorContainer, { opacity: formFadeAnim }]}
        >
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}

      {/* Animated Buttons Section */}
      <Animated.View
        style={[styles.buttonsSection, { opacity: buttonFadeAnim }]}
      >
        <Button
          title="Se connecter"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Ou</Text>
          <View style={styles.divider} />
        </View>

        <Button
          title="Continue avec Google"
          onPress={handleGoogleLogin}
          variant="secondary"
          disabled={isLoading}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#212b36",
    marginBottom: 12,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#81919a",
    fontWeight: "500",
  },
  link: {
    fontSize: 12,
    color: "#746cd4",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  formSection: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  forgotPassword: {
    fontSize: 12,
    color: "#746cd4",
    fontWeight: "600",
  },
  errorContainer: {
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: "#ff4444",
    textAlign: "center",
  },
  buttonsSection: {
    gap: 14,
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#edf1f3",
  },
  dividerText: {
    fontSize: 12,
    color: "#81919a",
  },
});
