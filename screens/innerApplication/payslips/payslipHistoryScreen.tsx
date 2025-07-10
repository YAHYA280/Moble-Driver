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
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { Payslip } from "../../../shared/types/payslip";
import { useAuthStore } from "../../../store/authStore";
import { usePayslipStore } from "../../../store/payslipStore";
import { PayslipHistoriqueCard } from "./components/PayslipHistoriqueCard";
import { PayslipFilterBar } from "./components/payslipFilterBar";

interface YearGroup {
  year: number;
  payslips: Payslip[];
}

// Animated Payslip Historique Card Component
const AnimatedPayslipHistoriqueCard: React.FC<{
  item: Payslip;
  index: number;
}> = ({ item, index }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 80; // Slightly faster animation for archive view
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
      <PayslipHistoriqueCard
        id={item.id}
        monthYear={item.monthYear}
        netAmount={item.netSalary}
        status={item.status}
        availableDate={item.availableDate}
      />
    </Animated.View>
  );
};

export const PayslipHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
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

  // Group payslips by year
  const groupedPayslips: YearGroup[] = React.useMemo(() => {
    const groups: { [key: number]: Payslip[] } = {};

    filteredPayslips.forEach((payslip) => {
      if (!groups[payslip.year]) {
        groups[payslip.year] = [];
      }
      groups[payslip.year].push(payslip);
    });

    return Object.entries(groups)
      .map(([year, payslips]) => ({
        year: parseInt(year),
        payslips: payslips.sort((a, b) => b.month - a.month),
      }))
      .sort((a, b) => b.year - a.year);
  }, [filteredPayslips]);

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
    router.push("/notifications");
  };

  const handleSearchPress = () => {
    // This could open a search modal or navigate to a search screen
    Alert.alert("Recherche", "Fonctionnalité de recherche à venir");
  };

  const sidebarItems = [
    {
      id: "payslips",
      label: "Bulletins de paie",
      icon: "credit-card" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/(tabs)/payslips");
      },
      isActive: false,
    },
    {
      id: "history",
      label: "Historique",
      icon: "history" as const,
      onPress: () => {
        setShowSidebar(false);
        // Already on this screen
      },
      isActive: true,
    },
  ];

  const renderGroupItem = ({ item }: { item: YearGroup }) => (
    <View style={styles.groupContainer}>
      {item.payslips.map((payslip, index) => (
        <View key={payslip.id} style={styles.payslipItem}>
          <AnimatedPayslipHistoriqueCard item={payslip} index={index} />
        </View>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>📂</Text>
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucun historique trouvé
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {Object.keys(filters).length > 0
          ? "Aucun bulletin ne correspond à vos critères de recherche."
          : "Votre historique de bulletins apparaîtra ici."}
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
    groupContainer: {
      marginBottom: 20,
    },
    yearHeader: {
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    yearHeaderContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    yearIconContainer: {
      marginRight: 12,
    },
    yearIcon: {
      fontSize: 24,
    },
    yearInfo: {
      flex: 1,
    },
    yearText: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 2,
    },
    yearCount: {
      fontSize: 13,
      fontWeight: "500",
    },
    payslipItem: {
      marginBottom: 2,
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
          title="Historique bulletins"
          subtitle={`${filteredPayslips.length} document${
            filteredPayslips.length > 1 ? "s" : ""
          } archivé${filteredPayslips.length > 1 ? "s" : ""}`}
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

      {/* History List */}
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
          data={groupedPayslips}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.year.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            groupedPayslips.length === 0 ? { flex: 1 } : { paddingBottom: 100 }
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
        />
      </Animated.View>

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
