// screens/innerApplication/geolocation/geolocationScreen.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { GoogleMapsView } from "../../../shared/components/maps/GoogleMapsView";
import { InAppNavigation } from "../../../shared/components/navigation/InAppNavigation";
import { Header } from "../../../shared/components/ui/Header";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { useGeolocationStore } from "../../../store/geolocationStore";
import { MapControlsPanel } from "./components/MapControlsPanel";
import { TripInfoCard } from "./components/TripInfoCard";

export const GeolocationScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [centerOnLocation, setCenterOnLocation] = useState(false);
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [showInAppNavigation, setShowInAppNavigation] = useState(false);
  const [navigationDestination, setNavigationDestination] = useState<{
    coordinates: { latitude: number; longitude: number };
    address: string;
  } | null>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const controlsAnim = useRef(new Animated.Value(0)).current;
  const [showMapControls, setShowMapControls] = useState(false);

  const {
    currentLocation,
    trips,
    currentTrip,
    pointsOfInterest,
    alerts,
    settings,
    isLoading,
    error,
    isLocationPermissionGranted,
    isTrackingActive,
    requestLocationPermission,
    startTracking,
    stopTracking,
    fetchTrips,
    fetchPointsOfInterest,
    updateSettings,
    addAlert,
    clearError,
  } = useGeolocationStore();

  useEffect(() => {
    // Initialize screen
    fetchTrips();
    fetchPointsOfInterest();

    // Animate header
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Check location permission and start tracking
    const initializeLocation = async () => {
      if (!isLocationPermissionGranted) {
        const granted = await requestLocationPermission();
        if (granted) {
          startTracking();
        }
      } else if (!isTrackingActive) {
        startTracking();
      }
    };

    initializeLocation();

    return () => {
      // Clean up tracking when component unmounts
      if (isTrackingActive) {
        stopTracking();
      }
    };
  }, []);

  useEffect(() => {
    // Animate controls panel
    Animated.timing(controlsAnim, {
      toValue: showMapControls ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showMapControls]);

  // Navigation helpers
  const openInMaps = (latitude: number, longitude: number, label?: string) => {
    const destination = `${latitude},${longitude}`;
    const encodedLabel = encodeURIComponent(label || "Destination");

    if (Platform.OS === "ios") {
      // Try Apple Maps first, fallback to Google Maps
      const appleMapsUrl = `http://maps.apple.com/?daddr=${destination}&dirflg=d`;
      const googleMapsUrl = `https://maps.google.com/?daddr=${destination}&directionsmode=driving`;

      Linking.canOpenURL(appleMapsUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(appleMapsUrl);
          } else {
            return Linking.openURL(googleMapsUrl);
          }
        })
        .catch(() => {
          Alert.alert(
            "Erreur",
            "Impossible d'ouvrir l'application de navigation"
          );
        });
    } else {
      // Android - use Google Maps
      const googleMapsUrl = `https://maps.google.com/?daddr=${destination}&directionsmode=driving`;

      Linking.openURL(googleMapsUrl).catch(() => {
        Alert.alert("Erreur", "Impossible d'ouvrir Google Maps");
      });
    }
  };

  // FIXED: Better logic to get all stops in sequence
  const getAllTripStops = (trip: any) => {
    if (!trip) return [];

    // Get all points in order: pickup -> waypoints -> destination
    const allStops = trip.points.sort((a: any, b: any) => {
      // Sort by type priority: pickup first, then waypoints, then destination
      const typeOrder: { [key: string]: number } = {
        pickup: 0,
        waypoint: 1,
        destination: 2,
      };
      return (typeOrder[a.type] || 999) - (typeOrder[b.type] || 999);
    });

    return allStops;
  };

  // FIXED: Get next destination based on trip progress
  const getNextDestination = (trip: any) => {
    if (!trip) return null;

    const allStops = getAllTripStops(trip);

    // If trip is in progress, find the next unvisited stop
    if (trip.status === "En cours") {
      // For simplicity, we'll assume the next stop is the first waypoint or destination
      // In a real app, you'd track which stops have been completed
      const nextStop = allStops.find(
        (point: any) =>
          point.type === "waypoint" || point.type === "destination"
      );
      return nextStop;
    }

    // If trip is upcoming, go to pickup point
    if (trip.status === "A venir") {
      return allStops.find((point: any) => point.type === "pickup");
    }

    return null;
  };

  // FIXED: Show all stops in navigation selection
  const showNavigationOptions = (trip: any) => {
    if (!trip) return;

    const allStops = getAllTripStops(trip);

    // Create alert buttons for each stop
    const stopButtons = allStops.map((stop: any, index: number) => ({
      text: `${getStopLabel(stop.type)} ${index > 0 ? index : ""}`,
      onPress: () => navigateToStop(stop),
    }));

    // Add cancel button
    stopButtons.push({ text: "Annuler", style: "cancel" as const });

    Alert.alert(
      "Choisir la destination",
      "Sélectionnez le point vers lequel naviguer:",
      stopButtons
    );
  };

  const getStopLabel = (type: string) => {
    switch (type) {
      case "pickup":
        return "🚌 Départ";
      case "waypoint":
        return "🏃 Arrêt";
      case "destination":
        return "🏁 Arrivée";
      default:
        return "📍 Point";
    }
  };

  const navigateToStop = (stop: any) => {
    Alert.alert("Mode de navigation", `Navigation vers: ${stop.address}`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Navigation interne",
        onPress: () => {
          setNavigationDestination({
            coordinates: stop.coordinates,
            address: stop.address,
          });
          setShowInAppNavigation(true);

          addAlert({
            type: "mission_update",
            title: "Navigation interne démarrée",
            message: `Navigation vers ${stop.address}`,
            isRead: false,
            tripId: currentTrip?.id,
          });
        },
      },
      {
        text: "Navigation externe",
        onPress: () => {
          openInMaps(
            stop.coordinates.latitude,
            stop.coordinates.longitude,
            stop.address
          );

          addAlert({
            type: "mission_update",
            title: "Navigation externe démarrée",
            message: `Navigation vers ${stop.address}`,
            isRead: false,
            tripId: currentTrip?.id,
          });
        },
      },
    ]);
  };

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=/geolocation");
  };

  const handleMenuPress = () => {
    setShowSidebar(true);
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          setShowSidebar(false);
          // Add logout logic here
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const handleTripPointClick = (tripId: string, pointId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    const point = trip?.points.find((p) => p.id === pointId);

    if (trip && point) {
      Alert.alert(
        point.type === "pickup"
          ? "Point de ramassage"
          : point.type === "destination"
          ? "Destination"
          : "Point d'arrêt",
        `${trip.title}\n${point.address}${
          point.notes ? `\n${point.notes}` : ""
        }`,
        [
          { text: "Fermer", style: "cancel" },
          {
            text: "Navigation interne",
            onPress: () => {
              setNavigationDestination({
                coordinates: point.coordinates,
                address: point.address,
              });
              setShowInAppNavigation(true);

              addAlert({
                type: "approach_pickup",
                title: "Navigation démarrée",
                message: `Navigation interne vers ${point.address}`,
                isRead: false,
                tripId: trip.id,
                coordinates: point.coordinates,
              });
            },
          },
          {
            text: "Navigation externe",
            onPress: () => {
              openInMaps(
                point.coordinates.latitude,
                point.coordinates.longitude,
                point.address
              );

              addAlert({
                type: "approach_pickup",
                title: "Navigation externe démarrée",
                message: `Navigation vers ${point.address}`,
                isRead: false,
                tripId: trip.id,
                coordinates: point.coordinates,
              });
            },
          },
        ]
      );
    }
  };

  const handleHistoryPress = () => {
    router.push("/(tabs)/geolocation/history");
  };

  const handleSettingsPress = () => {
    router.push("/(tabs)/geolocation/settings");
  };

  const handleTrackingToggle = () => {
    if (isTrackingActive) {
      Alert.alert(
        "Arrêter la localisation",
        "Êtes-vous sûr de vouloir arrêter le suivi de votre position ?",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Arrêter", style: "destructive", onPress: stopTracking },
        ]
      );
    } else {
      startTracking();
    }
  };

  const handleCenterOnLocation = () => {
    if (currentLocation) {
      setCenterOnLocation(true);
      setTimeout(() => setCenterOnLocation(false), 100);

      addAlert({
        type: "mission_update",
        title: "Position actualisée",
        message: "Carte centrée sur votre position",
        isRead: false,
      });
    } else {
      Alert.alert(
        "Position non disponible",
        "Impossible de localiser votre position actuelle. Vérifiez que la géolocalisation est activée."
      );
    }
  };

  // FIXED: Use the new navigation logic
  const handleNavigateToTrip = (trip: any) => {
    if (!trip) return;
    showNavigationOptions(trip);
  };

  const handleMinimizeToggle = () => {
    setIsCardMinimized(!isCardMinimized);
  };

  const handleCloseNavigation = () => {
    setShowInAppNavigation(false);
    setNavigationDestination(null);
  };

  const handleExternalNavigation = () => {
    if (navigationDestination) {
      openInMaps(
        navigationDestination.coordinates.latitude,
        navigationDestination.coordinates.longitude,
        navigationDestination.address
      );
    }
    handleCloseNavigation();
  };

  const sidebarItems = [
    {
      id: "map",
      label: "Carte interactive",
      icon: "map" as const,
      onPress: () => setShowSidebar(false),
      isActive: true,
    },
    {
      id: "history",
      label: "Historique des trajets",
      icon: "archive" as const,
      onPress: () => {
        setShowSidebar(false);
        handleHistoryPress();
      },
      isActive: false,
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: "cog" as const,
      onPress: () => {
        setShowSidebar(false);
        handleSettingsPress();
      },
      isActive: false,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
      position: "relative",
    },
    mapContainer: {
      flex: 1,
    },
    overlayContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "box-none",
      zIndex: 10,
    },
    topOverlay: {
      paddingHorizontal: 16,
      paddingTop: 8,
      pointerEvents: "box-none",
    },
    bottomOverlay: {
      position: "absolute",
      bottom: 40, // Changed from 0 to 5 to move trip info card 5px up
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingBottom: Platform.select({
        ios: 34,
        android: 16,
        default: 20,
      }),
      pointerEvents: "box-none",
    },
    rightOverlay: {
      position: "absolute",
      top: 100,
      right: 16,
      pointerEvents: "box-none",
    },
    floatingButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    floatingButtonSecondary: {
      backgroundColor: colors.surface,
    },
    errorContainer: {
      backgroundColor: colors.error + "15",
      margin: 16,
      padding: 16,
      borderRadius: 12,
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
            icon: "bars",
            onPress: handleMenuPress,
          }}
          title="Navigation"
          rightIcons={[
            {
              icon: "cog",
              onPress: () => setShowMapControls(!showMapControls),
            },
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: alerts.filter((a) => !a.isRead).length,
            },
          ]}
        />
      </Animated.View>

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Google Maps - FIXED: Only pass current trip to show only its points */}
        <View style={styles.mapContainer}>
          <GoogleMapsView
            currentLocation={currentLocation}
            trips={currentTrip ? [currentTrip] : []} // FIXED: Only show current trip points
            currentTrip={currentTrip}
            pointsOfInterest={pointsOfInterest}
            mapType={settings.map.mapType}
            showTraffic={settings.map.showTraffic}
            showPOI={settings.map.showPOI}
            nightMode={settings.map.nightMode}
            onTripPointClick={handleTripPointClick}
            centerOnLocation={centerOnLocation}
            style={{ flex: 1 }}
          />
        </View>

        {/* Overlays */}
        <View style={styles.overlayContainer}>
          {/* Top Overlay - Location Status */}

          {/* Bottom Overlay - Trip Info */}
          <View style={styles.bottomOverlay}>
            <ConditionalComponent isValid={!!currentTrip}>
              <TripInfoCard
                trip={currentTrip!}
                isMinimized={isCardMinimized}
                onDetailsPress={() => {
                  if (currentTrip) {
                    router.push(`/(tabs)/geolocation/trip/${currentTrip.id}`);
                  }
                }}
                onNavigatePress={() => {
                  if (currentTrip) {
                    handleNavigateToTrip(currentTrip);
                  }
                }}
                onMinimizeToggle={handleMinimizeToggle}
              />
            </ConditionalComponent>
          </View>

          {/* Right Overlay - Floating Action Buttons */}
          <View style={styles.rightOverlay}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={handleHistoryPress}
              activeOpacity={0.7}
            >
              <Ionicons name="archive" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.floatingButton, styles.floatingButtonSecondary]}
              onPress={handleCenterOnLocation}
              activeOpacity={0.7}
            >
              <Ionicons name="locate" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Controls Panel */}
        <Animated.View
          style={{
            position: "absolute",
            top: 80,
            left: 16,
            right: 16,
            opacity: controlsAnim,
            transform: [
              {
                translateY: controlsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
            pointerEvents: showMapControls ? "auto" : "none",
            zIndex: 20,
          }}
        >
          <MapControlsPanel
            settings={settings.map}
            onSettingsChange={(newSettings) => {
              updateSettings({
                map: {
                  ...settings.map,
                  ...newSettings,
                },
              });
            }}
            onClose={() => setShowMapControls(false)}
          />
        </Animated.View>

        {/* In-App Navigation */}
        <ConditionalComponent
          isValid={showInAppNavigation && !!navigationDestination}
        >
          <InAppNavigation
            currentLocation={currentLocation}
            destination={navigationDestination!}
            onClose={handleCloseNavigation}
            onExternalNavigation={handleExternalNavigation}
          />
        </ConditionalComponent>
      </View>

      {/* Sidebar */}
      <Sidebar
        title="Géolocalisation"
        items={sidebarItems}
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};
