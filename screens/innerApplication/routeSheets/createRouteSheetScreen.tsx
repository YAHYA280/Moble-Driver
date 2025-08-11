// screens/innerApplication/routeSheets/createRouteSheetScreen.tsx

import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { useRouteSheetStore } from "../../../store/routeSheetStore";

export const CreateRouteSheetScreen: React.FC = () => {
  const { colors } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { createRouteSheet } = useRouteSheetStore();

  const handleMonthPress = (day: DateData) => {
    const monthYear = day.dateString.substring(0, 7); // YYYY-MM format
    setSelectedMonth(monthYear);
  };

  const handleCreateRouteSheet = async () => {
    if (!selectedMonth) return;

    setIsLoading(true);
    try {
      const newRouteSheet = await createRouteSheet(selectedMonth);
      // Navigate to edit the new route sheet
      router.replace(`/(tabs)/routes/edit/${newRouteSheet.id}`);
    } catch (error) {
      console.error("Error creating route sheet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMarkedDates = () => {
    if (!selectedMonth) return {};

    // Mark all days of the selected month
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const marked: any = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${selectedMonth}-${day.toString().padStart(2, "0")}`;
      marked[dateString] = {
        selected: true,
        selectedColor: colors.primary + "40",
        selectedTextColor: colors.primary,
      };
    }

    return marked;
  };

  const calendarTheme = {
    backgroundColor: colors.surface,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: "#ffffff",
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textTertiary,
    arrowColor: colors.primary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontFamily: "System",
    textMonthFontFamily: "System",
    textDayHeaderFontFamily: "System",
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    headerSection: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 20,
      lineHeight: 22,
    },
    calendarSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colors.isDark ? 0.3 : 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    helpText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    selectedMonthInfo: {
      backgroundColor: colors.primary + "15",
      padding: 16,
      borderRadius: 8,
      marginTop: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    selectedMonthText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
      marginBottom: 4,
    },
    selectedMonthSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    actionSection: {
      marginTop: "auto",
      paddingBottom: 20,
    },
    createButton: {
      marginBottom: 12,
    },
    cancelButton: {
      backgroundColor: "transparent",
    },
  });

  const getSelectedMonthName = () => {
    if (!selectedMonth) return "";
    const [year, month] = selectedMonth.split("-").map(Number);
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    return `${monthNames[month - 1]} ${year}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Nouvelle feuille de route"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Créer une feuille de route</Text>
          <Text style={styles.subtitle}>
            Sélectionnez le mois pour lequel vous souhaitez créer votre feuille
            de route. Vous pourrez ensuite saisir vos trajets quotidiens.
          </Text>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Choisir le mois</Text>
          <Text style={styles.helpText}>
            Touchez n'importe quel jour du mois que vous souhaitez sélectionner.
          </Text>

          <Calendar
            current={new Date().toISOString().split("T")[0]}
            onDayPress={handleMonthPress}
            markedDates={getMarkedDates()}
            theme={calendarTheme}
            hideExtraDays={true}
            firstDay={1} // Monday first
            enableSwipeMonths={true}
            showWeekNumbers={false}
            disableArrowLeft={false}
            disableArrowRight={false}
            minDate="2024-01-01"
            maxDate="2025-12-31"
          />

          {selectedMonth && (
            <View style={styles.selectedMonthInfo}>
              <Text style={styles.selectedMonthText}>
                Mois sélectionné : {getSelectedMonthName()}
              </Text>
              <Text style={styles.selectedMonthSubtext}>
                Une nouvelle feuille de route sera créée pour ce mois.
              </Text>
            </View>
          )}
        </View>

        {/* Action Section */}
        <View style={styles.actionSection}>
          <Button
            title="Créer la feuille de route"
            onPress={handleCreateRouteSheet}
            disabled={!selectedMonth}
            loading={isLoading}
            style={styles.createButton}
          />

          <Button
            title="Annuler"
            variant="outline"
            onPress={() => router.back()}
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
