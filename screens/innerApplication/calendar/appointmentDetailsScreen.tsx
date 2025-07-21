// screens/innerApplication/calendar/appointmentDetailsScreen.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_COLORS,
  APPOINTMENT_TYPE_LABELS,
} from "../../../shared/types/calendar";
import { useCalendarStore } from "../../../store/calendarStore";

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
  }, [selectedAppointment]);

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

  const handleViewConvocation = () => {
    if (selectedAppointment.convocationUrl) {
      Linking.openURL(selectedAppointment.convocationUrl);
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = () => {
    switch (selectedAppointment.status) {
      case "confirme":
        return colors.success;
      case "prevu":
        return colors.warning;
      case "annule":
        return colors.error;
      case "reporte":
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const typeColor = APPOINTMENT_TYPE_COLORS[selectedAppointment.type];

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
      paddingBottom: 120,
    },
    appointmentCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderLeftWidth: 6,
      borderLeftColor: typeColor,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    appointmentHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    appointmentIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: typeColor + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    appointmentInfo: {
      flex: 1,
    },
    appointmentTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    appointmentType: {
      fontSize: 14,
      fontWeight: "600",
      color: typeColor,
      backgroundColor: typeColor + "15",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: "flex-start",
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    statusText: {
      fontSize: 14,
      fontWeight: "600",
    },
    detailsSection: {
      marginBottom: 24,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    detailIcon: {
      width: 24,
      marginRight: 16,
      alignItems: "center",
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    detailSubValue: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 12,
    },
    primaryButton: {
      flex: 1,
    },
    convocationButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.info + "15",
      borderWidth: 1,
      borderColor: colors.info + "30",
    },
    convocationButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.info,
      marginLeft: 8,
    },
    rescheduleModal: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: "100%",
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    modalText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: "center",
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.input,
      marginBottom: 20,
      minHeight: 100,
      textAlignVertical: "top",
    },
    modalButtons: {
      flexDirection: "row",
      gap: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
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
          {/* Main Appointment Card */}
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <View style={styles.appointmentIcon}>
                <FontAwesome name="calendar" size={24} color={typeColor} />
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentTitle}>
                  {selectedAppointment.title}
                </Text>
                <Text style={styles.appointmentType}>
                  {APPOINTMENT_TYPE_LABELS[selectedAppointment.type]}
                </Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor() },
                    ]}
                  />
                  <Text
                    style={[styles.statusText, { color: getStatusColor() }]}
                  >
                    {APPOINTMENT_STATUS_LABELS[selectedAppointment.status]}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <FontAwesome
                    name="calendar-o"
                    size={16}
                    color={colors.textSecondary}
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedAppointment.date)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <FontAwesome
                    name="clock-o"
                    size={16}
                    color={colors.textSecondary}
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Horaire</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(selectedAppointment.startTime)} -{" "}
                    {formatTime(selectedAppointment.endTime)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <FontAwesome
                    name="map-marker"
                    size={16}
                    color={colors.textSecondary}
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Lieu</Text>
                  <Text style={styles.detailValue}>
                    {selectedAppointment.location}
                  </Text>
                  <ConditionalComponent isValid={!!selectedAppointment.center}>
                    <Text style={styles.detailSubValue}>
                      {selectedAppointment.center?.address}
                    </Text>
                  </ConditionalComponent>
                </View>
              </View>

              <ConditionalComponent isValid={!!selectedAppointment.contact}>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <FontAwesome
                      name="user"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Contact</Text>
                    <Text style={styles.detailValue}>
                      {selectedAppointment.contact?.name}
                    </Text>
                    <Text style={styles.detailSubValue}>
                      {selectedAppointment.contact?.role}
                    </Text>
                  </View>
                </View>
              </ConditionalComponent>

              <ConditionalComponent isValid={!!selectedAppointment.description}>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <FontAwesome
                      name="info-circle"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailValue}>
                      {selectedAppointment.description}
                    </Text>
                  </View>
                </View>
              </ConditionalComponent>
            </View>
          </View>

          {/* Actions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>

            <ConditionalComponent
              isValid={selectedAppointment.convocationUrl !== undefined}
            >
              <TouchableOpacity
                style={styles.convocationButton}
                onPress={handleViewConvocation}
                activeOpacity={0.7}
              >
                <FontAwesome name="file-pdf-o" size={16} color={colors.info} />
                <Text style={styles.convocationButtonText}>
                  Voir la convocation
                </Text>
              </TouchableOpacity>
            </ConditionalComponent>

            <ConditionalComponent
              isValid={selectedAppointment.status === "prevu"}
            >
              <View style={styles.actionButtons}>
                <Button
                  title="Confirmer ma présence"
                  onPress={handleConfirmPresence}
                  style={styles.primaryButton}
                  loading={isLoading}
                />
              </View>
            </ConditionalComponent>

            <ConditionalComponent isValid={selectedAppointment.canModify}>
              <View style={styles.actionButtons}>
                <Button
                  title="Demander un report"
                  variant="outline"
                  onPress={() => setShowRescheduleModal(true)}
                  style={styles.primaryButton}
                />
              </View>
            </ConditionalComponent>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Reschedule Modal */}
      <ConditionalComponent isValid={showRescheduleModal}>
        <View style={styles.rescheduleModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Demander un report</Text>
            <Text style={styles.modalText}>
              Veuillez indiquer la raison de votre demande de report :
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Raison du report..."
              placeholderTextColor={colors.textTertiary}
              value={rescheduleReason}
              onChangeText={setRescheduleReason}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Annuler"
                variant="outline"
                onPress={() => {
                  setShowRescheduleModal(false);
                  setRescheduleReason("");
                }}
                style={{ flex: 1 }}
              />
              <Button
                title="Envoyer"
                onPress={handleRequestReschedule}
                style={{ flex: 1 }}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </ConditionalComponent>
    </SafeAreaView>
  );
};
