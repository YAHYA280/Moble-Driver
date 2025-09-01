// screens/innerApplication/geolocation/geolocationScreen.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { GoogleMapsView } from "../../../shared/components/maps/GoogleMapsView";
import { Header } from "../../../shared/components/ui/Header";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { useGeolocationStore } from "../../../store/geolocationStore";
import { LocationStatusBar } from "./components/LocationStatusBar";
import { MapControlsPanel } from "./components/MapControlsPanel";
import { TripInfoCard } from "./components/TripInfoCard";

export const GeolocationScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
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
        point.type === "pickup" ? "Point de ramassage" : "Destination",
        `${trip.title}\n${point.address}`,
        [
          { text: "Fermer", style: "cancel" },
          {
            text: "Navigation",
            onPress: () => {
              // Add navigation logic here
              addAlert({
                type: "approach_pickup",
                title: "Navigation démarrée",
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
      icon: "archive" as const, // Fixed: changed from "time" to "archive"
      onPress: () => {
        setShowSidebar(false);
        handleHistoryPress();
      },
      isActive: false,
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: "cog" as const, // Fixed: changed from "settings" to "cog"
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
      bottom: 0,
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
          title="Géolocalisation"
          rightIcons={[
            {
              icon: "cog", // Fixed: changed from "settings" to "cog"
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
        {/* Google Maps */}
        <View style={styles.mapContainer}>
          <GoogleMapsView
            currentLocation={currentLocation}
            trips={trips}
            currentTrip={currentTrip}
            pointsOfInterest={pointsOfInterest}
            mapType={settings.map.mapType}
            showTraffic={settings.map.showTraffic}
            showPOI={settings.map.showPOI}
            nightMode={settings.map.nightMode}
            onTripPointClick={handleTripPointClick}
            style={{ flex: 1 }}
          />
        </View>

        {/* Overlays */}
        <View style={styles.overlayContainer}>
          {/* Top Overlay - Location Status */}
          <View style={styles.topOverlay}>
            <LocationStatusBar
              isActive={isTrackingActive}
              currentLocation={currentLocation}
              onToggle={handleTrackingToggle}
            />
          </View>

          {/* Bottom Overlay - Trip Info */}
          <View style={styles.bottomOverlay}>
            <ConditionalComponent isValid={!!currentTrip}>
              <TripInfoCard
                trip={currentTrip!} // Fixed: corrected typo from currentTriip to currentTrip
                onDetailsPress={() => {
                  if (currentTrip) {
                    router.push(`/(tabs)/planning/trip/${currentTrip.id}`);
                  }
                }}
                onNavigatePress={() => {
                  if (currentTrip) {
                    addAlert({
                      type: "mission_update",
                      title: "Navigation démarrée",
                      message: `Navigation vers ${currentTrip.title}`,
                      isRead: false,
                      tripId: currentTrip.id,
                    });
                  }
                }}
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
              onPress={() => {
                if (currentLocation) {
                  // Center map on current location
                  addAlert({
                    type: "mission_update",
                    title: "Position actualisée",
                    message: "Carte centrée sur votre position",
                    isRead: false,
                  });
                }
              }}
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
              // Fixed: properly handle partial settings update
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
