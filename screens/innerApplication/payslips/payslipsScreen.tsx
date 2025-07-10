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
import { Payslip } from "../../../shared/types/payslip";
import { useAuthStore } from "../../../store/authStore";
import { usePayslipStore } from "../../../store/payslipStore";
import { PayslipCard } from "./components/payslipCard";
import { PayslipFilterBar } from "./components/payslipFilterBar";

const AnimatedPayslipCard: React.FC<{
  item: Payslip;
  index: number;
  onViewDetails: () => void;
  onDownload: () => void;
}> = ({ item, index, onViewDetails, onDownload }) => {
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
      <PayslipCard
        id={item.id}
        monthYear={item.monthYear}
        netAmount={item.netSalary}
        status={item.status}
        availableDate={item.availableDate}
        onViewDetails={onViewDetails}
        onDownload={onDownload}
      />
    </Animated.View>
  );
};

export const PayslipsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  const {
    payslips,
    filteredPayslips,
    filters,
    isLoading,
    error,
    fetchPayslips,
    setFilters,
    clearFilters,
    selectPayslip,
    downloadPayslip,
    clearError,
  } = usePayslipStore();

  const { logout } = useAuthStore();

  useEffect(() => {
    fetchPayslips();

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
    ]).start();
  }, []);

  const handlePayslipPress = (payslip: Payslip) => {
    selectPayslip(payslip);
    const encodedId = encodeURIComponent(payslip.id);
    router.push(`/payslips/details/${encodedId}`);
  };

  const handleDownloadPayslip = async (payslip: Payslip) => {
    if (payslip.status !== "available") {
      Alert.alert(
        "Bulletin non disponible",
        "Ce bulletin n'est pas encore disponible au téléchargement."
      );
      return;
    }

    try {
      await downloadPayslip(payslip.id);
      Alert.alert("Succès", "Le bulletin a été téléchargé avec succès.");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de télécharger le bulletin.");
    }
  };

  const handleRefresh = () => {
    fetchPayslips();
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
    router.push("/notifications?returnTo=/payslips");
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleSearch = (query: string) => {
    setFilters({ searchQuery: query });
  };

  const sidebarItems = [
    {
      id: "payslips",
      label: "Bulletins de paie",
      icon: "credit-card" as const,
      onPress: () => {
        setShowSidebar(false);
      },
      isActive: true,
    },
    {
      id: "history",
      label: "Historique",
      icon: "history" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/payslips/history");
      },
      isActive: false,
    },
  ];

  const renderPayslipItem = ({
    item,
    index,
  }: {
    item: Payslip;
    index: number;
  }) => (
    <AnimatedPayslipCard
      item={item}
      index={index}
      onViewDetails={() => handlePayslipPress(item)}
      onDownload={() => handleDownloadPayslip(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucun bulletin trouvé
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {Object.keys(filters).length > 0
          ? "Aucun bulletin ne correspond à vos critères de recherche."
          : "Vos bulletins de paie apparaîtront ici."}
      </Text>
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
      {/* Animated Header with Search and Notification Icons */}
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
          title="Bulletins de paie"
          subtitle={`${filteredPayslips.length} bulletin${
            filteredPayslips.length > 1 ? "s" : ""
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
      <PayslipFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Payslips List */}
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
          data={filteredPayslips}
          renderItem={renderPayslipItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredPayslips.length === 0 ? { flex: 1 } : { paddingBottom: 100 }
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
        placeholder="Rechercher par mois, montant..."
        initialQuery={filters.searchQuery || ""}
        title="Rechercher bulletins"
      />

      {/* Modal-based Sidebar */}
      <Sidebar
        title="Bulletin de paie"
        items={sidebarItems}
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};
