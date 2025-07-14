// screens/innerApplication/incidents/incidentHistoryScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
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
import { Incident } from "../../../shared/types/incident";
import { useIncidentStore } from "../../../store/incidentStore";

const AnimatedIncidentCard: React.FC<{
  item: Incident;
  index: number;
  onPress: () => void;
}> = ({ item, index, onPress }) => {
  const { colors } = useTheme();
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

  const getStatusConfig = () => {
    switch (item.status) {
      case "En Cours":
        return {
          label: "En Cours",
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "clock-o" as const,
        };
      case "Résolu":
        return {
          label: "Résolu",
          color: colors.success,
          backgroundColor: colors.success + "15",
          icon: "check" as const,
        };
      case "En attente":
        return {
          label: "En attente",
          color: colors.error,
          backgroundColor: colors.error + "15",
          icon: "times" as const,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getIconBackgroundColor = () => {
    switch (item.status) {
      case "En Cours":
        return "#f59e0b";
      case "Résolu":
        return "#22c55e";
      case "En attente":
        return "#ef4444";
      default:
        return "#6366f1";
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: getIconBackgroundColor(),
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
    },
    incidentTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    vehicleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    vehicleText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    statusLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: statusConfig.color,
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "center",
      marginLeft: 12,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.isDark
        ? colors.surfaceSecondary
        : "rgba(0, 0, 0, 0.05)",
    },
  });

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
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome name="exclamation-triangle" size={20} color="white" />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.incidentTitle} numberOfLines={1}>
            {item.type}
          </Text>

          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleText}>
              {item.reportDate} • {item.vehiclePlateNumber}
            </Text>
          </View>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          <Text style={styles.statusLabel}>{statusConfig.label}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const IncidentHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;

  const {
    filteredIncidents,
    isLoading,
    error,
    fetchIncidents,
    selectIncident,
  } = useIncidentStore();

  useEffect(() => {
    fetchIncidents();

    // Start header animation
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleIncidentPress = (incident: Incident) => {
    selectIncident(incident);
    // In a real app, navigate to incident details
    console.log("Incident details:", incident);
  };

  const handleRefresh = () => {
    fetchIncidents();
  };

  const renderIncidentItem = ({
    item,
    index,
  }: {
    item: Incident;
    index: number;
  }) => (
    <AnimatedIncidentCard
      item={item}
      index={index}
      onPress={() => handleIncidentPress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.historyTitle, { color: colors.text }]}>
        Historique des incidents
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <FontAwesome
          name="exclamation-triangle"
          size={32}
          color={colors.textTertiary}
        />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucun incident signalé
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Vos signalements d&apos;incidents apparaîtront ici.
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    headerContainer: {
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
          title="Historique des incidents"
        />
      </Animated.View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Main Content */}
      <Animated.View style={[{ flex: 1 }, { opacity: headerAnim }]}>
        <FlatList
          data={filteredIncidents}
          renderItem={renderIncidentItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredIncidents.length === 0
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
    </SafeAreaView>
  );
};
