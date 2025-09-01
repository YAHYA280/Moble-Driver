// store/geolocationStore.ts
import { create } from "zustand";
import {
  GeolocationActions,
  GeolocationAlert,
  GeolocationSettings,
  GeolocationState,
  Location,
  PointOfInterest,
  Trip,
  TripStatus,
} from "../shared/types/geolocation";

type GeolocationStore = GeolocationState & GeolocationActions;

// Mock data
const mockTrips: Trip[] = [
  {
    id: "1",
    title: "Course vers Aéroport",
    status: "En cours",
    startTime: "14:30",
    estimatedDuration: "45 min",
    distance: 25.5,
    points: [
      {
        id: "p1",
        type: "pickup",
        coordinates: { latitude: 35.7595, longitude: -5.834 },
        address: "123 Rue Mohamed V, Tanger",
        estimatedTime: "14:30",
      },
      {
        id: "p2",
        type: "destination",
        coordinates: { latitude: 35.7269, longitude: -5.9167 },
        address: "Aéroport Ibn Battouta, Tanger",
        estimatedTime: "15:15",
      },
    ],
    vehicleId: "95700L15",
    customerInfo: {
      name: "Ahmed Benali",
      phone: "+212 6 12 34 56 78",
    },
  },
  {
    id: "2",
    title: "Trajet Centre Ville",
    status: "A venir",
    startTime: "16:00",
    estimatedDuration: "30 min",
    distance: 12.3,
    points: [
      {
        id: "p3",
        type: "pickup",
        coordinates: { latitude: 35.7673, longitude: -5.8008 },
        address: "Place du 9 Avril, Tanger",
        estimatedTime: "16:00",
      },
      {
        id: "p4",
        type: "destination",
        coordinates: { latitude: 35.7889, longitude: -5.8136 },
        address: "Gare Tanger Ville",
        estimatedTime: "16:30",
      },
    ],
    vehicleId: "95700L15",
    customerInfo: {
      name: "Fatima Zahra",
      phone: "+212 6 87 65 43 21",
    },
  },
];

const mockPOI: PointOfInterest[] = [
  {
    id: "poi1",
    name: "Station Afriquia",
    type: "station-service",
    coordinates: { latitude: 35.765, longitude: -5.82 },
    icon: "local-gas-station",
    description: "Ouvert 24h/24",
  },
  {
    id: "poi2",
    name: "Restaurant Al Andalous",
    type: "restaurant",
    coordinates: { latitude: 35.77, longitude: -5.81 },
    icon: "restaurant",
    description: "Cuisine marocaine traditionnelle",
  },
  {
    id: "poi3",
    name: "Hôpital Mohammed V",
    type: "hopital",
    coordinates: { latitude: 35.78, longitude: -5.83 },
    icon: "local-hospital",
    description: "Urgences 24h/24",
  },
];

const defaultSettings: GeolocationSettings = {
  map: {
    mapType: "roadmap",
    nightMode: false,
    showTraffic: true,
    showPOI: true,
    autoFollow: true,
    updateInterval: 15,
  },
  notifications: {
    soundEnabled: true,
    vibrationEnabled: true,
    approachDistance: 500,
    routeChangeAlerts: true,
    missionAlerts: true,
  },
};

export const useGeolocationStore = create<GeolocationStore>((set, get) => ({
  // State
  currentLocation: null,
  trips: mockTrips,
  currentTrip: mockTrips[0], // Current trip in progress
  pointsOfInterest: mockPOI,
  alerts: [],
  settings: defaultSettings,
  isLoading: false,
  error: null,
  isLocationPermissionGranted: false,
  isTrackingActive: false,

  // Actions
  requestLocationPermission: async () => {
    set({ isLoading: true });
    try {
      // Simulate permission request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ isLocationPermissionGranted: true, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: "Permission de localisation refusée",
        isLoading: false,
      });
      return false;
    }
  },

  startTracking: async () => {
    const { isLocationPermissionGranted } = get();
    if (!isLocationPermissionGranted) {
      const granted = await get().requestLocationPermission();
      if (!granted) return;
    }

    set({ isTrackingActive: true, isLoading: true });

    try {
      // Simulate getting initial location (Tanger coordinates)
      const mockLocation: Location = {
        latitude: 35.7595,
        longitude: -5.834,
        address: "Tanger, Maroc",
        timestamp: new Date().toISOString(),
      };

      set({
        currentLocation: mockLocation,
        isLoading: false,
      });

      // Start location updates simulation
      const updateLocation = () => {
        const { isTrackingActive } = get();
        if (!isTrackingActive) return;

        const currentLoc = get().currentLocation;
        if (currentLoc) {
          // Simulate small location changes
          const newLocation: Location = {
            latitude: currentLoc.latitude + (Math.random() - 0.5) * 0.001,
            longitude: currentLoc.longitude + (Math.random() - 0.5) * 0.001,
            address: currentLoc.address,
            timestamp: new Date().toISOString(),
          };

          set({ currentLocation: newLocation });
        }

        setTimeout(updateLocation, get().settings.map.updateInterval * 1000);
      };

      setTimeout(updateLocation, get().settings.map.updateInterval * 1000);
    } catch (error) {
      set({
        error: "Erreur lors du démarrage de la localisation",
        isTrackingActive: false,
        isLoading: false,
      });
    }
  },

  stopTracking: () => {
    set({ isTrackingActive: false });
  },

  updateCurrentLocation: (location: Location) => {
    set({ currentLocation: location });
  },

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({
        trips: mockTrips,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des trajets",
        isLoading: false,
      });
    }
  },

  setCurrentTrip: (trip: Trip | null) => {
    set({ currentTrip: trip });
  },

  updateTripStatus: async (tripId: string, status: TripStatus) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        trips: state.trips.map((trip) =>
          trip.id === tripId ? { ...trip, status } : trip
        ),
        currentTrip:
          state.currentTrip?.id === tripId
            ? { ...state.currentTrip, status }
            : state.currentTrip,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour du trajet",
        isLoading: false,
      });
    }
  },

  fetchPointsOfInterest: async () => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({
        pointsOfInterest: mockPOI,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des points d'intérêt",
        isLoading: false,
      });
    }
  },

  addPointOfInterest: async (poi: PointOfInterest) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        pointsOfInterest: [...state.pointsOfInterest, poi],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de l'ajout du point d'intérêt",
        isLoading: false,
      });
    }
  },

  addAlert: (alert: Omit<GeolocationAlert, "id" | "timestamp">) => {
    const newAlert: GeolocationAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      alerts: [newAlert, ...state.alerts],
    }));
  },

  markAlertAsRead: (alertId: string) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ),
    }));
  },

  clearAlerts: () => {
    set({ alerts: [] });
  },

  updateSettings: async (newSettings: Partial<GeolocationSettings>) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        settings: {
          map: { ...state.settings.map, ...newSettings.map },
          notifications: {
            ...state.settings.notifications,
            ...newSettings.notifications,
          },
        },
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de la sauvegarde des paramètres",
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
