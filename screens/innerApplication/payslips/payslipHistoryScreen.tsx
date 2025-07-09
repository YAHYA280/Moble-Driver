import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
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
import { usePayslipStore } from "../../../store/payslipStore";
import { PayslipCard } from "./components/payslipCard";
import { PayslipFilterBar } from "./components/payslipFilterBar";

interface YearGroup {
  year: number;
  payslips: Payslip[];
}

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
              outputRange: [20, 0],
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
    selectPayslip,
    downloadPayslip,
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

  const handlePayslipPress = (payslip: Payslip) => {
    selectPayslip(payslip);
    router.push({
      pathname: "/innerApplication/payslips/details/[id]" as any,
      params: { id: payslip.id },
    });
  };

  const handleDownloadPayslip = async (payslip: Payslip) => {
    try {
      await downloadPayslip(payslip.id);
    } catch (error) {
      // Error handling is done in the store
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
        router.push("/innerApplication/payslips");
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

  const renderYearHeader = (year: number, count: number) => (
    <View style={[styles.yearHeader, { backgroundColor: colors.surface }]}>
      <Text style={[styles.yearText, { color: colors.text }]}>{year}</Text>
      <Text style={[styles.yearCount, { color: colors.textSecondary }]}>
        {count} bulletin{count > 1 ? "s" : ""}
      </Text>
    </View>
  );

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

  const renderGroupItem = ({ item }: { item: YearGroup }) => (
    <View style={styles.groupContainer}>
      {renderYearHeader(item.year, item.payslips.length)}
      {item.payslips.map((payslip, index) => (
        <View key={payslip.id} style={styles.payslipItem}>
          {renderPayslipItem({ item: payslip, index })}
        </View>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
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
    mainContent: {
      flex: 1,
    },
    sidebarContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: 280,
      zIndex: 1000,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
    listContainer: {
      flex: 1,
    },
    groupContainer: {
      marginBottom: 16,
    },
    yearHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    yearText: {
      fontSize: 18,
      fontWeight: "600",
    },
    yearCount: {
      fontSize: 14,
      fontWeight: "500",
    },
    payslipItem: {
      marginBottom: 4,
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
      {/* Sidebar */}
      {showSidebar && (
        <>
          <View
            style={styles.overlay}
            onTouchStart={() => setShowSidebar(false)}
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
            title="Historique bulletins"
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
              groupedPayslips.length === 0
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
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};
