// shared/components/ui/AppointmentTypeDot.tsx
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { APPOINTMENT_TYPE_COLORS, AppointmentType } from "../../types/calendar";

interface AppointmentTypeDotProps {
  type: AppointmentType;
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
}

const DOT_SIZES = {
  small: 6,
  medium: 8,
  large: 12,
};

const AppointmentTypeDot: React.FC<AppointmentTypeDotProps> = ({
  type,
  size = "medium",
  style,
}) => {
  const dotSize = DOT_SIZES[size];
  const color = APPOINTMENT_TYPE_COLORS[type];

  const styles = StyleSheet.create({
    dot: {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      backgroundColor: color,
    },
  });

  return <View style={[styles.dot, style]} />;
};

export { AppointmentTypeDot };
