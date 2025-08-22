import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
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
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { RouteSheet } from "../../../shared/types/routeSheet";
import { useAuthStore } from "../../../store/authStore";
import { useRouteSheetStore } from "../../../store/routeSheetStore";
import { RouteSheetCard } from "./components/RouteSheetCard";
import { RouteSheetFilterBar } from "./components/RouteSheetFilterBar";

const AnimatedRouteSheetCard: React.FC<{
  item: RouteSheet;
  index: number;
  onPress: () => void;
  onEdit?: () => void;
}> = ({ item, index, onPress, onEdit }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 500,
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
              outputRange: [30, 0],
            }),
          },
        ],
      }}
    >
      <RouteSheetCard routeSheet={item} onPress={onPress} onEdit={onEdit} />
    </Animated.View>
  );
};

export const RouteSheetScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;

  const {
    routeSheets,
    filteredRouteSheets,
    filters,
    isLoading,
    error,
    fetchRouteSheets,
    setFilters,
    clearFilters,
    getCurrentMonthRouteSheet,
    clearError,
  } = useRouteSheetStore();

  const { logout } = useAuthStore();

  useEffect(() => {
    fetchRouteSheets();

    // Start animations
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fabAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isCurrentMonth = (routeSheet: RouteSheet) => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    return routeSheet.month === currentMonth;
  };

  const handleRouteSheetPress = (routeSheet: RouteSheet) => {
    // Navigate to route sheet view screen for all sheets
    router.push(`/(tabs)/routes/view/${routeSheet.id}`);
  };

  const handleEditRouteSheet = (routeSheet: RouteSheet) => {
    // Only allow editing current month
    if (isCurrentMonth(routeSheet)) {
      // Navigate to create page instead of edit page
      router.push("/(tabs)/routes/create");
    } else {
      Alert.alert(
        "Édition non autorisée",
        "Vous ne pouvez modifier que la feuille de route du mois en cours.",
        [{ text: "OK" }]
      );
    }
  };

  const handleCreateNewRouteSheet = async () => {
    // Navigate directly to the create route sheet screen
    router.push("/(tabs)/routes/create");
  };

  const handleRefresh = () => {
    fetchRouteSheets();
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
    router.push("/notifications?returnTo=/routes");
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleSearch = (query: string) => {
    setFilters({ searchQuery: query });
  };

  const sidebarItems = [
    {
      id: "routes",
      label: "Feuilles de route",
      icon: "file-text" as const,
      onPress: () => {
        setShowSidebar(false);
      },
      isActive: true,
    },
    {
      id: "create",
      label: "Créer nouvelle",
      icon: "plus-circle" as const,
      onPress: () => {
        setShowSidebar(false);
        handleCreateNewRouteSheet();
      },
      isActive: false,
    },
  ];

  const renderRouteSheetItem = ({
    item,
    index,
  }: {
    item: RouteSheet;
    index: number;
  }) => (
    <AnimatedRouteSheetCard
      item={item}
      index={index}
      onPress={() => handleRouteSheetPress(item)}
      onEdit={() => handleEditRouteSheet(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>📋</Text>
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucune feuille de route trouvée
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {Object.keys(filters).length > 0
          ? "Aucune feuille ne correspond à vos critères de recherche."
          : "Vos feuilles de route apparaîtront ici."}
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateNewRouteSheet}
        activeOpacity={0.7}
      >
        <Text style={[styles.createButtonText, { color: colors.primary }]}>
          Créer une feuille de route
        </Text>
      </TouchableOpacity>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    listContainer: {
      flex: 1,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingTop: 100,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyIconText: {
      fontSize: 48,
      opacity: 0.5,
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
      marginBottom: 24,
    },
    createButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: "600",
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
    fab: {
      position: "absolute",
      bottom: 100,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      elevation: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
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
          title="Feuilles de route"
          subtitle={`${filteredRouteSheets.length} feuille${
            filteredRouteSheets.length > 1 ? "s" : ""
          }`}
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

      {/* Filter Bar */}
      <RouteSheetFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Error Display */}
      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Route Sheets List */}
      <Animated.View
        style={[
          styles.listContainer,
          {
            opacity: listAnim,
            transform: [
              {
                translateY: listAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <FlatList
          data={filteredRouteSheets}
          renderItem={renderRouteSheetItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredRouteSheets.length === 0
              ? { flex: 1 }
              : { paddingBottom: 120 }
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
        placeholder="Rechercher par mois, année..."
        initialQuery={filters.searchQuery || ""}
        title="Rechercher feuilles de route"
      />

      {/* Modal-based Sidebar */}
      <Sidebar
        title="Feuilles de route"
        items={sidebarItems}
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};
