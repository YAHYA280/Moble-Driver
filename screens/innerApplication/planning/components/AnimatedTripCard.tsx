// screens/innerApplication/planning/components/AnimatedTripCard.tsx
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Trip } from "../../../../shared/types/planning";
import { PLANNING_CONFIG } from "../constants/planningConstants";
import { TripCard } from "./TripCard";

interface AnimatedTripCardProps {
  item: Trip;
  index: number;
  onPress: () => void;
  showDate: boolean;
}

export const AnimatedTripCard: React.FC<AnimatedTripCardProps> = ({
  item,
  index,
  onPress,
  showDate,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const delay = index * PLANNING_CONFIG.STAGGER_DELAY;
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(animValue, {
          toValue: 1,
          duration: PLANNING_CONFIG.ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          ...PLANNING_CONFIG.SPRING_CONFIG,
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
      <TripCard trip={item} onPress={onPress} showDate={showDate} />
    </Animated.View>
  );
};
