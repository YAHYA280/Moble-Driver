// screens/innerApplication/fuelCards/receiptFormScreen.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { Input } from "../../../shared/components/ui/Input";
import { PaymentMethod } from "../../../shared/types/fuelCard";
import { useFuelCardStore } from "../../../store/fuelCardStore";
import { useVehicleStore } from "../../../store/vehicleStore";

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

export const ReceiptFormScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id, cardId } = useLocalSearchParams<{ id: string; cardId: string }>();
  const {
    selectedFuelCard,
    selectedReceipt,
    selectFuelCard,
    selectReceipt,
    fuelCards,
    addReceipt,
    updateReceipt,
    isLoading,
    error,
  } = useFuelCardStore();
  const { vehicles } = useVehicleStore();

  const headerAnim = useRef(new Animated.Value(0)).current;
  const isEditing = id !== "new";

  // Form state
  const [amount, setAmount] = useState("");
  const [stationName, setStationName] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Carte carburant");
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [photoUri, setPhotoUri] = useState<string | undefined>();

  useEffect(() => {
    // Set up fuel card if not already selected
    if (!selectedFuelCard && cardId) {
      const fuelCard = fuelCards.find((fc) => fc.id === cardId);
      if (fuelCard) {
        selectFuelCard(fuelCard);
      }
    }

    // Set up receipt if editing
    if (isEditing && id && selectedFuelCard) {
      const receipt = selectedFuelCard.receipts.find((r) => r.id === id);
      if (receipt) {
        selectReceipt(receipt);
        setAmount(receipt.amount.toString());
        setStationName(receipt.stationName || "");
        setPaymentMethod(receipt.paymentMethod);
        setVehiclePlateNumber(receipt.vehiclePlateNumber || "");
        setNotes(receipt.notes || "");
        setPhotoUri(receipt.photoUri);
      } else {
        router.back();
        return;
      }
    }

    // Set default vehicle if available
    if (!isEditing && vehicles.length > 0 && !vehiclePlateNumber) {
      setVehiclePlateNumber(vehicles[0].plateNumber);
    }

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [selectedFuelCard, cardId, id, isEditing, vehicles]);

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin d'accéder à votre appareil photo."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accéder à l'appareil photo");
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin d'accéder à votre galerie."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accéder à la galerie");
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUri(undefined);
  };

  const handleSubmit = async () => {
    if (!selectedFuelCard) {
      Alert.alert("Erreur", "Carte carburant non trouvée");
      return;
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Erreur", "Veuillez saisir un montant valide");
      return;
    }

    const now = new Date();
    const receiptData = {
      amount: numAmount,
      date: now.toLocaleDateString("fr-FR"),
      time: now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      stationName: stationName.trim() || undefined,
      paymentMethod,
      vehiclePlateNumber: vehiclePlateNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      photoUri,
    };

    try {
      if (isEditing && selectedReceipt) {
        await updateReceipt(
          selectedFuelCard.id,
          selectedReceipt.id,
          receiptData
        );
      } else {
        await addReceipt(selectedFuelCard.id, receiptData);
      }
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de l'enregistrement");
    }
  };

  const paymentMethods: {
    value: PaymentMethod;
    label: string;
    color: string;
  }[] = [
    {
      value: "Carte carburant",
      label: "Carte carburant",
      color: colors.primary,
    },
    {
      value: "Hors carte",
      label: "Hors carte (de ma poche)",
      color: colors.error,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    paymentMethodContainer: {
      flexDirection: "row",
      gap: 12,
    },
    paymentMethodButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 2,
    },
    paymentMethodIcon: {
      marginRight: 8,
    },
    paymentMethodText: {
      fontSize: 14,
      fontWeight: "600",
    },
    photoSection: {
      marginBottom: 24,
    },
    photoButtons: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    photoButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
      borderWidth: 2,
      borderColor: colors.primary + "30",
      borderStyle: "dashed",
    },
    photoButtonIcon: {
      marginRight: 8,
    },
    photoButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    photoPreview: {
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
    },
    photoImage: {
      width: "100%",
      height: 200,
      borderRadius: 12,
    },
    removePhotoButton: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: colors.error,
      borderRadius: 16,
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    submitButton: {
      marginBottom: 32,
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

  if (!selectedFuelCard) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
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
          title={isEditing ? "Modifier reçu" : "Ajouter reçu"}
        />
      </Animated.View>

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Content */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View style={[{ flex: 1 }, { opacity: headerAnim }]}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Amount Input */}
            <AnimatedFormSection delay={200}>
              <Input
                label="Montant (DA)"
                value={amount}
                onChangeText={setAmount}
                placeholder="Ex: 2500"
                keyboardType="numeric"
                required
              />
            </AnimatedFormSection>

            {/* Station Name */}
            <AnimatedFormSection delay={300}>
              <Input
                label="Nom de la station"
                value={stationName}
                onChangeText={setStationName}
                placeholder="Ex: Station Shell Centre-ville"
              />
            </AnimatedFormSection>

            {/* Vehicle Selection */}
            <AnimatedFormSection delay={400}>
              <Input
                label="Numéro de plaque"
                value={vehiclePlateNumber}
                onChangeText={setVehiclePlateNumber}
                placeholder="Ex: 95700L15"
              />
            </AnimatedFormSection>

            {/* Payment Method */}
            <AnimatedFormSection delay={500}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Méthode de paiement</Text>
                <View style={styles.paymentMethodContainer}>
                  {paymentMethods.map((method) => (
                    <TouchableOpacity
                      key={method.value}
                      style={[
                        styles.paymentMethodButton,
                        {
                          backgroundColor:
                            paymentMethod === method.value
                              ? method.color + "20"
                              : colors.surface,
                          borderColor:
                            paymentMethod === method.value
                              ? method.color
                              : colors.border,
                        },
                      ]}
                      onPress={() => setPaymentMethod(method.value)}
                      activeOpacity={0.7}
                    >
                      <FontAwesome
                        name={
                          method.value === "Carte carburant"
                            ? "credit-card"
                            : "money"
                        }
                        size={14}
                        color={
                          paymentMethod === method.value
                            ? method.color
                            : colors.textSecondary
                        }
                        style={styles.paymentMethodIcon}
                      />
                      <Text
                        style={[
                          styles.paymentMethodText,
                          {
                            color:
                              paymentMethod === method.value
                                ? method.color
                                : colors.textSecondary,
                          },
                        ]}
                      >
                        {method.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </AnimatedFormSection>

            {/* Photo Section */}
            <AnimatedFormSection delay={600}>
              <View style={styles.photoSection}>
                <Text style={styles.sectionTitle}>Photo du reçu</Text>
                <ConditionalComponent
                  isValid={!photoUri}
                  defaultComponent={
                    <View style={styles.photoPreview}>
                      <Image
                        source={{ uri: photoUri }}
                        style={styles.photoImage}
                      />
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={handleRemovePhoto}
                      >
                        <FontAwesome name="times" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  }
                >
                  <View style={styles.photoButtons}>
                    <TouchableOpacity
                      style={styles.photoButton}
                      onPress={handleTakePhoto}
                      activeOpacity={0.7}
                    >
                      <FontAwesome
                        name="camera"
                        size={16}
                        color={colors.primary}
                        style={styles.photoButtonIcon}
                      />
                      <Text style={styles.photoButtonText}>Prendre photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.photoButton}
                      onPress={handlePickImage}
                      activeOpacity={0.7}
                    >
                      <FontAwesome
                        name="image"
                        size={16}
                        color={colors.primary}
                        style={styles.photoButtonIcon}
                      />
                      <Text style={styles.photoButtonText}>Galerie</Text>
                    </TouchableOpacity>
                  </View>
                </ConditionalComponent>
              </View>
            </AnimatedFormSection>

            {/* Notes */}
            <AnimatedFormSection delay={700}>
              <Input
                label="Notes (optionnel)"
                value={notes}
                onChangeText={setNotes}
                placeholder="Commentaires additionnels..."
                multiline
                numberOfLines={3}
              />
            </AnimatedFormSection>

            {/* Submit Button */}
            <AnimatedFormSection delay={800}>
              <View style={styles.submitButton}>
                <Button
                  title={isEditing ? "Modifier reçu" : "Ajouter reçu"}
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={!amount || isLoading}
                />
              </View>
            </AnimatedFormSection>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
