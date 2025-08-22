import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import React from "react";
import {
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { Trip } from "../../../../../shared/types/planning";
import { AnimatedTripCard } from "../AnimatedTripCard";

interface TripsSectionProps {
  displayTrips: Trip[];
  sectionInfo: {
    title: string;
    subtitle: string;
  };
  calendarView: "month" | "week";
  onTripPress: (trip: Trip) => void;
  onRefresh: () => void;
  refreshing: boolean;
  upcomingOpacity: Animated.Value;
}

const styles = StyleSheet.create({
  upcomingSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 200,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  upcomingTripsContainer: {
    paddingTop: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export const TripsSection: React.FC<TripsSectionProps> = ({
  displayTrips,
  sectionInfo,
  calendarView,
  onTripPress,
  upcomingOpacity,
}) => {
  const { colors } = useTheme();

  const renderTripItem = ({ item, index }: { item: Trip; index: number }) => (
    <AnimatedTripCard
      item={item}
      index={index}
      onPress={() => onTripPress(item)}
      showDate={calendarView === "week"}
    />
  );

  const dynamicStyles = {
    upcomingSection: {
      ...styles.upcomingSection,
      backgroundColor: colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: { elevation: 8 },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    sectionHeader: {
      ...styles.sectionHeader,
      borderBottomColor: colors.border + "30",
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: colors.text,
    },
    sectionSubtitle: {
      ...styles.sectionSubtitle,
      color: colors.textSecondary,
    },
    emptyTitle: {
      ...styles.emptyTitle,
      color: colors.text,
    },
    emptyText: {
      ...styles.emptyText,
      color: colors.textSecondary,
    },
  };

  return (
    <Animated.View
      style={[dynamicStyles.upcomingSection, { opacity: upcomingOpacity }]}
    >
      <View style={dynamicStyles.sectionHeader}>
        <View>
          <Text style={dynamicStyles.sectionTitle}>{sectionInfo.title}</Text>
          <Text style={dynamicStyles.sectionSubtitle}>
            {sectionInfo.subtitle} • {displayTrips.length} trajet
            {displayTrips.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      <View style={styles.upcomingTripsContainer}>
        <ConditionalComponent
          isValid={displayTrips.length > 0}
          defaultComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🚌</Text>
              <Text style={dynamicStyles.emptyTitle}>Aucun trajet</Text>
              <Text style={dynamicStyles.emptyText}>
                {calendarView === "month"
                  ? "Aucun trajet prévu pour cette date."
                  : "Aucun trajet prévu pour cette semaine."}
              </Text>
            </View>
          }
        >
          <FlatList
            data={displayTrips}
            renderItem={renderTripItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
          />
        </ConditionalComponent>
      </View>
    </Animated.View>
  );
};
