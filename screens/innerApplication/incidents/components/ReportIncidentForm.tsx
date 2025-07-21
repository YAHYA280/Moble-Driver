import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { Button } from "../../../../shared/components/ui/Button";
import { IncidentPriority } from "../../../../shared/types/incident";
import { useIncidentStore } from "../../../../store/incidentStore";
import { useVehicleStore } from "../../../../store/vehicleStore";
import { incedentLogoVSN as IncedentLogoVSN } from "./incidentLogo";

const AnimatedFormSection: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [animValue, delay]);

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};

export const ReportIncidentForm: React.FC = () => {
  const { colors } = useTheme();
  const { selectedVehicle, vehicles } = useVehicleStore();
  const { reportIncident, isLoading } = useIncidentStore();

  const [selectedPriority, setSelectedPriority] =
    useState<IncidentPriority>("Faible");
  const [description, setDescription] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

  const priorities: {
    value: IncidentPriority;
    label: string;
    color: string;
    bgColor: string;
  }[] = [
    {
      value: "Faible",
      label: "Faible",
      color: colors.success,
      bgColor: colors.success + "20",
    },
    {
      value: "Moyenne",
      label: "Moyenne",
      color: colors.warning,
      bgColor: colors.warning + "20",
    },
    {
      value: "Élevée",
      label: "Élevée",
      color: colors.error,
      bgColor: colors.error + "20",
    },
  ];

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
      }
    })();
  }, []);

  const handleMediaUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia((prev) => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accéder à la galerie");
    }
  };

  const removeMedia = (index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const vehicleToUse = selectedVehicle || vehicles[0];

    if (!vehicleToUse) {
      Alert.alert("Erreur", "Aucun véhicule disponible");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Erreur", "Veuillez décrire le problème rencontré");
      return;
    }

    try {
      await reportIncident({
        vehicleId: vehicleToUse.id,
        vehiclePlateNumber: vehicleToUse.plateNumber,
        type: "Problème tapis roulant",
        description: description.trim(),
        priority: selectedPriority,
        status: "En Cours",
      });

      router.push("/(tabs)/incidents/success");
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création du signalement"
      );
    }
  };

  const styles = StyleSheet.create({
    content: {
      paddingHorizontal: 24,
      paddingTop: 32,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 32,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginTop: 16,
    },
    vehicleSelector: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
      marginBottom: 24,
    },
    vehiclePlaceholder: {
      flex: 1,
      fontSize: 16,
      color: colors.textTertiary,
    },
    descriptionContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
      marginBottom: 24,
      minHeight: 120,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    descriptionInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      textAlignVertical: "top",
    },
    mediaUpload: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
      marginBottom: 16,
    },
    mediaUploadIcon: {
      marginRight: 12,
    },
    mediaUploadText: {
      fontSize: 16,
      color: colors.textTertiary,
    },
    selectedMediaContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
      marginBottom: 24,
    },
    mediaItem: {
      position: "relative",
      width: 80,
      height: 80,
      borderRadius: 8,
      overflow: "hidden",
    },
    mediaImage: {
      width: "100%",
      height: "100%",
    },
    removeMediaButton: {
      position: "absolute",
      top: 4,
      right: 4,
      backgroundColor: colors.error,
      borderRadius: 10,
      width: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    prioritySection: {
      marginBottom: 32,
    },
    priorityTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    priorityContainer: {
      flexDirection: "row",
      gap: 12,
    },
    priorityButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
    },
    priorityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    priorityText: {
      fontSize: 14,
      fontWeight: "600",
    },
    submitButton: {
      marginBottom: 32,
    },
  });

  const currentVehicle = selectedVehicle || vehicles[0];

  return (
    <View style={styles.content}>
      {/* Logo and Title */}
      <AnimatedFormSection delay={200}>
        <View style={styles.logoContainer}>
          <IncedentLogoVSN width={80} height={80} />
          <Text style={styles.title}>Notifier un problème</Text>
        </View>
      </AnimatedFormSection>

      {/* Vehicle Selector */}
      <AnimatedFormSection delay={400}>
        <TouchableOpacity style={styles.vehicleSelector}>
          <Text style={styles.vehiclePlaceholder}>
            {currentVehicle
              ? currentVehicle.plateNumber
              : "Sélectionnez le véhicule concerné"}
          </Text>
          <FontAwesome
            name="chevron-down"
            size={16}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      </AnimatedFormSection>

      {/* Description Input */}
      <AnimatedFormSection delay={600}>
        <View style={styles.descriptionContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Décrivez en détail le problème rencontré..."
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </AnimatedFormSection>

      {/* Media Upload */}
      <AnimatedFormSection delay={800}>
        <TouchableOpacity
          style={styles.mediaUpload}
          onPress={handleMediaUpload}
        >
          <FontAwesome
            name="camera"
            size={16}
            color={colors.textTertiary}
            style={styles.mediaUploadIcon}
          />
          <Text style={styles.mediaUploadText}>Ajout de photos ou vidéos</Text>
        </TouchableOpacity>

        {/* Selected Media Preview */}
        <ConditionalComponent isValid={selectedMedia.length > 0}>
          <View style={styles.selectedMediaContainer}>
            {selectedMedia.map((uri, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image source={{ uri }} style={styles.mediaImage} />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => removeMedia(index)}
                >
                  <FontAwesome name="times" size={10} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ConditionalComponent>
      </AnimatedFormSection>

      {/* Priority Section */}
      <AnimatedFormSection delay={1000}>
        <View style={styles.prioritySection}>
          <Text style={styles.priorityTitle}>
            L&apos;urgence de l&apos;incident
          </Text>
          <View style={styles.priorityContainer}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.value}
                style={[
                  styles.priorityButton,
                  {
                    backgroundColor:
                      selectedPriority === priority.value
                        ? priority.bgColor
                        : colors.surface,
                    borderColor:
                      selectedPriority === priority.value
                        ? priority.color
                        : colors.border,
                  },
                ]}
                onPress={() => setSelectedPriority(priority.value)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: priority.color },
                  ]}
                />
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color:
                        selectedPriority === priority.value
                          ? priority.color
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </AnimatedFormSection>

      {/* Submit Button */}
      <AnimatedFormSection delay={1200}>
        <View style={styles.submitButton}>
          <Button
            title="Soumettre un problème"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={!description.trim()}
          />
        </View>
      </AnimatedFormSection>
    </View>
  );
};
