import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Header } from "@/shared/components/ui/Header";
import { SearchModal } from "@/shared/components/ui/SearchModal";
import { useGeolocationStore } from "@/store/geolocationStore";
import { DateFilterModal } from "./components/DateFilterModal";
import { FilterHeader } from "./components/FilterHeader";
import { TripHistoryCard } from "./components/TripHistoryCard";

import type { Trip, TripStatus } from "@/shared/types/geolocation";

export const GeolocationHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDateFilterModal, setShowDateFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TripStatus | "Tous">(
    "Tous"
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { trips, isLoading, error, fetchTrips } = useGeolocationStore();

  useEffect(() => {
    fetchTrips();
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fetchTrips, headerAnim]);

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

    const matchesDateRange = true;

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleTripPress = (trip: Trip) => {
    router.push(`/(tabs)/geolocation/trip/${trip.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchTrips();
  };

  const handleDateFilter = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedStatus("Tous");
    setStartDate(null);
    setEndDate(null);
  };

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
  const hasActiveFilters = !!(
    searchQuery ||
    selectedStatus !== "Tous" ||
    startDate ||
    endDate
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="car-outline" size={64} color={colors.textTertiary} />
      <Text style={styles.emptyTitle}>Aucun trajet trouvé</Text>
      <Text style={styles.emptySubtitle}>
        {hasActiveFilters
          ? "Aucun trajet ne correspond à vos critères de recherche."
          : "Vos trajets apparaîtront ici une fois effectués."}
      </Text>
      <ConditionalComponent isValid={hasActiveFilters}>
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={clearAllFilters}
          activeOpacity={0.7}
        >
          <Text style={styles.clearFiltersText}>Effacer les filtres</Text>
        </TouchableOpacity>
      </ConditionalComponent>
    </View>
  );

  const renderTripItem = ({ item }: { item: Trip; index: number }) => (
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

      <FilterHeader
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        startDate={startDate}
        endDate={endDate}
        onDateFilterPress={() => setShowDateFilterModal(true)}
        onClearFilters={clearAllFilters}
        statusCounts={statusCounts}
        searchQuery={searchQuery}
      />

      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

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

      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        placeholder="Rechercher par titre, client, adresse..."
        initialQuery={searchQuery}
        title="Rechercher trajets"
      />

      <DateFilterModal
        visible={showDateFilterModal}
        onClose={() => setShowDateFilterModal(false)}
        onApply={handleDateFilter}
        currentStartDate={startDate}
        currentEndDate={endDate}
      />
    </SafeAreaView>
  );
};
