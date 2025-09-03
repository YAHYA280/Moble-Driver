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

// Updated mock data for Morocco (Tangier area)
const mockTrips: Trip[] = [
  // En cours trip
  {
    id: "1",
    title: "Course vers Centre Ville",
    status: "En cours",
    startTime: "14:30",
    estimatedDuration: "25 min",
    actualDuration: undefined,
    distance: 8.5,
    points: [
      {
        id: "p1",
        type: "pickup",
        coordinates: {
          latitude: 35.74714809142824,
          longitude: -5.7985802189543705,
        },
        address: "Point de départ - Quartier Administratif, Tanger",
        estimatedTime: "14:30",
        actualTime: "14:30",
      },
      {
        id: "p1-user1",
        type: "waypoint",
        coordinates: {
          latitude: 35.76705935231749,
          longitude: -5.793577167187562,
        },
        address: "Ramassage - Avenue Mohammed V, Tanger",
        estimatedTime: "14:35",
        notes: "Client: Ahmed El Mansouri",
      },
      {
        id: "p1-user2",
        type: "waypoint",
        coordinates: {
          latitude: 35.7685332246877,
          longitude: -5.792229386640513,
        },
        address: "Ramassage - Boulevard Pasteur, Tanger",
        estimatedTime: "14:38",
        notes: "Client: Fatima Benali",
      },
      {
        id: "p1-user3",
        type: "waypoint",
        coordinates: {
          latitude: 35.77512012023446,
          longitude: -5.799244918896852,
        },
        address: "Ramassage - Place de France, Tanger",
        estimatedTime: "14:42",
        notes: "Client: Omar Khalil",
      },
      {
        id: "p2",
        type: "destination",
        coordinates: {
          latitude: 35.782766395856605,
          longitude: -5.807635259474145,
        },
        address: "Destination - Médina de Tanger",
        estimatedTime: "14:55",
      },
    ],
    vehicleId: "95700L15",
    customerInfo: {
      name: "Service Navette Médina",
      phone: "+212 5 39 12 34 56",
    },
  },
  // Terminé trip
  {
    id: "2",
    title: "Transport vers Zone Industrielle",
    status: "Termine",
    startTime: "09:00",
    endTime: "09:45",
    estimatedDuration: "35 min",
    actualDuration: "42 min",
    distance: 12.3,
    points: [
      {
        id: "p3",
        type: "pickup",
        coordinates: {
          latitude: 35.75848702325256,
          longitude: -5.826985119040287,
        },
        address: "Départ - Gare Tanger Ville",
        estimatedTime: "09:00",
        actualTime: "09:02",
      },
      {
        id: "p3-user1",
        type: "waypoint",
        coordinates: {
          latitude: 35.759847897470415,
          longitude: -5.847592763391704,
        },
        address: "Ramassage - Quartier Mesnana, Tanger",
        estimatedTime: "09:10",
        actualTime: "09:12",
        notes: "Client: Youssef Tazi",
      },
      {
        id: "p3-user2",
        type: "waypoint",
        coordinates: {
          latitude: 35.76054455941242,
          longitude: -5.854774617178275,
        },
        address: "Ramassage - Avenue des FAR, Tanger",
        estimatedTime: "09:15",
        actualTime: "09:18",
        notes: "Client: Aicha Benkirane",
      },
      {
        id: "p3-user3",
        type: "waypoint",
        coordinates: {
          latitude: 35.766716309045265,
          longitude: -5.857794933194618,
        },
        address: "Ramassage - Route de Tétouan, Tanger",
        estimatedTime: "09:25",
        actualTime: "09:28",
        notes: "Client: Hassan Alaoui",
      },
      {
        id: "p4",
        type: "destination",
        coordinates: {
          latitude: 35.772364693191996,
          longitude: -5.8581632597181565,
        },
        address: "Arrivée - Zone Industrielle Gzenaya",
        estimatedTime: "09:35",
        actualTime: "09:44",
      },
    ],
    vehicleId: "95700L15",
    customerInfo: {
      name: "Transport Employés ZI",
      phone: "+212 5 39 87 65 43",
    },
  },
  // À venir trip
  {
    id: "3",
    title: "Navette vers Aéroport",
    status: "A venir",
    startTime: "16:00",
    estimatedDuration: "40 min",
    distance: 15.8,
    points: [
      {
        id: "p5",
        type: "pickup",
        coordinates: {
          latitude: 35.740960477901844,
          longitude: -5.846590310618588,
        },
        address: "Départ - Hôtel Hilton Tanger",
        estimatedTime: "16:00",
      },
      {
        id: "p5-user1",
        type: "waypoint",
        coordinates: {
          latitude: 35.734089451695226,
          longitude: -5.866128088619073,
        },
        address: "Ramassage - Quartier Californie, Tanger",
        estimatedTime: "16:10",
        notes: "Client: Samira Berrada",
      },
      {
        id: "p5-user2",
        type: "waypoint",
        coordinates: {
          latitude: 35.72776512816995,
          longitude: -5.885467511633688,
        },
        address: "Ramassage - Route de Rabat, Tanger",
        estimatedTime: "16:20",
        notes: "Client: Mohamed Fassi",
      },
      {
        id: "p6",
        type: "destination",
        coordinates: {
          latitude: 35.725097129815275,
          longitude: -5.893624353665055,
        },
        address: "Arrivée - Aéroport Ibn Battouta, Tanger",
        estimatedTime: "16:40",
      },
    ],
    vehicleId: "95700L15",
    customerInfo: {
      name: "Service Navette Aéroport",
      phone: "+212 5 39 39 39 39",
    },
  },
];

// Updated POI for Tangier area
const mockPOI: PointOfInterest[] = [
  {
    id: "poi1",
    name: "Station Afriquia - Avenue Mohammed V",
    type: "station-service",
    coordinates: { latitude: 35.765, longitude: -5.82 },
    icon: "local-gas-station",
    description: "Ouvert 24h/24",
  },
  {
    id: "poi2",
    name: "Restaurant Le Saveur du Poisson",
    type: "restaurant",
    coordinates: { latitude: 35.77, longitude: -5.81 },
    icon: "restaurant",
    description: "Spécialités de poisson frais",
  },
  {
    id: "poi3",
    name: "Hôpital Mohamed V",
    type: "hopital",
    coordinates: { latitude: 35.78, longitude: -5.83 },
    icon: "local-hospital",
    description: "Urgences 24h/24",
  },
  {
    id: "poi4",
    name: "Parking Grand Socco",
    type: "parking",
    coordinates: { latitude: 35.774, longitude: -5.808 },
    icon: "local-parking",
    description: "Parking public payant",
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
  currentTrip: mockTrips[0], // Current trip in progress (En cours)
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
      // Start near the current trip starting point (Tangier coordinates)
      const mockLocation: Location = {
        latitude: 35.74714809142824,
        longitude: -5.7985802189543705,
        address: "Quartier Administratif, Tanger",
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
          // Simulate small location changes (driver moving)
          const newLocation: Location = {
            latitude: currentLoc.latitude + (Math.random() - 0.5) * 0.0005,
            longitude: currentLoc.longitude + (Math.random() - 0.5) * 0.0005,
            address: "Tanger, Maroc",
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
