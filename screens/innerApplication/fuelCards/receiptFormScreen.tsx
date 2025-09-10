// screens/innerApplication/fuelCards/receiptFormScreen.tsx
import { router, useLocalSearchParams } from "expo-router";
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
import { Input } from "../../../shared/components/ui/Input";
import { PaymentMethod } from "../../../shared/types/fuelCard";
import { useFuelCardStore } from "../../../store/fuelCardStore";
import { useVehicleStore } from "../../../store/vehicleStore";
import { DateTimePickerComponent } from "./components/DateTimePicker";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { PhotoPicker } from "./components/PhotoPicker";

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
  const [isViewMode, setIsViewMode] = useState(isEditing);

  // Form state
  const [amount, setAmount] = useState("");
  const [stationName, setStationName] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Carte carburant");
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [fuelDate, setFuelDate] = useState(new Date());
  const [fuelTime, setFuelTime] = useState(new Date());

  useEffect(() => {
    initializeForm();
    animateHeader();
  }, [selectedFuelCard, cardId, id, isEditing, vehicles]);

  const initializeForm = () => {
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
        populateFormFromReceipt(receipt);
      } else {
        router.back();
        return;
      }
    }

    // Set default vehicle if available
    if (!isEditing && vehicles.length > 0 && !vehiclePlateNumber) {
      setVehiclePlateNumber(vehicles[0].plateNumber);
    }
  };

  const populateFormFromReceipt = (receipt: any) => {
    selectReceipt(receipt);
    setAmount(receipt.amount.toString());
    setStationName(receipt.stationName || "");
    setPaymentMethod(receipt.paymentMethod);
    setVehiclePlateNumber(receipt.vehiclePlateNumber || "");
    setNotes(receipt.notes || "");
    setPhotoUri(receipt.photoUri);

    // Set custom fuel date and time if available
    if (receipt.fuelDate && receipt.fuelTime) {
      const [day, month, year] = receipt.fuelDate.split("/");
      const [hours, minutes] = receipt.fuelTime.split(":");
      const fuelDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      const timeDateTime = new Date();
      timeDateTime.setHours(parseInt(hours), parseInt(minutes));

      setFuelDate(fuelDateTime);
      setFuelTime(timeDateTime);
    }
  };

  const animateHeader = () => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
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
      fuelDate: fuelDate.toLocaleDateString("fr-FR"),
      fuelTime: fuelTime.toLocaleTimeString("fr-FR", {
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

  const getTitle = () => {
    if (isEditing) {
      return isViewMode ? "Détails du reçu" : "Modifier reçu";
    }
    return "Ajouter reçu";
  };

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
    contentOpacity: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    dateTimeContainer: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 24,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 32,
    },
    editButton: {
      flex: 1,
    },
    submitButton: {
      flex: 1,
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
      <Animated.View style={{ opacity: headerAnim }}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title={getTitle()}
        />
      </Animated.View>

      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View style={[{ flex: 1 }, { opacity: headerAnim }]}>
          <View
            style={[styles.contentOpacity, { opacity: isViewMode ? 0.8 : 1 }]}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Input
                label="Montant (DA)"
                value={amount}
                onChangeText={setAmount}
                placeholder="Ex: 2500"
                keyboardType="numeric"
                required
                editable={!isViewMode}
              />

              <View style={styles.dateTimeContainer}>
                <DateTimePickerComponent
                  label="Date du plein"
                  value={fuelDate}
                  onChange={setFuelDate}
                  mode="date"
                  disabled={isViewMode}
                />
                <DateTimePickerComponent
                  label="Heure du plein"
                  value={fuelTime}
                  onChange={setFuelTime}
                  mode="time"
                  disabled={isViewMode}
                />
              </View>

              <Input
                label="Nom de la station"
                value={stationName}
                onChangeText={setStationName}
                placeholder="Ex: Station Shell Centre-ville"
                editable={!isViewMode}
              />

              <Input
                label="Numéro d'immatriculation"
                value={vehiclePlateNumber}
                onChangeText={setVehiclePlateNumber}
                placeholder="Ex: 95700L15"
                editable={!isViewMode}
              />

              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
                disabled={isViewMode}
              />

              <PhotoPicker
                photoUri={photoUri}
                onPhotoChange={setPhotoUri}
                disabled={isViewMode}
              />

              <Input
                label="Notes (optionnel)"
                value={notes}
                onChangeText={setNotes}
                placeholder="Commentaires additionnels..."
                multiline
                numberOfLines={3}
                editable={!isViewMode}
              />

              <View style={styles.buttonContainer}>
                <ConditionalComponent
                  isValid={isEditing}
                  defaultComponent={
                    <View style={styles.submitButton}>
                      <Button
                        title="Ajouter reçu"
                        onPress={handleSubmit}
                        loading={isLoading}
                        disabled={!amount || isLoading}
                      />
                    </View>
                  }
                >
                  <ConditionalComponent
                    isValid={isViewMode}
                    defaultComponent={
                      <>
                        <View style={styles.editButton}>
                          <Button
                            title="Annuler"
                            onPress={() => setIsViewMode(true)}
                            variant="outline"
                          />
                        </View>
                        <View style={styles.submitButton}>
                          <Button
                            title="Enregistrer"
                            onPress={handleSubmit}
                            loading={isLoading}
                            disabled={!amount || isLoading}
                          />
                        </View>
                      </>
                    }
                  >
                    <View style={styles.submitButton}>
                      <Button
                        title="Modifier"
                        onPress={() => setIsViewMode(false)}
                      />
                    </View>
                  </ConditionalComponent>
                </ConditionalComponent>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
