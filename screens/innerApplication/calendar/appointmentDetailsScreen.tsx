import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { useCalendarStore } from "../../../store/calendarStore";
import { AppointmentActionsSection } from "./components/AppointmentActionsSection";
import { AppointmentDetailsCard } from "./components/AppointmentDetailsCard";
import { RescheduleModal } from "./components/RescheduleModal";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
});

export const AppointmentDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    selectedAppointment,
    isLoading,
    confirmAppointment,
    requestReschedule,
    cancelAppointment,
  } = useCalendarStore();

  useEffect(() => {
    if (!selectedAppointment) {
      router.back();
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [selectedAppointment, fadeAnim]);

  if (!selectedAppointment) {
    return null;
  }

  const handleConfirmPresence = async () => {
    Alert.alert(
      "Confirmer la présence",
      "Confirmez-vous votre présence à ce rendez-vous ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            try {
              await confirmAppointment(selectedAppointment.id);
              Alert.alert("Succès", "Votre présence a été confirmée.");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de confirmer votre présence.");
            }
          },
        },
      ]
    );
  };

  const handleRequestReschedule = async () => {
    if (!rescheduleReason.trim()) {
      Alert.alert("Erreur", "Veuillez indiquer une raison pour le report.");
      return;
    }

    try {
      await requestReschedule(selectedAppointment.id, rescheduleReason);
      setShowRescheduleModal(false);
      setRescheduleReason("");
      Alert.alert("Succès", "Votre demande de report a été envoyée.");
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'envoyer la demande de report.");
    }
  };

  const handleCancelReschedule = () => {
    setShowRescheduleModal(false);
    setRescheduleReason("");
  };

  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: colors.backgroundSecondary,
    },
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails du rendez-vous"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <AppointmentDetailsCard appointment={selectedAppointment} />

          <AppointmentActionsSection
            appointment={selectedAppointment}
            isLoading={isLoading}
            onConfirmPresence={handleConfirmPresence}
            onRequestReschedule={() => setShowRescheduleModal(true)}
          />
        </ScrollView>
      </Animated.View>

      <RescheduleModal
        visible={showRescheduleModal}
        reason={rescheduleReason}
        isLoading={isLoading}
        onReasonChange={setRescheduleReason}
        onCancel={handleCancelReschedule}
        onConfirm={handleRequestReschedule}
      />
    </SafeAreaView>
  );
};
