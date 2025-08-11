// screens/innerApplication/routeSheets/components/RouteSheetDayModal.tsx

import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";
import { Input } from "../../../../shared/components/ui/Input";
import {
  DayData,
  TIME_SLOTS,
  TIME_SLOT_COLORS,
  TimeSlot,
  TimeSlotData,
} from "../../../../shared/types/routeSheet";
import { useRouteSheetStore } from "../../../../store/routeSheetStore";

const { height: screenHeight } = Dimensions.get("window");

interface RouteSheetDayModalProps {
  visible: boolean;
  day: DayData | null;
  routeSheetId: string;
  readonly?: boolean;
  onClose: () => void;
}

export const RouteSheetDayModal: React.FC<RouteSheetDayModalProps> = ({
  visible,
  day,
  routeSheetId,
  readonly = false,
  onClose,
}) => {
  const colors = useThemeColors();
  const [localTimeSlots, setLocalTimeSlots] = useState<TimeSlotData[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { updateTimeSlotData, saveDayData, isLoading } = useRouteSheetStore();

  useEffect(() => {
    if (day) {
      setLocalTimeSlots([...day.timeSlots]);
      setHasChanges(false);
    }
  }, [day]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleTimeSlotToggle = (timeSlot: TimeSlot) => {
    if (readonly) return;

    setLocalTimeSlots((prev) =>
      prev.map((slot) =>
        slot.timeSlot === timeSlot
          ? { ...slot, isActive: !slot.isActive }
          : slot
      )
    );
    setHasChanges(true);
  };

  const handleKilometrageChange = (
    timeSlot: TimeSlot,
    field: "startKm" | "endKm",
    value: string
  ) => {
    if (readonly) return;

    const numValue = parseInt(value) || 0;
    setLocalTimeSlots((prev) =>
      prev.map((slot) =>
        slot.timeSlot === timeSlot
          ? {
              ...slot,
              kilometrage: {
                ...slot.kilometrage,
                [field]: numValue,
              },
            }
          : slot
      )
    );
    setHasChanges(true);
  };

  const handleOtherTripsChange = (timeSlot: TimeSlot, value: string) => {
    if (readonly) return;

    setLocalTimeSlots((prev) =>
      prev.map((slot) =>
        slot.timeSlot === timeSlot ? { ...slot, otherTrips: value } : slot
      )
    );
    setHasChanges(true);
  };

  const handleCommentsChange = (timeSlot: TimeSlot, value: string) => {
    if (readonly) return;

    setLocalTimeSlots((prev) =>
      prev.map((slot) =>
        slot.timeSlot === timeSlot ? { ...slot, comments: value } : slot
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!day || readonly) return;

    try {
      const updatedDay: DayData = {
        ...day,
        timeSlots: localTimeSlots,
      };

      await saveDayData(day.date, updatedDay);
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error("Error saving day data:", error);
    }
  };

  const handleClose = () => {
    if (hasChanges && !readonly) {
      // Could add a confirmation dialog here
    }
    onClose();
  };

  const validateTimeSlot = (slot: TimeSlotData) => {
    if (!slot.isActive) return true;

    const { startKm, endKm } = slot.kilometrage;
    return startKm > 0 && endKm > startKm;
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: screenHeight * 0.9,
      minHeight: screenHeight * 0.6,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 16,
        },
        android: {
          elevation: 16,
        },
      }),
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textTertiary,
      alignSelf: "center",
      marginTop: 8,
      marginBottom: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      flex: 1,
    },
    dateText: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      textTransform: "capitalize",
    },
    statusText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    timeSlotCard: {
      marginBottom: 16,
      borderRadius: 12,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    timeSlotHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    timeSlotHeaderActive: {
      backgroundColor: colors.surface,
    },
    timeSlotHeaderInactive: {
      backgroundColor: colors.backgroundSecondary,
    },
    timeSlotTitle: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    timeSlotDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
    },
    timeSlotName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    toggleButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    toggleButtonActive: {
      backgroundColor: colors.success + "20",
      borderColor: colors.success,
    },
    toggleButtonInactive: {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.border,
    },
    toggleButtonText: {
      fontSize: 12,
      fontWeight: "600",
    },
    toggleButtonTextActive: {
      color: colors.success,
    },
    toggleButtonTextInactive: {
      color: colors.textSecondary,
    },
    timeSlotContent: {
      padding: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border + "30",
    },
    kilometrageSection: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    kilometrageRow: {
      flexDirection: "row",
      gap: 12,
    },
    kilometrageInput: {
      flex: 1,
    },
    totalKm: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: "center",
    },
    inputSection: {
      marginBottom: 16,
    },
    footerActions: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerButton: {
      flex: 1,
    },
  });

  if (!day) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Handle */}
              <View style={styles.handle} />

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTitle}>
                  <Text style={styles.dateText}>{formatDate(day.date)}</Text>
                  <Text style={styles.statusText}>
                    {day.isCompleted ? "Saisie complétée" : "Saisie en cours"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <FontAwesome
                    name="times"
                    size={14}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {TIME_SLOTS.map((timeSlot) => {
                  const slotData = localTimeSlots.find(
                    (s) => s.timeSlot === timeSlot
                  );
                  if (!slotData) return null;

                  const slotColor = TIME_SLOT_COLORS[timeSlot];
                  const isValid = validateTimeSlot(slotData);
                  const totalKm =
                    slotData.kilometrage.endKm - slotData.kilometrage.startKm;

                  return (
                    <View key={timeSlot} style={styles.timeSlotCard}>
                      {/* Time Slot Header */}
                      <View
                        style={[
                          styles.timeSlotHeader,
                          slotData.isActive
                            ? styles.timeSlotHeaderActive
                            : styles.timeSlotHeaderInactive,
                        ]}
                      >
                        <View style={styles.timeSlotTitle}>
                          <View
                            style={[
                              styles.timeSlotDot,
                              { backgroundColor: slotColor },
                            ]}
                          />
                          <Text style={styles.timeSlotName}>{timeSlot}</Text>
                        </View>

                        <ConditionalComponent isValid={!readonly}>
                          <TouchableOpacity
                            style={[
                              styles.toggleButton,
                              slotData.isActive
                                ? styles.toggleButtonActive
                                : styles.toggleButtonInactive,
                            ]}
                            onPress={() => handleTimeSlotToggle(timeSlot)}
                          >
                            <Text
                              style={[
                                styles.toggleButtonText,
                                slotData.isActive
                                  ? styles.toggleButtonTextActive
                                  : styles.toggleButtonTextInactive,
                              ]}
                            >
                              {slotData.isActive ? "Actif" : "Inactif"}
                            </Text>
                          </TouchableOpacity>
                        </ConditionalComponent>
                      </View>

                      {/* Time Slot Content */}
                      <ConditionalComponent isValid={slotData.isActive}>
                        <View style={styles.timeSlotContent}>
                          {/* Kilométrage Section */}
                          <View style={styles.kilometrageSection}>
                            <Text style={styles.sectionTitle}>Kilométrage</Text>
                            <View style={styles.kilometrageRow}>
                              <Input
                                label="Début (km)"
                                value={slotData.kilometrage.startKm.toString()}
                                onChangeText={(value) =>
                                  handleKilometrageChange(
                                    timeSlot,
                                    "startKm",
                                    value
                                  )
                                }
                                keyboardType="numeric"
                                style={styles.kilometrageInput}
                                disabled={readonly}
                              />
                              <Input
                                label="Fin (km)"
                                value={slotData.kilometrage.endKm.toString()}
                                onChangeText={(value) =>
                                  handleKilometrageChange(
                                    timeSlot,
                                    "endKm",
                                    value
                                  )
                                }
                                keyboardType="numeric"
                                style={styles.kilometrageInput}
                                disabled={readonly}
                              />
                            </View>
                            <ConditionalComponent isValid={totalKm > 0}>
                              <Text style={styles.totalKm}>
                                Total: {totalKm} km
                              </Text>
                            </ConditionalComponent>
                          </View>

                          {/* Other Trips Section */}
                          <View style={styles.inputSection}>
                            <Input
                              label="Autres trajets (optionnel)"
                              value={slotData.otherTrips}
                              onChangeText={(value) =>
                                handleOtherTripsChange(timeSlot, value)
                              }
                              multiline
                              numberOfLines={3}
                              placeholder="Décrivez les autres trajets effectués..."
                              disabled={readonly}
                            />
                          </View>

                          {/* Comments Section */}
                          <View style={styles.inputSection}>
                            <Input
                              label="Commentaires"
                              value={slotData.comments}
                              onChangeText={(value) =>
                                handleCommentsChange(timeSlot, value)
                              }
                              multiline
                              numberOfLines={3}
                              placeholder="Observations, incidents, remarques..."
                              disabled={readonly}
                            />
                          </View>
                        </View>
                      </ConditionalComponent>
                    </View>
                  );
                })}
              </ScrollView>

              {/* Footer Actions */}
              <ConditionalComponent isValid={!readonly}>
                <View style={styles.footerActions}>
                  <Button
                    title="Annuler"
                    variant="outline"
                    onPress={handleClose}
                    style={styles.footerButton}
                  />
                  <Button
                    title={hasChanges ? "Enregistrer" : "Fermer"}
                    onPress={hasChanges ? handleSave : handleClose}
                    loading={isLoading}
                    style={styles.footerButton}
                  />
                </View>
              </ConditionalComponent>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
