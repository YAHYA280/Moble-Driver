// screens/innerApplication/planning/constants/planningConstants.ts
import { TripType } from "@/shared/types/planning";

// Animation configurations
export const PLANNING_CONFIG = {
  ANIMATION_DURATION: 600,
  STAGGER_DELAY: 100,
  SPRING_CONFIG: { tension: 100, friction: 8 },
  MAX_HEIGHT_PERCENTAGE: 0.8,
  MIN_HEIGHT_PERCENTAGE: 0.4,
} as const;

export const DAY_NAMES = [
  "Dim",
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
] as const;

// Week days for calendar display (Monday first)
export const WEEK_DAYS_DISPLAY = [
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
  "Dim",
] as const;

// Layout constants
export const LAYOUT_CONFIG = {
  TIME_CONTAINER_WIDTH: 60,
  MENU_BUTTON_SIZE: 32,
  EMPTY_ICON_SIZE: 48,
} as const;

// Trip types
export const TRIP_TYPES: TripType[] = [
  "ecole",
  "transport",
  "maintenance",
  "autre",
] as const;

// Type colors
export const TYPE_COLORS = {
  ecole: "#3b82f6",
  transport: "#22c55e",
  maintenance: "#f59e0b",
  autre: "#6b7280",
} as const;
