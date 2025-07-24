// screens/innerApplication/planning/components/PlanningEmptyState.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

interface PlanningEmptyStateProps {
  hasFilters: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  icon: {
    marginBottom: 16,
  },
  iconText: {
    fontSize: 48,
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});

export const PlanningEmptyState: React.FC<PlanningEmptyStateProps> = ({
  hasFilters,
}) => {
  const colors = useThemeColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.icon}>
        <Text style={styles.iconText}>🚌</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>
        Aucun trajet trouvé
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {hasFilters
          ? "Aucun trajet ne correspond à vos critères de recherche."
          : "Vos trajets planifiés apparaîtront ici."}
      </Text>
    </Animated.View>
  );
};
