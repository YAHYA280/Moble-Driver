import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
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
  onLocationUpdate,
  onTripPointClick,
  style,
}) => {
  const colors = useThemeColors();
  const webViewRef = useRef<WebView>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Google Maps API Key placeholder - Replace with actual key
  const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

  const generateMapHTML = () => {
    const mapStyles = nightMode
      ? `
      [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }]
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }]
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }]
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }]
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }]
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }]
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }]
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }]
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }]
        }
      ]
    `
      : "[]";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
          <title>Google Maps</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              height: 100%;
              width: 100%;
              overflow: hidden;
            }
            #map {
              height: 100vh;
              width: 100vw;
            }
            .custom-marker {
              background: #746CD4;
              border: 2px solid white;
              border-radius: 50%;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .driver-marker {
              background: #22c55e;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
            }
            .pickup-marker {
              background: #3b82f6;
            }
            .destination-marker {
              background: #ef4444;
            }
            .poi-marker {
              background: #f59e0b;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            let map;
            let markers = [];
            let trafficLayer;
            let directionsService;
            let directionsRenderer;

            function initMap() {
              const center = ${
                currentLocation
                  ? `{lat: ${currentLocation.latitude}, lng: ${currentLocation.longitude}}`
                  : "{lat: 35.7595, lng: -5.8340}"
              };

              map = new google.maps.Map(document.getElementById("map"), {
                zoom: 13,
                center: center,
                mapTypeId: "${mapType}",
                styles: ${mapStyles},
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
              });

              directionsService = new google.maps.DirectionsService();
              directionsRenderer = new google.maps.DirectionsRenderer({
                polylineOptions: {
                  strokeColor: "#746CD4",
                  strokeOpacity: 0.8,
                  strokeWeight: 4
                },
                suppressMarkers: true
              });
              directionsRenderer.setMap(map);

              if (${showTraffic}) {
                trafficLayer = new google.maps.TrafficLayer();
                trafficLayer.setMap(map);
              }

              addMarkers();
              drawCurrentTripRoute();
              
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapReady'
              }));
            }

            function addMarkers() {
              // Clear existing markers
              markers.forEach(marker => marker.setMap(null));
              markers = [];

              // Add current location marker
              ${
                currentLocation
                  ? `
                const driverMarker = new google.maps.Marker({
                  position: {lat: ${currentLocation.latitude}, lng: ${currentLocation.longitude}},
                  map: map,
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#22c55e",
                    fillOpacity: 1,
                    strokeWeight: 3,
                    strokeColor: "#ffffff"
                  },
                  title: "Ma position"
                });
                markers.push(driverMarker);
              `
                  : ""
              }

              // Add trip markers
              ${JSON.stringify(trips)}.forEach(trip => {
                trip.points.forEach(point => {
                  const color = point.type === 'pickup' ? '#3b82f6' : '#ef4444';
                  const title = point.type === 'pickup' ? 'Point de ramassage' : 'Destination';
                  
                  const marker = new google.maps.Marker({
                    position: {lat: point.coordinates.latitude, lng: point.coordinates.longitude},
                    map: map,
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 10,
                      fillColor: color,
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: "#ffffff"
                    },
                    title: title + ": " + point.address
                  });

                  marker.addListener('click', () => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'tripPointClick',
                      tripId: trip.id,
                      pointId: point.id
                    }));
                  });

                  markers.push(marker);
                });
              });

              // Add POI markers if enabled
              if (${showPOI}) {
                ${JSON.stringify(pointsOfInterest)}.forEach(poi => {
                  const marker = new google.maps.Marker({
                    position: {lat: poi.coordinates.latitude, lng: poi.coordinates.longitude},
                    map: map,
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 6,
                      fillColor: "#f59e0b",
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: "#ffffff"
                    },
                    title: poi.name
                  });
                  markers.push(marker);
                });
              }
            }

            function drawCurrentTripRoute() {
              ${
                currentTrip && currentTrip.points.length >= 2
                  ? `
                const waypoints = ${JSON.stringify(currentTrip.points)};
                if (waypoints.length >= 2) {
                  const request = {
                    origin: {lat: waypoints[0].coordinates.latitude, lng: waypoints[0].coordinates.longitude},
                    destination: {lat: waypoints[waypoints.length - 1].coordinates.latitude, lng: waypoints[waypoints.length - 1].coordinates.longitude},
                    waypoints: waypoints.slice(1, -1).map(point => ({
                      location: {lat: point.coordinates.latitude, lng: point.coordinates.longitude},
                      stopover: true
                    })),
                    travelMode: google.maps.TravelMode.DRIVING
                  };

                  directionsService.route(request, (result, status) => {
                    if (status === 'OK') {
                      directionsRenderer.setDirections(result);
                    }
                  });
                }
              `
                  : ""
              }
            }

            function updateLocation(lat, lng) {
              if (markers.length > 0) {
                markers[0].setPosition({lat: lat, lng: lng});
                map.panTo({lat: lat, lng: lng});
              }
            }

            function changeMapType(type) {
              map.setMapTypeId(type);
            }

            function toggleTraffic(show) {
              if (trafficLayer) {
                trafficLayer.setMap(show ? map : null);
              }
            }

            window.addEventListener('message', function(event) {
              const data = JSON.parse(event.data);
              if (data.type === 'updateLocation') {
                updateLocation(data.lat, data.lng);
              } else if (data.type === 'changeMapType') {
                changeMapType(data.mapType);
              } else if (data.type === 'toggleTraffic') {
                toggleTraffic(data.show);
              }
            });
          </script>
          <script async defer src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap"></script>
        </body>
      </html>
    `;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case "mapReady":
          setIsMapReady(true);
          break;
        case "tripPointClick":
          onTripPointClick?.(data.tripId, data.pointId);
          break;
      }
    } catch (error) {
      console.error("Error handling WebView message:", error);
    }
  };

  useEffect(() => {
    if (isMapReady && currentLocation && webViewRef.current) {
      const message = JSON.stringify({
        type: "updateLocation",
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
      });
      webViewRef.current.postMessage(message);
    }
  }, [currentLocation, isMapReady]);

  useEffect(() => {
    if (isMapReady && webViewRef.current) {
      const message = JSON.stringify({
        type: "changeMapType",
        mapType,
      });
      webViewRef.current.postMessage(message);
    }
  }, [mapType, isMapReady]);

  useEffect(() => {
    if (isMapReady && webViewRef.current) {
      const message = JSON.stringify({
        type: "toggleTraffic",
        show: showTraffic,
      });
      webViewRef.current.postMessage(message);
    }
  }, [showTraffic, isMapReady]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    mapContainer: {
      flex: 1,
      borderRadius: 0,
      overflow: "hidden",
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
  });

  // Show error state if no API key
  if (GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="warning"
            size={48}
            color={colors.warning}
            style={styles.errorIcon}
          />
          <Text style={styles.errorTitle}>Clé API Google Maps requise</Text>
          <Text style={styles.errorText}>
            Veuillez configurer votre clé API Google Maps pour utiliser cette
            fonctionnalité.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              Alert.alert(
                "Configuration requise",
                "Contactez l'administrateur pour obtenir la clé API Google Maps."
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

      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: generateMapHTML() }}
          style={{ flex: 1 }}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={Platform.OS === "android"}
          bounces={false}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onError={(error) => {
            console.error("WebView error:", error);
          }}
          onHttpError={(error) => {
            console.error("WebView HTTP error:", error);
          }}
        />
      </View>
    </View>
  );
};

export { GoogleMapsView };
