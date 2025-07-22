import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Appointment } from "../../../../shared/types/calendar";
import { CALENDAR_CONFIG } from "../constants/calendarConstants";
import { AppointmentCard } from "./AppointmentCard";

interface AnimatedAppointmentCardProps {
  item: Appointment;
  index: number;
  onPress: () => void;
  showDate: boolean;
}

export const AnimatedAppointmentCard: React.FC<
  AnimatedAppointmentCardProps
> = ({ item, index, onPress, showDate }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const delay = index * CALENDAR_CONFIG.STAGGER_DELAY;
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(animValue, {
          toValue: 1,
          duration: CALENDAR_CONFIG.ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          ...CALENDAR_CONFIG.SPRING_CONFIG,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index, animValue, scaleValue]);

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
          { scale: scaleValue },
        ],
      }}
    >
      <AppointmentCard
        appointment={item}
        onPress={onPress}
        showDate={showDate}
      />
    </Animated.View>
  );
};
