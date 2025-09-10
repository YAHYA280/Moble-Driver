import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Header } from "@/shared/components/ui/Header";
import { useGeolocationStore } from "@/store/geolocationStore";

export const TripDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { trips } = useGeolocationStore();
  const trip = trips.find((t) => t.id === id);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return colors.success;
      case "A venir":
        return colors.info;
      case "Termine":
        return colors.textSecondary;
      case "Annule":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "En cours":
        return "play-circle";
      case "A venir":
        return "time";
      case "Termine":
        return "checkmark-circle";
      case "Annule":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const handlePhoneCall = (phoneNumber: string, passengerName: string) => {
    Alert.alert(
      "Appeler le passager",
      `Voulez-vous appeler ${passengerName} ?\n${phoneNumber}`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Appeler",
          onPress: async () => {
            try {
              const phoneUrl = `tel:${phoneNumber.replace(/\s/g, "")}`;
              const supported = await Linking.canOpenURL(phoneUrl);

              if (supported) {
                await Linking.openURL(phoneUrl);
              } else {
                Alert.alert("Erreur", "Impossible de passer l'appel");
              }
            } catch (error) {
              Alert.alert("Erreur", "Impossible de passer l'appel");
            }
          },
        },
      ]
    );
  };

  const getPickupPoints = () => {
    if (!trip) return [];

    return trip.points
      .filter((point) => point.type === "waypoint")
      .map((point, index) => {
        const passengerName =
          point.notes?.replace("Client: ", "") || `Passager ${index + 1}`;

        const mockPhones: { [key: string]: string } = {
          "Ahmed El Mansouri": "+212 6 12 34 56 78",
          "Fatima Benali": "+212 6 87 65 43 21",
          "Omar Khalil": "+212 6 55 44 33 22",
          "Youssef Tazi": "+212 6 99 88 77 66",
          "Aicha Benkirane": "+212 6 11 22 33 44",
          "Hassan Alaoui": "+212 6 66 55 44 33",
          "Samira Berrada": "+212 6 77 88 99 00",
          "Mohamed Fassi": "+212 6 33 44 55 66",
        };

        return {
          ...point,
          passengerName,
          phone: mockPhones[passengerName] || "+212 6 XX XX XX XX",
        };
      });
  };

  const statusColor = trip ? getStatusColor(trip.status) : colors.textSecondary;
  const statusIcon = trip ? getStatusIcon(trip.status) : "help-circle";
  const pickupPoints = getPickupPoints();
  const departurePoint = trip?.points.find((p) => p.type === "pickup");
  const destinationPoint = trip?.points.find((p) => p.type === "destination");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    tripInfoCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      margin: 16,
      padding: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    tripTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: statusColor + "15",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 16,
      alignSelf: "center",
    },
    statusText: {
      fontSize: 14,
      fontWeight: "600",
      color: statusColor,
      marginLeft: 6,
    },
    tripInfoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    tripInfoIcon: {
      marginRight: 12,
      width: 20,
    },
    tripInfoText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 12,
    },
    pickupCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 12,
      padding: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    pickupHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    pickupNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    pickupNumberText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
    pickupInfo: {
      flex: 1,
    },
    passengerName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    pickupAddress: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 6,
      lineHeight: 18,
    },
    pickupTime: {
      fontSize: 12,
      color: colors.info,
      fontWeight: "500",
    },
    pickupActions: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    phoneButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.success + "15",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      alignSelf: "flex-start",
    },
    phoneText: {
      fontSize: 14,
      color: colors.success,
      fontWeight: "500",
      marginLeft: 6,
    },
    routeCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      margin: 16,
      padding: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    routePoint: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    routeIcon: {
      marginRight: 12,
      width: 20,
    },
    routeText: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    departureText: {
      color: colors.info,
      fontWeight: "500",
    },
    destinationText: {
      color: colors.error,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title={trip ? "Détails du trajet" : "Trajet introuvable"}
      />

      <ConditionalComponent
        isValid={!!trip}
        defaultComponent={
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Ce trajet n'existe pas</Text>
          </View>
        }
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Trip Basic Info */}
            <View style={styles.tripInfoCard}>
              <Text style={styles.tripTitle}>{trip?.title}</Text>

              {/* Trip Status */}
              <View style={styles.statusContainer}>
                <Ionicons
                  name={statusIcon as any}
                  size={16}
                  color={statusColor}
                />
                <Text style={styles.statusText}>{trip?.status}</Text>
              </View>

              <View style={styles.tripInfoRow}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.tripInfoIcon}
                />
                <Text style={styles.tripInfoText}>
                  Heure de départ: {trip?.startTime}
                </Text>
              </View>

              <View style={styles.tripInfoRow}>
                <Ionicons
                  name="speedometer-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.tripInfoIcon}
                />
                <Text style={styles.tripInfoText}>
                  Distance: {trip?.distance} km
                </Text>
              </View>

              <View style={styles.tripInfoRow}>
                <Ionicons
                  name="hourglass-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.tripInfoIcon}
                />
                <Text style={styles.tripInfoText}>
                  Durée estimée: {trip?.estimatedDuration}
                </Text>
              </View>
            </View>

            {/* Pickup Points Section */}
            <ConditionalComponent isValid={pickupPoints.length > 0}>
              <>
                <Text style={styles.sectionTitle}>
                  Points de ramassage ({pickupPoints.length})
                </Text>
                {pickupPoints.map((point, index) => (
                  <View key={point.id} style={styles.pickupCard}>
                    <View style={styles.pickupHeader}>
                      <View style={styles.pickupNumber}>
                        <Text style={styles.pickupNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.pickupInfo}>
                        <Text style={styles.passengerName}>
                          {point.passengerName}
                        </Text>
                        <Text style={styles.pickupAddress} numberOfLines={2}>
                          {point.address}
                        </Text>
                        <ConditionalComponent isValid={!!point.estimatedTime}>
                          <Text style={styles.pickupTime}>
                            Heure prévue: {point.estimatedTime}
                          </Text>
                        </ConditionalComponent>
                      </View>
                    </View>

                    <View style={styles.pickupActions}>
                      <TouchableOpacity
                        style={styles.phoneButton}
                        activeOpacity={0.7}
                        onPress={() =>
                          handlePhoneCall(point.phone, point.passengerName)
                        }
                      >
                        <Ionicons
                          name="call"
                          size={16}
                          color={colors.success}
                        />
                        <Text style={styles.phoneText}>{point.phone}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            </ConditionalComponent>

            {/* Route Information */}
            <Text style={styles.sectionTitle}>Itinéraire</Text>
            <View style={styles.routeCard}>
              <ConditionalComponent isValid={!!departurePoint}>
                <View style={styles.routePoint}>
                  <Ionicons
                    name="play-circle"
                    size={20}
                    color={colors.info}
                    style={styles.routeIcon}
                  />
                  <Text style={[styles.routeText, styles.departureText]}>
                    Départ: {departurePoint?.address}
                  </Text>
                </View>
              </ConditionalComponent>

              <ConditionalComponent isValid={!!destinationPoint}>
                <View style={[styles.routePoint, { marginBottom: 0 }]}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={colors.error}
                    style={styles.routeIcon}
                  />
                  <Text style={[styles.routeText, styles.destinationText]}>
                    Destination: {destinationPoint?.address}
                  </Text>
                </View>
              </ConditionalComponent>
            </View>
          </ScrollView>
        </Animated.View>
      </ConditionalComponent>
    </SafeAreaView>
  );
};
