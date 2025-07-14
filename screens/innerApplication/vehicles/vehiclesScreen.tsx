// screens/innerApplication/vehicles/vehiclesScreen.tsx (Updated to add incidents in sidebar)
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { SearchModal } from "../../../shared/components/ui/SearchModal";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { Vehicle } from "../../../shared/types/vehicle";
import { useAuthStore } from "../../../store/authStore";
import { useVehicleStore } from "../../../store/vehicleStore";
import { AssignedVehicleCard } from "./components/AssignedVehicleCard";
import { VehicleHistoryCard } from "./components/VehicleHistoryCard";

const AnimatedAssignedVehicleCard: React.FC<{
  vehicle: Vehicle;
  onPress: () => void;
}> = ({ vehicle, onPress }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 200); // Start after header animation

    return () => clearTimeout(timer);
  }, [animValue]);

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      }}
    >
      <AssignedVehicleCard vehicle={vehicle} onPress={onPress} />
    </Animated.View>
  );
};

const AnimatedVehicleHistoryCard: React.FC<{
  item: Vehicle;
  index: number;
  onPress: () => void;
}> = ({ item, index, onPress }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = 400 + index * 80; // Start after assigned vehicle card
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index, animValue]);

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }),
          },
        ],
      }}
    >
      <VehicleHistoryCard vehicle={item} onPress={onPress} />
    </Animated.View>
  );
};

export const VehiclesScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  const {
    vehicles,
    filteredVehicles,
    filters,
    isLoading,
    error,
    fetchVehicles,
    setFilters,
    clearFilters,
    selectVehicle,
    clearError,
  } = useVehicleStore();

  const { logout } = useAuthStore();

  useEffect(() => {
    fetchVehicles();

    // Start header animation immediately
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleVehiclePress = (vehicle: Vehicle) => {
    selectVehicle(vehicle);
    router.push("/(tabs)/vehicles/details");
  };

  const handleRefresh = () => {
    fetchVehicles();
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          setShowSidebar(false);
          logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=/vehicles");
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleSearch = (query: string) => {
    setFilters({ searchQuery: query });
  };

  const sidebarItems = [
    {
      id: "vehicles",
      label: "Mon parc",
      icon: "car" as const,
      onPress: () => {
        setShowSidebar(false);
      },
      isActive: true,
    },
    {
      id: "incidents",
      label: "Incidents",
      icon: "exclamation-triangle" as const,
      onPress: () => {
        setShowSidebar(false);
        if (vehicles.length > 0) {
          selectVehicle(vehicles[0]);
        }
        router.push("./incidents");
      },
      isActive: false,
    },
    {
      id: "history",
      label: "Historique incidents",
      icon: "history" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/(tabs)/incidents/history");
      },
      isActive: false,
    },
  ];

  // Get the main assigned vehicle (first one or one with specific status)
  const assignedVehicle =
    vehicles.find((v) => v.status === "En service") || vehicles[0];

  // Get history vehicles (could be all vehicles or a subset)
  const historyVehicles = filteredVehicles;

  const renderHistoryItem = ({
    item,
    index,
  }: {
    item: Vehicle;
    index: number;
  }) => (
    <AnimatedVehicleHistoryCard
      item={item}
      index={index}
      onPress={() => handleVehiclePress(item)}
    />
  );

  const renderHistoryHeader = () => (
    <View style={styles.historyHeaderContainer}>
      <Text style={[styles.historyTitle, { color: colors.text }]}>
        Historique
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucun véhicule trouvé
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {Object.keys(filters).length > 0
          ? "Aucun véhicule ne correspond à vos critères de recherche."
          : "Vos véhicules apparaîtront ici."}
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    assignedVehicleContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    historyContainer: {
      flex: 1,
    },
    historyHeaderContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      paddingBottom: 8,
    },
    historyTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingTop: 100,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 22,
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
            onPress: () => setShowSidebar(true),
          }}
          title="Véhicules attribuées"
          rightIcons={[
            {
              icon: "search",
              onPress: handleSearchPress,
            },
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 3,
            },
          ]}
        />
      </Animated.View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        {/* Assigned Vehicle Card */}
        {assignedVehicle && (
          <View style={styles.assignedVehicleContainer}>
            <AnimatedAssignedVehicleCard
              vehicle={assignedVehicle}
              onPress={() => handleVehiclePress(assignedVehicle)}
            />
          </View>
        )}

        {/* History Section */}
        <View style={styles.historyContainer}>
          <FlatList
            data={historyVehicles}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => `history-${item.id}`}
            ListHeaderComponent={renderHistoryHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              historyVehicles.length === 0
                ? { flex: 1 }
                : { paddingBottom: 100 }
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
        </View>
      </View>

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        placeholder="Rechercher par plaque, modèle..."
        initialQuery={filters.searchQuery || ""}
        title="Rechercher véhicules"
      />

      {/* Sidebar */}
      <Sidebar
        title="Mon parc"
        items={sidebarItems}
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};
