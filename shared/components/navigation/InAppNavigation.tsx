// shared/components/navigation/InAppNavigation.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useThemeColors } from "../../../hooks/useTheme";
import { Coordinates, Location } from "../../types/geolocation";

interface InAppNavigationProps {
  currentLocation: Location | null;
  destination: {
    coordinates: Coordinates;
    address: string;
  };
  onClose: () => void;
  onExternalNavigation: () => void;
}

export const InAppNavigation: React.FC<InAppNavigationProps> = ({
  currentLocation,
  destination,
  onClose,
  onExternalNavigation,
}) => {
  const colors = useThemeColors();
  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    instructions: string[];
  } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "";

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  const handleStartNavigation = () => {
    setIsNavigating(true);
    // In a real app, you would start turn-by-turn navigation here
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
  };

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background,
      zIndex: 1000,
    },
    mapContainer: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    header: {
      position: "absolute",
      top: Platform.select({ ios: 50, android: 20 }),
      left: 16,
      right: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      zIndex: 10,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    headerInfo: {
      flex: 1,
      marginRight: 16,
    },
    destinationText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    addressText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    headerActions: {
      flexDirection: "row",
      gap: 8,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: {
      backgroundColor: colors.error + "15",
    },
    bottomPanel: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 20,
      paddingBottom: Platform.select({ ios: 34, android: 20 }),
      zIndex: 10,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    routeInfo: {
      flexDirection: "row",
      marginBottom: 16,
      gap: 24,
    },
    routeInfoItem: {
      flex: 1,
      alignItems: "center",
    },
    routeInfoValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    routeInfoLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    navigationButtons: {
      flexDirection: "row",
      gap: 12,
    },
    navButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.backgroundSecondary,
    },
    primaryNavButton: {
      backgroundColor: colors.primary,
    },
    stopNavButton: {
      backgroundColor: colors.error,
    },
    navButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginLeft: 8,
    },
    primaryNavButtonText: {
      color: "white",
    },
    instructionBanner: {
      position: "absolute",
      top: Platform.select({ ios: 120, android: 90 }),
      left: 16,
      right: 16,
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      zIndex: 10,
    },
    instructionIcon: {
      marginRight: 12,
    },
    instructionText: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
    warningBanner: {
      position: "absolute",
      top: Platform.select({ ios: 190, android: 160 }),
      left: 16,
      right: 16,
      backgroundColor: colors.warning + "15",
      borderRadius: 8,
      padding: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
      zIndex: 10,
    },
    warningText: {
      fontSize: 14,
      color: colors.warning,
      fontWeight: "500",
      textAlign: "center",
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1000, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={false}
          followsUserLocation={isNavigating}
          showsCompass={true}
          showsTraffic={true}
          initialRegion={{
            latitude:
              currentLocation?.latitude || destination.coordinates.latitude,
            longitude:
              currentLocation?.longitude || destination.coordinates.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Destination Marker */}
          <Marker
            coordinate={destination.coordinates}
            title="Destination"
            description={destination.address}
            pinColor={colors.error}
          />

          {/* Route Directions */}
          {currentLocation && GOOGLE_MAPS_API_KEY && (
            <MapViewDirections
              origin={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              destination={destination.coordinates}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor={colors.primary}
              onReady={(result) => {
                setRouteInfo({
                  distance: `${result.distance.toFixed(1)} km`,
                  duration: `${Math.round(result.duration)} min`,
                  instructions: [], // In a real app, you'd get turn-by-turn instructions
                });

                // Fit map to route
                mapRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: { top: 200, right: 50, bottom: 200, left: 50 },
                  animated: true,
                });
              }}
              onError={(error) => {
                console.error("Navigation error:", error);
              }}
            />
          )}
        </MapView>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.destinationText}>Vers destination</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {destination.address}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onExternalNavigation}
          >
            <Ionicons name="map" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.closeButton]}
            onPress={onClose}
          >
            <Ionicons name="close" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <Text style={styles.warningText}>
          ⚠️ Navigation basique - Utilisez une app GPS dédiée pour de meilleurs
          résultats
        </Text>
      </View>

      {/* Navigation Instruction Banner */}
      {isNavigating && (
        <View style={styles.instructionBanner}>
          <Ionicons
            name="navigate"
            size={24}
            color="white"
            style={styles.instructionIcon}
          />
          <Text style={styles.instructionText}>
            Suivez la route bleue vers la destination
          </Text>
        </View>
      )}

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        {/* Route Information */}
        {routeInfo && (
          <View style={styles.routeInfo}>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoValue}>{routeInfo.distance}</Text>
              <Text style={styles.routeInfoLabel}>Distance</Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoValue}>{routeInfo.duration}</Text>
              <Text style={styles.routeInfoLabel}>Durée estimée</Text>
            </View>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {!isNavigating ? (
            <>
              <TouchableOpacity
                style={styles.navButton}
                onPress={onExternalNavigation}
              >
                <Ionicons name="map-outline" size={20} color={colors.text} />
                <Text style={styles.navButtonText}>App GPS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navButton, styles.primaryNavButton]}
                onPress={handleStartNavigation}
              >
                <Ionicons name="navigate" size={20} color="white" />
                <Text
                  style={[styles.navButtonText, styles.primaryNavButtonText]}
                >
                  Démarrer
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.stopNavButton]}
              onPress={handleStopNavigation}
            >
              <Ionicons name="stop" size={20} color="white" />
              <Text style={[styles.navButtonText, styles.primaryNavButtonText]}>
                Arrêter navigation
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};
