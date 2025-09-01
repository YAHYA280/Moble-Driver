import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  RefreshControl,
  ScrollView,
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
import { useDemandeStore } from "../../../store/demandeStore";
import { DemandeCard } from "./components/DemandeCard";
import { DemandeFilterModal } from "./components/DemandeFilterModal";

export const DemandesScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const {
    demandes,
    filteredDemandes,
    filters,
    isLoading,
    error,
    fetchDemandes,
    selectDemande,
    setFilters,
    clearFilters,
    clearError,
  } = useDemandeStore();

  useEffect(() => {
    fetchDemandes();

    // Animations
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 200);
  }, []);

  const handleRefresh = () => {
    fetchDemandes();
  };

  const handleSearch = (query: string) => {
    setFilters({ searchQuery: query });
  };

  const handleDemandePress = (demande: any) => {
    selectDemande(demande);
    router.push(`/demandes/detail/${demande.id}`);
  };

  const handleAddDemande = () => {
    setShowSidebar(false);
    router.push("/demandes/add");
  };

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=/demandes");
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          setShowSidebar(false);
          router.replace("/auth/login");
        },
      },
    ]);
  };

  // SIMPLIFIED: Only 2 sidebar items
  const sidebarItems = [
    {
      id: "all",
      label: "Toutes les demandes",
      icon: "clipboard" as const,
      onPress: () => {
        clearFilters();
        setShowSidebar(false);
      },
      isActive: true,
    },
    {
      id: "add",
      label: "Nouvelle demande",
      icon: "plus" as const,
      onPress: handleAddDemande,
      isActive: false,
    },
  ];

  // Get stats for header
  const pendingCount = demandes.filter((d) => d.status === "pending").length;
  const acceptedCount = demandes.filter((d) => d.status === "accepted").length;
  const refusedCount = demandes.filter((d) => d.status === "refused").length;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    androidHeaderFix: {
      position: "relative",
    },
    androidIconOverlay: {
      position: "absolute",
      top: 0,
      right: 16,
      height: "100%",
      width: 120,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingRight: 8,
      gap: 4,
    },
    androidHeaderCompressed: {
      transform: [{ scaleX: 0.85 }],
      transformOrigin: "right",
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    statsContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 20,
      gap: 12,
    },
    statCard: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    pendingCard: {
      backgroundColor: "#f59e0b" + "15",
    },
    acceptedCard: {
      backgroundColor: "#22c55e" + "15",
    },
    refusedCard: {
      backgroundColor: "#ef4444" + "15",
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 4,
    },
    pendingNumber: {
      color: "#f59e0b",
    },
    acceptedNumber: {
      color: "#22c55e",
    },
    refusedNumber: {
      color: "#ef4444",
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "500",
      textAlign: "center",
      color: colors.textSecondary,
    },
    actionsContainer: {
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
      marginLeft: 8,
    },
    sectionContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sectionHeader: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    demandesContainer: {
      gap: 12,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 60,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundTertiary,
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 24,
    },
    emptyButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      backgroundColor: colors.primary,
    },
    emptyButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
      marginLeft: 8,
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
      {/* Header */}
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
        {/* Wrapper to fix Android icon spacing without modifying Header component */}
        <View
          style={Platform.OS === "android" ? styles.androidHeaderFix : null}
        >
          <Header
            leftIcon={{
              icon: "bars",
              onPress: () => setShowSidebar(true),
            }}
            title="Mes demandes"
            rightIcons={[
              {
                icon: "filter",
                onPress: () => setShowFilterModal(true),
                size: 16,
              },
              {
                icon: "search",
                onPress: () => setShowSearchModal(true),
                size: 16,
              },
              {
                icon: "bell",
                onPress: handleNotificationPress,
                badge: 2,
                size: 16,
              },
            ]}
          />

          {/* Android-specific overlay to reduce icon spacing */}
          {Platform.OS === "android" && (
            <View style={styles.androidIconOverlay}>
              {/* This invisible overlay helps reduce visual spacing */}
            </View>
          )}
        </View>
      </Animated.View>

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: contentAnim }]}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, styles.pendingCard]}>
              <Text style={[styles.statNumber, styles.pendingNumber]}>
                {pendingCount}
              </Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>

            <View style={[styles.statCard, styles.acceptedCard]}>
              <Text style={[styles.statNumber, styles.acceptedNumber]}>
                {acceptedCount}
              </Text>
              <Text style={styles.statLabel}>Acceptées</Text>
            </View>

            <View style={[styles.statCard, styles.refusedCard]}>
              <Text style={[styles.statNumber, styles.refusedNumber]}>
                {refusedCount}
              </Text>
              <Text style={styles.statLabel}>Refusées</Text>
            </View>
          </View>

          {/* Add Button */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddDemande}
              activeOpacity={0.8}
            >
              <FontAwesome name="plus" size={16} color="white" />
              <Text style={styles.addButtonText}>Nouvelle demande</Text>
            </TouchableOpacity>
          </View>

          {/* Demandes List */}
          <View style={styles.sectionContainer}>
            {/* Simplified Section Header - Removed filter buttons */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Historique des demandes</Text>
            </View>

            <ConditionalComponent
              isValid={filteredDemandes.length > 0}
              defaultComponent={
                <View style={styles.emptyState}>
                  <View style={styles.emptyIcon}>
                    <FontAwesome
                      name="clipboard"
                      size={32}
                      color={colors.textTertiary}
                    />
                  </View>
                  <Text style={styles.emptyTitle}>Aucune demande</Text>
                  <Text style={styles.emptySubtitle}>
                    <ConditionalComponent
                      isValid={Object.keys(filters).length > 0}
                      defaultComponent="Vous n'avez encore fait aucune demande. Commencez par créer votre première demande de congé."
                    >
                      Aucune demande ne correspond à vos critères de recherche.
                    </ConditionalComponent>
                  </Text>
                  <ConditionalComponent
                    isValid={Object.keys(filters).length === 0}
                  >
                    <TouchableOpacity
                      style={styles.emptyButton}
                      onPress={handleAddDemande}
                    >
                      <FontAwesome name="plus" size={16} color="white" />
                      <Text style={styles.emptyButtonText}>
                        Créer une demande
                      </Text>
                    </TouchableOpacity>
                  </ConditionalComponent>
                </View>
              }
            >
              <View style={styles.demandesContainer}>
                {filteredDemandes.map((demande, index) => (
                  <DemandeCard
                    key={demande.id}
                    demande={demande}
                    onPress={() => handleDemandePress(demande)}
                  />
                ))}
              </View>
            </ConditionalComponent>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        placeholder="Rechercher des demandes..."
        initialQuery={filters.searchQuery || ""}
        title="Rechercher demandes"
      />

      {/* Filter Modal */}
      <DemandeFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={setFilters}
        onClearFilters={clearFilters}
        currentFilters={filters}
      />

      {/* SIMPLIFIED Sidebar - Only 2 items */}
      <Sidebar
        title="Mes demandes"
        items={sidebarItems}
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};
