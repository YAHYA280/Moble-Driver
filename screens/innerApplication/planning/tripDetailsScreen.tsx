// screens/innerApplication/planning/tripDetailsScreen.tsx - Fixed version
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { usePlanningStore } from "../../../store/planningStore";
import { useVehicleStore } from "../../../store/vehicleStore";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  // Route Section
  routeSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  routeIcon: {
    marginRight: 8,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  locationContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 12,
    opacity: 0.7,
  },
  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  startDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#746cd4",
    marginRight: 8,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#746cd4",
    marginHorizontal: 8,
  },
  endDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#746cd4",
    marginLeft: 8,
  },
  distanceBadge: {
    backgroundColor: "#746cd4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  distanceText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // Time Section
  timeSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  timeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timeBox: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#746cd4",
  },
  timeValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#746cd4",
  },
  timeArrow: {
    marginHorizontal: 20,
  },

  // Contact Section
  contactSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  contactNumbers: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9ff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e8eaff",
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#746cd4",
  },

  // Arrêts Section
  arretsSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  arretsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  arretsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  showRoadButton: {
    backgroundColor: "#746cd4",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  showRoadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Vehicle Section
  vehicleSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleImageContainer: {
    width: 100,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginRight: 20,
    overflow: "hidden",
  },
  vehicleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  vehicleModel: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 12,
  },
  vehiclePlateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  plateIcon: {
    marginRight: 8,
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 12,
  },
  plateBadge: {
    backgroundColor: "#746cd4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  plateBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  vehicleChevron: {
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
});

export const TripDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { selectedTrip, isLoading, fetchTripDetails } = usePlanningStore();

  // Memoize the trip to prevent unnecessary re-renders
  const trip = useMemo(() => {
    return selectedTrip;
  }, [selectedTrip?.id, selectedTrip?.updatedAt]);

  // Only fetch if we don't have the trip or if the ID changed
  useEffect(() => {
    if (id && (!trip || trip.id !== id)) {
      fetchTripDetails(id);
    }
  }, [id]);

  // Only animate when we have a stable trip
  useEffect(() => {
    if (trip && trip.id === id) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [trip?.id, id, fadeAnim]);

  const handleVehiclePress = () => {
    if (trip?.assignedVehicle) {
      const { vehicles, selectVehicle } = useVehicleStore.getState();

      const vehicle = vehicles.find(
        (v) =>
          v.id === trip.assignedVehicle?.id ||
          v.plateNumber === trip.assignedVehicle?.plateNumber
      );

      if (vehicle) {
        selectVehicle(vehicle);
        // Add return parameter to know where to go back
        router.push(
          `/(tabs)/vehicles/details?returnTo=planning&tripId=${trip.id}`
        );
      } else {
        console.log("Vehicle not found in store");
      }
    }
  };

  const formatTime = (time: string) => time.substring(0, 5);

  const handleMapPress = () => {
    if (trip) {
      router.push(`/(tabs)/geolocation?tripId=${trip.id}`);
    }
  };

  const handleContactPress = (phoneNumber: string) => {
    console.log(`Calling ${phoneNumber}`);
  };

  // Show loading state if no trip
  if (!trip || trip.id !== id) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Chargement..."
        />
      </SafeAreaView>
    );
  }

  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: colors.backgroundSecondary,
    },
    routeSection: {
      ...styles.routeSection,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: { elevation: 3 },
      }),
    },
    timeSection: {
      ...styles.timeSection,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: { elevation: 3 },
      }),
    },
    contactSection: {
      ...styles.contactSection,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: { elevation: 3 },
      }),
    },
    arretsSection: {
      ...styles.arretsSection,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: { elevation: 3 },
      }),
    },
    vehicleSection: {
      ...styles.vehicleSection,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: { elevation: 3 },
      }),
    },
    routeTitle: {
      ...styles.routeTitle,
      color: colors.text,
    },
    timeTitle: {
      ...styles.timeTitle,
      color: colors.text,
    },
    contactTitle: {
      ...styles.contactTitle,
      color: colors.text,
    },
    arretsTitle: {
      ...styles.arretsTitle,
      color: colors.text,
    },
    vehicleTitle: {
      ...styles.vehicleTitle,
      color: colors.text,
    },
    locationText: {
      ...styles.locationText,
      color: colors.text,
    },
    locationSubtext: {
      ...styles.locationSubtext,
      color: colors.textSecondary,
    },
    vehicleName: {
      ...styles.vehicleName,
      color: colors.text,
    },
    vehicleModel: {
      ...styles.vehicleModel,
      color: colors.textSecondary,
    },
    plateNumber: {
      ...styles.plateNumber,
      color: colors.text,
    },
    contactButton: {
      ...styles.contactButton,
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary + "30",
    },
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title={trip.title}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Route Section */}
          <View style={dynamicStyles.routeSection}>
            <View style={styles.routeHeader}>
              <FontAwesome
                name="map-marker"
                size={18}
                color={colors.error}
                style={styles.routeIcon}
              />
              <Text style={dynamicStyles.routeTitle}>Point de Départ</Text>
            </View>

            <View style={styles.routeContainer}>
              <View style={styles.locationContainer}>
                <Text style={dynamicStyles.locationText}>
                  {trip.startLocation}
                </Text>
                <Text style={dynamicStyles.locationSubtext}>
                  {trip.startLocation}
                </Text>
              </View>

              <View style={styles.locationContainer}>
                <Text
                  style={[dynamicStyles.locationText, { textAlign: "right" }]}
                >
                  {trip.endLocation}
                </Text>
                <Text
                  style={[
                    dynamicStyles.locationSubtext,
                    { textAlign: "right" },
                  ]}
                >
                  {trip.endLocation}
                </Text>
              </View>
            </View>

            <View style={styles.routeLine}>
              <View style={styles.startDot} />
              <View style={styles.line} />
              <FontAwesome name="graduation-cap" size={16} color="#746cd4" />
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>20 km</Text>
              </View>
            </View>
          </View>

          {/* Time Section */}
          <View style={dynamicStyles.timeSection}>
            <View style={styles.timeHeader}>
              <FontAwesome
                name="clock-o"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={dynamicStyles.timeTitle}>
                Heures de Départ et d&apos;Arrivé
              </Text>
            </View>

            <View style={styles.timeContainer}>
              <View style={styles.timeBox}>
                <Text style={styles.timeLabel}>De</Text>
                <Text style={styles.timeValue}>
                  {formatTime(trip.startTime)}
                </Text>
              </View>

              <FontAwesome
                name="chevron-right"
                size={20}
                color="#746cd4"
                style={styles.timeArrow}
              />

              <View style={styles.timeBox}>
                <Text style={styles.timeLabel}>À</Text>
                <Text style={styles.timeValue}>{formatTime(trip.endTime)}</Text>
              </View>
            </View>
          </View>

          {/* Contact Section */}
          <View style={dynamicStyles.contactSection}>
            <View style={styles.contactHeader}>
              <FontAwesome
                name="phone"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={dynamicStyles.contactTitle}>Contact usager</Text>
            </View>

            <View style={styles.contactNumbers}>
              <TouchableOpacity
                style={dynamicStyles.contactButton}
                onPress={() => handleContactPress("+145324421224")}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name="phone"
                  size={16}
                  color="#746cd4"
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>+145324421224</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={dynamicStyles.contactButton}
                onPress={() => handleContactPress("+145324421224")}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name="phone"
                  size={16}
                  color="#746cd4"
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>+145324421224</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Arrêts Section */}
          <View style={dynamicStyles.arretsSection}>
            <View style={styles.arretsHeader}>
              <FontAwesome
                name="map"
                size={18}
                color="#746cd4"
                style={styles.routeIcon}
              />
              <Text style={dynamicStyles.arretsTitle}>Arrêts</Text>
            </View>

            <TouchableOpacity
              style={styles.showRoadButton}
              onPress={handleMapPress}
              activeOpacity={0.8}
            >
              <Text style={styles.showRoadButtonText}>
                Voir l&apos;itinéraire sur la carte
              </Text>
            </TouchableOpacity>
          </View>

          {/* Vehicle Section */}
          <View style={dynamicStyles.vehicleSection}>
            <View style={styles.vehicleHeader}>
              <FontAwesome
                name="car"
                size={18}
                color={colors.error}
                style={styles.routeIcon}
              />
              <Text style={dynamicStyles.vehicleTitle}>Véhicule Assigné</Text>
            </View>

            <TouchableOpacity
              style={styles.vehicleCard}
              onPress={handleVehiclePress}
              activeOpacity={0.7}
            >
              <View style={styles.vehicleImageContainer}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&h=200&fit=crop&crop=center",
                  }}
                  style={styles.vehicleImage}
                />
              </View>

              <View style={styles.vehicleInfo}>
                <Text style={dynamicStyles.vehicleName}>
                  {trip.assignedVehicle?.brand || "Mercedes-Benz"}
                </Text>
                <Text style={dynamicStyles.vehicleModel}>
                  {trip.assignedVehicle?.model || "S 580 e 4MATIC Long"}
                </Text>

                <View style={styles.vehiclePlateContainer}>
                  <FontAwesome
                    name="credit-card"
                    size={16}
                    color={colors.textSecondary}
                    style={styles.plateIcon}
                  />
                  <Text style={dynamicStyles.plateNumber}>
                    {trip.assignedVehicle?.plateNumber || "SN-UX420-77V1"}
                  </Text>
                  <View style={styles.plateBadge}>
                    <Text style={styles.plateBadgeText}>23-XYZ-45</Text>
                  </View>
                </View>
              </View>

              <View style={styles.vehicleChevron}>
                <FontAwesome
                  name="chevron-right"
                  size={16}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
