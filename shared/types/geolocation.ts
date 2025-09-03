export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location extends Coordinates {
  address?: string;
  timestamp?: string;
}

export interface PointOfInterest {
  id: string;
  name: string;
  type: "station-service" | "restaurant" | "parking" | "hopital" | "autre";
  coordinates: Coordinates;
  icon: string;
  description?: string;
}

export type TripStatus = "A venir" | "En cours" | "Termine" | "Annule";

export interface TripPoint {
  id: string;
  type: "pickup" | "destination" | "waypoint";
  coordinates: Coordinates;
  address: string;
  estimatedTime?: string;
  actualTime?: string;
  notes?: string;
}

export interface Trip {
  id: string;
  title: string;
  status: TripStatus;
  startTime: string;
  endTime?: string;
  estimatedDuration: string;
  actualDuration?: string;
  distance: number;
  points: TripPoint[];
  vehicleId?: string;
  customerInfo?: {
    name: string;
    phone?: string;
  };
  notes?: string;
}

// Types de cartes compatibles avec react-native-maps
export type MapType = "roadmap" | "satellite" | "hybrid" | "terrain";

export interface MapSettings {
  mapType: MapType;
  nightMode: boolean;
  showTraffic: boolean;
  showPOI: boolean;
  autoFollow: boolean;
  updateInterval: number; // seconds
}

export interface NotificationSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  approachDistance: number; // meters
  routeChangeAlerts: boolean;
  missionAlerts: boolean;
}

export interface GeolocationSettings {
  map: MapSettings;
  notifications: NotificationSettings;
}

export interface GeolocationAlert {
  id: string;
  type:
    | "approach_pickup"
    | "approach_destination"
    | "route_change"
    | "mission_update";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  tripId?: string;
  coordinates?: Coordinates;
}

// Interface pour les régions de la carte (react-native-maps)
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Interface pour les résultats de directions
export interface DirectionsResult {
  distance: number;
  duration: number;
  coordinates: Coordinates[];
}

export interface GeolocationState {
  currentLocation: Location | null;
  trips: Trip[];
  currentTrip: Trip | null;
  pointsOfInterest: PointOfInterest[];
  alerts: GeolocationAlert[];
  settings: GeolocationSettings;
  isLoading: boolean;
  error: string | null;
  isLocationPermissionGranted: boolean;
  isTrackingActive: boolean;
}

export interface GeolocationActions {
  // Location tracking
  requestLocationPermission: () => Promise<boolean>;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  updateCurrentLocation: (location: Location) => void;

  // Trips management
  fetchTrips: () => Promise<void>;
  setCurrentTrip: (trip: Trip | null) => void;
  updateTripStatus: (tripId: string, status: TripStatus) => Promise<void>;

  // Points of Interest
  fetchPointsOfInterest: () => Promise<void>;
  addPointOfInterest: (poi: PointOfInterest) => Promise<void>;

  // Alerts
  addAlert: (alert: Omit<GeolocationAlert, "id" | "timestamp">) => void;
  markAlertAsRead: (alertId: string) => void;
  clearAlerts: () => void;

  // Settings
  updateSettings: (settings: Partial<GeolocationSettings>) => Promise<void>;

  // Utilities
  clearError: () => void;
}
