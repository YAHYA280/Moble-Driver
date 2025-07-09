// screens/innerApplication/payslips/payslipDetailsScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { PayslipBonus, PayslipDeduction } from "../../../shared/types/payslip";
import { usePayslipStore } from "../../../store/payslipStore";

export const PayslipDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { selectedPayslip, downloadPayslip } = usePayslipStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!selectedPayslip) {
      router.back();
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [selectedPayslip]);

  if (!selectedPayslip) {
    return null;
  }

  const handleDownload = async () => {
    if (selectedPayslip.status !== "available") {
      Alert.alert(
        "Bulletin non disponible",
        "Ce bulletin n'est pas encore disponible au téléchargement."
      );
      return;
    }

    try {
      await downloadPayslip(selectedPayslip.id);
      Alert.alert("Succès", "Le bulletin a été téléchargé avec succès.");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de télécharger le bulletin.");
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const totalDeductions = selectedPayslip.deductions.reduce(
    (sum, deduction) => sum + deduction.amount,
    0
  );

  const totalBonuses = selectedPayslip.bonuses.reduce(
    (sum, bonus) => sum + bonus.amount,
    0
  );

  const renderInfoRow = (
    label: string,
    value: string,
    isHighlighted = false
  ) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.infoValue,
          {
            color: isHighlighted ? colors.primary : colors.text,
            fontWeight: isHighlighted ? "700" : "600",
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );

  const renderDeductionItem = (deduction: PayslipDeduction) => (
    <View key={deduction.id} style={styles.listItem}>
      <View style={styles.listItemDot} />
      <Text style={[styles.listItemText, { color: colors.textSecondary }]}>
        {deduction.label} : {formatAmount(deduction.amount)}
      </Text>
    </View>
  );

  const renderBonusItem = (bonus: PayslipBonus) => (
    <View key={bonus.id} style={styles.listItem}>
      <View style={styles.listItemDot} />
      <Text style={[styles.listItemText, { color: colors.textSecondary }]}>
        {bonus.label} : {formatAmount(bonus.amount)}
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 120, // Extra space for tab bar
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24,
      textAlign: "left",
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    infoLabel: {
      fontSize: 16,
      fontWeight: "500",
      flex: 1,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "right",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
    },
    listItemDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.textTertiary,
      marginRight: 12,
    },
    listItemText: {
      fontSize: 14,
      fontWeight: "400",
      flex: 1,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderTopWidth: 2,
      borderTopColor: colors.border,
      marginTop: 8,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    totalAmount: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    pdfSection: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },
    pdfContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      width: "100%",
    },
    pdfIcon: {
      width: 40,
      height: 40,
      backgroundColor: colors.primary + "20",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    pdfInfo: {
      flex: 1,
    },
    pdfTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    pdfDetails: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    downloadButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      width: "100%",
    },
    downloadButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails bulletin de paie"
      />

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.subtitle}>
            Voici les détails de votre bulletin de paie
          </Text>

          {/* Basic Information */}
          <View style={styles.section}>
            {renderInfoRow("Mois et Année", selectedPayslip.monthYear)}
            {renderInfoRow(
              "Salaire Brut",
              formatAmount(selectedPayslip.grossSalary)
            )}
            {renderInfoRow(
              "Montant Net à Payer",
              formatAmount(selectedPayslip.netSalary),
              true
            )}
          </View>

          {/* Deductions */}
          {selectedPayslip.deductions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Déductions (cotisations CNSS, AMO, impôts, etc.)
              </Text>
              {selectedPayslip.deductions.map(renderDeductionItem)}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total des déductions</Text>
                <Text style={[styles.totalAmount, { color: colors.error }]}>
                  {formatAmount(totalDeductions)}
                </Text>
              </View>
            </View>
          )}

          {/* Bonuses */}
          {selectedPayslip.bonuses.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prime(s) éventuelle(s) :</Text>
              {selectedPayslip.bonuses.map(renderBonusItem)}
            </View>
          )}

          {/* PDF Document */}
          <View style={styles.section}>
            <View style={styles.pdfContainer}>
              <View style={styles.pdfIcon}>
                <FontAwesome
                  name="file-pdf-o"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.pdfInfo}>
                <Text style={styles.pdfTitle}>{selectedPayslip.id}.pdf</Text>
                <Text style={styles.pdfDetails}>
                  modifié le {selectedPayslip.createdDate}
                </Text>
                <Text style={styles.pdfDetails}>Taille: 3,2 Mo</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownload}
              disabled={selectedPayslip.status !== "available"}
            >
              <FontAwesome name="download" size={16} color="white" />
              <Text style={styles.downloadButtonText}>Télécharger</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
