// screens/innerApplication/payslips/payslipsScreen.tsx
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
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { Payslip } from "../../../shared/types/payslip";
import { usePayslipStore } from "../../../store/payslipStore";
import { PayslipCard } from "./components/payslipCard";
import { PayslipFilterBar } from "./components/payslipFilterBar";

// Animated Payslip Card Component
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
    // Fixed: Use the correct route format matching the file structure
    router.push(`/payslips/details/${payslip.id}`);
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
        // Fixed: Use the correct route
        router.push("/(tabs)/payslips/history");
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
    mainContent: {
      flex: 1,
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
    // Sidebar specific styles
    sidebarOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
    sidebarContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: 280,
      zIndex: 1000,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <View style={styles.mainContent}>
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
            title="Bulletins de paie"
            subtitle={`${filteredPayslips.length} bulletin${
              filteredPayslips.length > 1 ? "s" : ""
            }`}
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
              filteredPayslips.length === 0
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
        </Animated.View>
      </View>

      {/* Sidebar Overlay and Container */}
      {showSidebar && (
        <>
          <TouchableOpacity
            style={styles.sidebarOverlay}
            onPress={() => setShowSidebar(false)}
            activeOpacity={1}
          />
          <View style={styles.sidebarContainer}>
            <Sidebar
              title="Paie"
              items={sidebarItems}
              onClose={() => setShowSidebar(false)}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
