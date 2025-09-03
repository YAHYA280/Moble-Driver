// shared/components/maps/GoogleMapsView.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  MapType as RNMapType,
  Region,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useThemeColors } from "../../../hooks/useTheme";
import { Location, PointOfInterest, Trip } from "../../types/geolocation";

interface GoogleMapsViewProps {
  currentLocation: Location | null;
  trips: Trip[];
  currentTrip: Trip | null;
  pointsOfInterest: PointOfInterest[];
  mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
  showTraffic?: boolean;
  showPOI?: boolean;
  nightMode?: boolean;
  centerOnLocation?: boolean; // Added this prop
  onLocationUpdate?: (location: Location) => void;
  onTripPointClick?: (tripId: string, pointId: string) => void;
  style?: any;
}

const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  currentLocation,
  trips,
  currentTrip,
  pointsOfInterest,
  mapType = "roadmap",
  showTraffic = true,
  showPOI = true,
  nightMode = false,
  centerOnLocation = false, // Added default value
  onLocationUpdate,
  onTripPointClick,
  style,
}) => {
  const colors = useThemeColors();
  const mapRef = useRef<MapView>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: currentLocation?.latitude || 35.7595,
    longitude: currentLocation?.longitude || -5.834,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Google Maps API Key from environment
  const GOOGLE_MAPS_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";

  // Convert our map types to react-native-maps types
  const getMapType = (): RNMapType => {
    switch (mapType) {
      case "satellite":
        return "satellite";
      case "hybrid":
        return "hybrid";
      case "terrain":
        return "terrain";
      default:
        return "standard";
    }
  };

  // Get night mode styles
  const getNightModeStyle = () => {
    if (!nightMode) return [];

    return [
      {
        elementType: "geometry",
        stylers: [{ color: "#242f3e" }],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#242f3e" }],
      },
      {
        elementType: "labels.text.fill",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ];
  };

  // Update region when current location changes
  useEffect(() => {
    if (currentLocation && isMapReady) {
      const newRegion = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    }
  }, [currentLocation, isMapReady]);

  // Handle centerOnLocation prop change
  useEffect(() => {
    if (centerOnLocation && currentLocation && isMapReady) {
      const newRegion = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      mapRef.current?.animateToRegion(newRegion, 1000);
    }
  }, [centerOnLocation, currentLocation, isMapReady]);

  // Handle map ready
  const handleMapReady = () => {
    setIsMapReady(true);
  };

  // Handle trip point marker press
  const handleTripPointPress = (tripId: string, pointId: string) => {
    onTripPointClick?.(tripId, pointId);
  };

  // Get marker color for trip points
  const getMarkerColor = (type: string) => {
    switch (type) {
      case "pickup":
        return "#3b82f6"; // Blue
      case "destination":
        return "#ef4444"; // Red
      case "waypoint":
        return "#f59e0b"; // Amber
      default:
        return "#746cd4"; // Purple
    }
  };

  // Get POI marker color
  const getPOIColor = (type: string) => {
    switch (type) {
      case "station-service":
        return "#f59e0b"; // Amber
      case "restaurant":
        return "#10b981"; // Emerald
      case "hopital":
        return "#ef4444"; // Red
      case "parking":
        return "#6366f1"; // Indigo
      default:
        return "#8b5cf6"; // Violet
    }
  };

  // Render current trip directions
  const renderDirections = () => {
    if (!currentTrip || !GOOGLE_MAPS_API_KEY || currentTrip.points.length < 2) {
      return null;
    }

    const origin = currentTrip.points[0].coordinates;
    const destination =
      currentTrip.points[currentTrip.points.length - 1].coordinates;
    const waypoints = currentTrip.points
      .slice(1, -1)
      .map((point) => point.coordinates);

    return (
      <MapViewDirections
        origin={origin}
        destination={destination}
        waypoints={waypoints.length > 0 ? waypoints : undefined}
        apikey={GOOGLE_MAPS_API_KEY}
        strokeWidth={4}
        strokeColor={colors.primary}
        optimizeWaypoints={true}
        onStart={(params) => {
          console.log(
            `Started routing between "${params.origin}" and "${params.destination}"`
          );
        }}
        onReady={(result) => {
          console.log(`Distance: ${result.distance} km`);
          console.log(`Duration: ${result.duration} min.`);

          // Fit the map to show the entire route
          if (mapRef.current) {
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: 30,
                bottom: 300,
                left: 30,
                top: 100,
              },
              animated: true,
            });
          }
        }}
        onError={(errorMessage) => {
          console.error("Directions error:", errorMessage);
        }}
      />
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    map: {
      flex: 1,
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.backgroundSecondary,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    loadingText: {
      color: colors.text,
      fontSize: 16,
      marginTop: 16,
      textAlign: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      padding: 20,
    },
    errorIcon: {
      marginBottom: 16,
    },
    errorTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    errorText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 20,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    markerCallout: {
      width: 200,
      padding: 8,
    },
    calloutTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    calloutDescription: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

  // Show fallback if no API key (but still functional)
  if (
    !GOOGLE_MAPS_API_KEY ||
    GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY"
  ) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="warning"
            size={48}
            color={colors.warning}
            style={styles.errorIcon}
          />
          <Text style={styles.errorTitle}>Clé API Google Maps manquante</Text>
          <Text style={styles.errorText}>
            La carte fonctionne en mode basique.{"\n"}
            Pour les directions et fonctionnalités avancées,{"\n"}
            configurez votre clé API Google Maps.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              Alert.alert(
                "Configuration requise",
                "Ajoutez votre clé API Google Maps dans les variables d'environnement:\nEXPO_PUBLIC_GOOGLE_API_KEY=YOUR_API_KEY"
              )
            }
          >
            <Text style={styles.retryButtonText}>En savoir plus</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ConditionalComponent isValid={!isMapReady} defaultComponent={null}>
        <View style={styles.loadingContainer}>
          <Ionicons name="map" size={48} color={colors.primary} />
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      </ConditionalComponent>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType={getMapType()}
        customMapStyle={getNightModeStyle()}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        showsTraffic={showTraffic}
        showsPointsOfInterest={showPOI}
        region={region}
        onMapReady={handleMapReady}
        onRegionChangeComplete={setRegion}
        loadingEnabled={true}
        loadingIndicatorColor={colors.primary}
        moveOnMarkerPress={false}
      >
        {/* Current Location Marker */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Ma position"
            description={currentLocation.address}
            pinColor={colors.success}
          />
        )}

        {/* Trip Points Markers */}
        {trips.map((trip) =>
          trip.points.map((point) => (
            <Marker
              key={`${trip.id}-${point.id}`}
              coordinate={point.coordinates}
              title={
                point.type === "pickup"
                  ? "Point de ramassage"
                  : point.type === "destination"
                  ? "Destination"
                  : "Point d'arrêt"
              }
              description={point.address}
              pinColor={getMarkerColor(point.type)}
              onPress={() => handleTripPointPress(trip.id, point.id)}
            >
              <View style={styles.markerCallout}>
                <Text style={styles.calloutTitle}>
                  {point.type === "pickup"
                    ? "Ramassage"
                    : point.type === "destination"
                    ? "Destination"
                    : "Arrêt"}
                </Text>
                <Text style={styles.calloutDescription}>{point.address}</Text>
                {point.estimatedTime && (
                  <Text style={styles.calloutDescription}>
                    Heure prévue: {point.estimatedTime}
                  </Text>
                )}
                {point.notes && (
                  <Text style={styles.calloutDescription}>{point.notes}</Text>
                )}
              </View>
            </Marker>
          ))
        )}

        {/* Points of Interest Markers */}
        {showPOI &&
          pointsOfInterest.map((poi) => (
            <Marker
              key={poi.id}
              coordinate={poi.coordinates}
              title={poi.name}
              description={poi.description}
              pinColor={getPOIColor(poi.type)}
            >
              <View style={styles.markerCallout}>
                <Text style={styles.calloutTitle}>{poi.name}</Text>
                {poi.description && (
                  <Text style={styles.calloutDescription}>
                    {poi.description}
                  </Text>
                )}
              </View>
            </Marker>
          ))}

        {/* Directions for current trip */}
        {renderDirections()}
      </MapView>
    </View>
  );
};

export { GoogleMapsView };
