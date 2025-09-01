import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { DEMANDE_TYPES, DemandeType } from "../../../shared/types/demande";
import { useDemandeStore } from "../../../store/demandeStore";
import { AttachmentManager } from "./components/AttachmentManager";
import { DemandeForm } from "./components/DemandeForm";
import { DemandeTypeSelector } from "./components/DemandeTypeSelector";

interface SelectedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

interface FormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  employeeComment: string;
}

export const AddDemandeScreen: React.FC = () => {
  const { colors } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const [selectedType, setSelectedType] = useState<DemandeType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    employeeComment: "",
  });
  const [attachments, setAttachments] = useState<SelectedFile[]>([]);

  const { createDemande, isSubmitting, error } = useDemandeStore();

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 200);
  }, []);

  const handleTypeSelect = (type: DemandeType) => {
    setSelectedType(type);

    const typeConfig = DEMANDE_TYPES[type];
    setFormData((prev) => ({
      ...prev,
      title: `Demande de ${typeConfig.label.toLowerCase()}`,
    }));
  };

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };

      if (data.startDate && prev.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(prev.endDate);
        if (startDate >= endDate) {
          newData.endDate = "";
        }
      }

      if (data.endDate && prev.startDate) {
        const startDate = new Date(prev.startDate);
        const endDate = new Date(data.endDate);
        if (endDate <= startDate) {
          Alert.alert(
            "Erreur de date",
            "La date de fin doit être postérieure à la date de début"
          );
          return prev;
        }
      }

      return newData;
    });
  };

  const validateForm = (): string | null => {
    if (!selectedType) return "Veuillez sélectionner un type de demande";
    if (!formData.title.trim()) return "Le titre est requis";
    if (!formData.startDate) return "La date de début est requise";
    if (!formData.endDate) return "La date de fin est requise";

    const typeConfig = DEMANDE_TYPES[selectedType];
    if (typeConfig.requiresJustification && !formData.employeeComment.trim()) {
      return "Un motif est requis pour ce type de demande";
    }

    if (typeConfig.requiresJustification && attachments.length === 0) {
      return "Un justificatif est requis pour ce type de demande";
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    if (startDate > endDate) {
      return "La date de début doit être antérieure à la date de fin";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert("Erreur", validationError);
      return;
    }

    try {
      // Convert attachments to File objects
      const files: File[] = [];
      attachments.forEach((attachment) => {
        // In a real app, you'd properly convert the attachment to a File
        const file = new File([attachment.uri], attachment.name, {
          type: attachment.type,
        });
        files.push(file);
      });

      await createDemande({
        type: selectedType!,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        employeeComment: formData.employeeComment.trim() || undefined,
        attachments: files,
        // Removed: isUrgent
      });

      Alert.alert("Succès", "Votre demande a été soumise avec succès", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la soumission de la demande");
    }
  };

  const canSubmit =
    selectedType &&
    formData.title.trim() &&
    formData.startDate &&
    formData.endDate &&
    !isSubmitting;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 60, // Increased bottom padding
    },
    step: {
      marginBottom: 32,
    },
    stepIndicator: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    stepNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      marginRight: 12,
    },
    stepNumberText: {
      fontSize: 14,
      fontWeight: "600",
      color: "white",
    },
    stepTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    submitSection: {
      marginTop: 40,
      marginBottom: 40,
    },
    submitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    submitButtonDisabled: {
      backgroundColor: colors.textTertiary,
      opacity: 0.6,
    },
    submitButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    loadingText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    errorContainer: {
      backgroundColor: colors.error + "15",
      margin: 16,
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}
      >
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Nouvelle demande"
        />
      </Animated.View>

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: contentAnim }]}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Step 1: Type Selection */}
          <View style={styles.step}>
            <View style={styles.stepIndicator}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepTitle}>Type de demande</Text>
            </View>

            <DemandeTypeSelector
              selectedType={selectedType}
              onTypeSelect={handleTypeSelect}
            />
          </View>

          {/* Step 2: Form Details */}
          <ConditionalComponent isValid={!!selectedType}>
            <View style={styles.step}>
              <View style={styles.stepIndicator}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Détails de la demande</Text>
              </View>

              <DemandeForm
                data={formData}
                selectedType={selectedType!}
                onDataChange={handleFormDataChange}
              />
            </View>
          </ConditionalComponent>

          {/* Step 3: Attachments */}
          <ConditionalComponent isValid={!!selectedType}>
            <View style={styles.step}>
              <View style={styles.stepIndicator}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepTitle}>Pièces justificatives</Text>
              </View>

              <AttachmentManager
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                requiresJustification={
                  selectedType
                    ? DEMANDE_TYPES[selectedType].requiresJustification
                    : false
                }
              />
            </View>
          </ConditionalComponent>

          {/* Submit Button - Now in scrollable area */}
          <ConditionalComponent isValid={!!selectedType}>
            <View style={styles.submitSection}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !canSubmit && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!canSubmit}
                activeOpacity={0.8}
              >
                <ConditionalComponent
                  isValid={isSubmitting}
                  defaultComponent={
                    <Text style={styles.submitButtonText}>
                      Soumettre la demande
                    </Text>
                  }
                >
                  <Text style={styles.loadingText}>Envoi en cours...</Text>
                </ConditionalComponent>
              </TouchableOpacity>
            </View>
          </ConditionalComponent>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
