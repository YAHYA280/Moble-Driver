import { AppointmentType } from "@/shared/types/calendar";

// Animation configurations
export const CALENDAR_CONFIG = {
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

// Appointment types
export const APPOINTMENT_TYPES: AppointmentType[] = [
  "visite-medicale",
  "formation",
  "entretien-rh",
  "maintenance",
  "reunion",
  "autre",
] as const;

// Type colors
export const TYPE_COLORS = {
  "visite-medicale": "#22c55e",
  formation: "#ef4444",
  "entretien-rh": "#3b82f6",
  maintenance: "#f59e0b",
  reunion: "#8b5cf6",
  autre: "#6b7280",
} as const;
