// screens/innerApplication/planning/utils/planningUtils.ts
import { DAY_NAMES } from "../constants/planningConstants";

/**
 * Formats a date string to display format
 * @param dateString - ISO date string
 * @returns Object with formatted day number and day name
 */
export const formatDate = (dateString: string) => {
  if (!dateString) return { day: "", dayName: "" };

  const dateObj = new Date(dateString);
  const day = dateObj.getDate().toString().padStart(2, "0");
  const dayName = DAY_NAMES[dateObj.getDay()];

  return { day, dayName };
};

/**
 * Formats time string to HH:MM format
 * @param time - Time string
 * @returns Formatted time string
 */
export const formatTime = (time: string) => {
  return time.substring(0, 5);
};

/**
 * Gets the 7 days of the week starting from Monday for a given date
 * @param selectedDate - ISO date string
 * @returns Array of Date objects representing the week
 */
export const getWeekDays = (selectedDate: string) => {
  const date = new Date(selectedDate);
  const currentDay = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - currentDay + 1);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDays.push(day);
  }

  return weekDays;
};

/**
 * Formats a full date for display
 * @param dateString - ISO date string
 * @returns Formatted date string in French format
 */
export const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Checks if a date is today
 * @param dateString - ISO date string
 * @returns Boolean indicating if date is today
 */
export const isToday = (dateString: string) => {
  const today = new Date().toISOString().split("T")[0];
  return dateString === today;
};

/**
 * Gets the current date as ISO string
 * @returns ISO date string for today
 */
export const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};
