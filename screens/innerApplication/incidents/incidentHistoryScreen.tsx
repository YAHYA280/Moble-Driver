import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
          color: "#F59E0B", // Orange color
        };
      case "Résolu":
        return {
          label: "Résolu",
          color: "#10B981", // Green color
        };
      default:
        return {
          label: item.status,
          color: "#6B7280",
        };
    }
  };

  const statusConfig = getStatusConfig();

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
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: colors.primary, // Primary purple color
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
    vehicleText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
      marginBottom: 8,
    },
    dateText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "400",
    },
    statusContainer: {
      alignItems: "flex-end",
      justifyContent: "center",
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: statusConfig.color,
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

        {/* Content - Main information */}
        <View style={styles.contentContainer}>
          <Text style={styles.incidentTitle} numberOfLines={1}>
            {item.type}
          </Text>
          <Text style={styles.vehicleText} numberOfLines={1}>
            {item.vehiclePlateNumber}
          </Text>
          <Text style={styles.dateText}>{item.reportDate}</Text>
        </View>

        {/* Right Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{statusConfig.label}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const IncidentHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const params = useLocalSearchParams();

  const {
    filteredIncidents,
    isLoading,
    error,
    fetchIncidents,
    selectIncident,
  } = useIncidentStore();

  useEffect(() => {
    fetchIncidents();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleIncidentPress = (incident: Incident) => {
    selectIncident(incident);
    router.push(`./details/${incident.id}`);
  };

  const handleBackPress = () => {
    const returnTo = params.returnTo as string;

    if (returnTo) {
      router.push(returnTo as any);
    } else {
      router.push("/(tabs)/vehicles");
    }
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
      {/* Animated Header with fixed navigation */}
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
            onPress: handleBackPress,
          }}
          title="Liste des incidents"
        />
      </Animated.View>

      {/* Error Display */}

      <ConditionalComponent isValid={Boolean(error)}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Main Content */}
      <Animated.View style={[{ flex: 1 }, { opacity: headerAnim }]}>
        <FlatList
          data={filteredIncidents}
          renderItem={renderIncidentItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredIncidents.length === 0
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
    </SafeAreaView>
  );
};
