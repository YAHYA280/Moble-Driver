// screens/innerApplication/calendar/components/DayAppointmentsModal.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Appointment } from "../../../../shared/types/calendar";
import { AppointmentCard } from "./AppointmentCard";

const { height: screenHeight } = Dimensions.get("window");

// Separate component for animated appointment item
const AnimatedAppointmentItem: React.FC<{
  item: Appointment;
  index: number;
  onPress: (appointment: Appointment) => void;
}> = ({ item, index, onPress }) => {
  const itemAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(itemAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, 100);

    return () => clearTimeout(timer);
  }, [index, itemAnim]);

  return (
    <Animated.View
      style={{
        opacity: itemAnim,
        transform: [
          {
            translateY: itemAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      }}
    >
      <AppointmentCard
        appointment={item}
        onPress={() => onPress(item)}
        showDate={false}
        style={{ marginHorizontal: 0, marginVertical: 6 }}
      />
    </Animated.View>
  );
};

interface DayAppointmentsModalProps {
  visible: boolean;
  date: string;
  appointments: Appointment[];
  onClose: () => void;
  onAppointmentPress: (appointment: Appointment) => void;
}

export const DayAppointmentsModal: React.FC<DayAppointmentsModalProps> = ({
  visible,
  date,
  appointments,
  onClose,
  onAppointmentPress,
}) => {
  const colors = useThemeColors();
  const modalAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(contentAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(contentAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, overlayAnim, contentAnim]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderAppointmentItem = ({
    item,
    index,
  }: {
    item: Appointment;
    index: number;
  }) => (
    <AnimatedAppointmentItem
      item={item}
      index={index}
      onPress={onAppointmentPress}
    />
  );

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
      maxHeight: screenHeight * 0.8,
      minHeight: screenHeight * 0.4,
      paddingTop: 8,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.15,
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
    countText: {
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
    listContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 16,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.modalOverlay, { opacity: overlayAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: contentAnim }],
                },
              ]}
            >
              {/* Handle */}
              <View style={styles.handle} />

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTitle}>
                  <Text style={styles.dateText}>{formatDate(date)}</Text>
                  <Text style={styles.countText}>
                    {appointments.length} rendez-vous
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <FontAwesome
                    name="times"
                    size={14}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Content */}
              {appointments.length > 0 ? (
                <FlatList
                  data={appointments}
                  renderItem={renderAppointmentItem}
                  keyExtractor={(item) => item.id}
                  style={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📅</Text>
                  <Text style={styles.emptyTitle}>Aucun rendez-vous</Text>
                  <Text style={styles.emptyText}>
                    Vous n&apos;avez aucun rendez-vous prévu pour cette date.
                  </Text>
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
