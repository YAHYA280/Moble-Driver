// screens/innerApplication/fuelCards/fuelCardsScreen.tsx - Updated import fix
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
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
import { FuelCard } from "../../../shared/types/fuelCard";
import { useAuthStore } from "../../../store/authStore";
import { useFuelCardStore } from "../../../store/fuelCardStore";
import { useVehicleStore } from "../../../store/vehicleStore";
import { FuelCardItem } from "./components/FuelCardItem";

const AnimatedFuelCardItem: React.FC<{
  item: FuelCard;
  index: number;
  onPress: () => void;
}> = ({ item, index, onPress }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;
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
      <FuelCardItem fuelCard={item} onPress={onPress} />
    </Animated.View>
  );
};

export const FuelCardsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;

  const {
    filteredFuelCards,
    filters,
    isLoading,
    error,
    fetchFuelCards,
    setFilters,
    clearFilters,
    selectFuelCard,
    clearError,
  } = useFuelCardStore();

  const { logout } = useAuthStore();
  const { selectVehicle, vehicles } = useVehicleStore();

  useEffect(() => {
    fetchFuelCards();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFuelCardPress = (fuelCard: FuelCard) => {
    selectFuelCard(fuelCard);
    router.push(`./fuelcards/details/${fuelCard.id}`);
  };

  const handleRefresh = () => {
    fetchFuelCards();
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
    router.push("/notifications?returnTo=/fuelcards");
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
      label: "Liste véhicule",
      icon: "car" as const,
      onPress: () => {
        setShowSidebar(false);
        if (vehicles.length > 0) {
          selectVehicle(vehicles[0]);
        }
        router.push("/(tabs)/vehicles");
      },
      isActive: false,
    },
    {
      id: "incidents",
      label: "Créer Incidents",
      icon: "exclamation-triangle" as const,
      onPress: () => {
        setShowSidebar(false);
        if (vehicles.length > 0) {
          selectVehicle(vehicles[0]);
        }
        router.push("/(tabs)/incidents");
      },
      isActive: false,
    },
    {
      id: "history",
      label: "Liste des incidents",
      icon: "history" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/(tabs)/incidents/history");
      },
      isActive: false,
    },
    {
      id: "fuelcards",
      label: "Carte carburant",
      icon: "credit-card" as const,
      onPress: () => {
        setShowSidebar(false);
      },
      isActive: true,
    },
  ];

  const renderFuelCardItem = ({
    item,
    index,
  }: {
    item: FuelCard;
    index: number;
  }) => (
    <AnimatedFuelCardItem
      item={item}
      index={index}
      onPress={() => handleFuelCardPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <FontAwesome name="credit-card" size={32} color={colors.textTertiary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucune carte carburant
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        <ConditionalComponent
          isValid={Object.keys(filters).length > 0}
          defaultComponent="Vos cartes carburant apparaîtront ici."
        >
          Aucune carte ne correspond à vos critères de recherche.
        </ConditionalComponent>
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingTop: 100,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.backgroundTertiary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
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
          title="Cartes carburant"
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
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Main Content */}
      <Animated.View style={[{ flex: 1 }, { opacity: headerAnim }]}>
        <FlatList
          data={filteredFuelCards}
          renderItem={renderFuelCardItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredFuelCards.length === 0
              ? { flex: 1 }
              : { paddingBottom: 100, paddingTop: 16 }
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
      </Animated.View>

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        placeholder="Rechercher par numéro de carte, conducteur..."
        initialQuery={filters.searchQuery || ""}
        title="Rechercher cartes"
      />

      {/* Sidebar */}
      <Sidebar
        title="Carburant"
        items={sidebarItems}
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};
