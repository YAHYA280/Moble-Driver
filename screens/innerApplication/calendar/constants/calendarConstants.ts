import { AppointmentType } from "@/shared/types/calendar";

export const CALENDAR_CONFIG = {
  ANIMATION_DURATION: 600,
  STAGGER_DELAY: 100,
  SPRING_CONFIG: { tension: 100, friction: 8 },
  MAX_HEIGHT_PERCENTAGE: 0.8,
  MIN_HEIGHT_PERCENTAGE: 0.4,
} as const;
export const WEEK_DAYS = [
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
  "Dim",
] as const;

export const APPOINTMENT_TYPES: AppointmentType[] = [
  "visite-medicale",
  "formation",
  "entretien-rh",
  "maintenance",
  "reunion",
  "autre",
] as const;

export const TYPE_COLORS = {
  "visite-medicale": "#22c55e",
  formation: "#ef4444",
  "entretien-rh": "#3b82f6",
  maintenance: "#f59e0b",
  reunion: "#8b5cf6",
  autre: "#6b7280",
} as const;
