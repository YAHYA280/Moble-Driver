// screens/innerApplication/planning/components/planning/ViewToggleSection.tsx
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";

interface ViewToggleSectionProps {
  calendarView: "month" | "week";
  onViewToggle: () => void;
  isViewChanging: boolean;
  toggleAnim: Animated.Value;
  toggleButtonScale: Animated.Value;
  toggleButtonOpacity: Animated.Value;
}

const styles = StyleSheet.create({
  viewToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  viewToggleText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});

export const ViewToggleSection: React.FC<ViewToggleSectionProps> = ({
  calendarView,
  onViewToggle,
  isViewChanging,
  toggleAnim,
  toggleButtonScale,
  toggleButtonOpacity,
}) => {
  const { colors } = useTheme();

  const dynamicStyles = {
    viewToggleButton: {
      ...styles.viewToggleButton,
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary + "30",
    },
    viewToggleText: {
      ...styles.viewToggleText,
      color: colors.primary,
    },
  };

  return (
    <Animated.View
      style={[
        styles.viewToggleContainer,
        {
          opacity: toggleAnim,
          transform: [
            {
              translateY: toggleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
            { scale: toggleButtonScale },
          ],
        },
      ]}
    >
      <Animated.View
        style={{
          opacity: toggleButtonOpacity,
        }}
      >
        <TouchableOpacity
          style={[
            dynamicStyles.viewToggleButton,
            {
              opacity: isViewChanging ? 0.8 : 1,
            },
          ]}
          onPress={onViewToggle}
          activeOpacity={0.7}
          disabled={isViewChanging}
        >
          <FontAwesome
            name={calendarView === "month" ? "calendar-o" : "calendar"}
            size={14}
            color={colors.primary}
          />
          <Text style={dynamicStyles.viewToggleText}>
            {calendarView === "month" ? "Vue semaine" : "Vue mois"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};
