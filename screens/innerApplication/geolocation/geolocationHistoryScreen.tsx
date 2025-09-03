// screens/innerApplication/geolocation/geolocationHistoryScreen.tsx
import { useThemeColors } from "@/hooks/useTheme";
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { SearchModal } from "../../../shared/components/ui/SearchModal";
import { Trip, TripStatus } from "../../../shared/types/geolocation";
import { useGeolocationStore } from "../../../store/geolocationStore";

const TripHistoryCard: React.FC<{
  trip: Trip;
  onPress: () => void;
}> = ({ trip, onPress }) => {
  const colors = useThemeColors();

  const getStatusColor = () => {
    switch (trip.status) {
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

  const getStatusIcon = () => {
    switch (trip.status) {
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

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    titleContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    customer: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: getStatusColor() + "15",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: getStatusColor(),
      marginLeft: 4,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    infoIcon: {
      marginRight: 8,
      width: 16,
      textAlign: "center",
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
    },
    routeInfo: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
    },
    routeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 2,
    },
    routeIcon: {
      marginRight: 8,
    },
    routeText: {
      flex: 1,
      fontSize: 12,
      color: colors.textSecondary,
    },
    pickupText: {
      color: colors.info,
      fontWeight: "500",
    },
    destinationText: {
      color: colors.error,
      fontWeight: "500",
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {trip.title}
          </Text>
          <ConditionalComponent isValid={!!trip.customerInfo?.name}>
            <Text style={styles.customer} numberOfLines={1}>
              {trip.customerInfo?.name}
            </Text>
          </ConditionalComponent>
        </View>

        <View style={styles.statusContainer}>
          <Ionicons
            name={getStatusIcon() as any}
            size={14}
            color={getStatusColor()}
          />
          <Text style={styles.statusText}>{trip.status}</Text>
        </View>
      </View>

      {/* Trip Info */}
      <View style={styles.infoRow}>
        <Ionicons
          name="time-outline"
          size={16}
          color={colors.textSecondary}
          style={styles.infoIcon}
        />
        <Text style={styles.infoText}>
          {trip.startTime} • {trip.estimatedDuration}
          {trip.actualDuration && ` (réel: ${trip.actualDuration})`}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="speedometer-outline"
          size={16}
          color={colors.textSecondary}
          style={styles.infoIcon}
        />
        <Text style={styles.infoText}>Distance: {trip.distance} km</Text>
      </View>

      {/* Route Information */}
      <View style={styles.routeInfo}>
        {trip.points.map((point, index) => (
          <View key={point.id} style={styles.routeRow}>
            <Ionicons
              name={point.type === "pickup" ? "arrow-up-circle" : "location"}
              size={12}
              color={point.type === "pickup" ? colors.info : colors.error}
              style={styles.routeIcon}
            />
            <Text
              style={[
                styles.routeText,
                point.type === "pickup"
                  ? styles.pickupText
                  : styles.destinationText,
              ]}
              numberOfLines={1}
            >
              {point.address}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export const GeolocationHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TripStatus | "Tous">(
    "Tous"
  );

  const { trips, isLoading, error, fetchTrips, clearError } =
    useGeolocationStore();

  useEffect(() => {
    fetchTrips();

    // Animate header
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter trips based on search and status
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      searchQuery === "" ||
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.customerInfo?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      trip.points.some((point) =>
        point.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      selectedStatus === "Tous" || trip.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleTripPress = (trip: Trip) => {
    // Fix: Navigate to the correct geolocation trip details route
    router.push(`/(tabs)/geolocation/trip/${trip.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchTrips();
  };

  const statusOptions: Array<TripStatus | "Tous"> = [
    "Tous",
    "En cours",
    "A venir",
    "Termine",
    "Annule",
  ];

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      Tous: trips.length,
      "En cours": 0,
      "A venir": 0,
      Termine: 0,
      Annule: 0,
    };

    trips.forEach((trip) => {
      counts[trip.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const renderStatusFilter = () => (
    <View style={styles.filterContainer}>
      <FlatList
        horizontal
        data={statusOptions}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedStatus === item && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedStatus(item)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedStatus === item && styles.activeFilterButtonText,
              ]}
            >
              {item} ({statusCounts[item]})
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="car-outline" size={64} color={colors.textTertiary} />
      <Text style={styles.emptyTitle}>Aucun trajet trouvé</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedStatus !== "Tous"
          ? "Aucun trajet ne correspond à vos critères de recherche."
          : "Vos trajets apparaîtront ici une fois effectués."}
      </Text>
      <ConditionalComponent
        isValid={!!(searchQuery || selectedStatus !== "Tous")}
      >
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={() => {
            setSearchQuery("");
            setSelectedStatus("Tous");
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.clearFiltersText}>Effacer les filtres</Text>
        </TouchableOpacity>
      </ConditionalComponent>
    </View>
  );

  const renderTripItem = ({ item, index }: { item: Trip; index: number }) => (
    <Animated.View
      style={{
        opacity: headerAnim,
        transform: [
          {
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <TripHistoryCard trip={item} onPress={() => handleTripPress(item)} />
    </Animated.View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    filterContainer: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterContent: {
      paddingHorizontal: 16,
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeFilterButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    activeFilterButtonText: {
      color: "white",
    },
    errorContainer: {
      backgroundColor: colors.error + "15",
      margin: 16,
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "500",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
      paddingTop: 100,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginTop: 24,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 24,
    },
    clearFiltersButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    clearFiltersText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
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
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Historique des trajets"
          rightIcons={[
            {
              icon: "search",
              onPress: () => setShowSearchModal(true),
            },
          ]}
        />
      </Animated.View>

      {/* Status Filter */}
      {renderStatusFilter()}

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Trips List */}
      <FlatList
        data={filteredTrips}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredTrips.length === 0 ? { flex: 1 } : { paddingBottom: 100 }
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
      />

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        placeholder="Rechercher par titre, client, adresse..."
        initialQuery={searchQuery}
        title="Rechercher trajets"
      />
    </SafeAreaView>
  );
};
