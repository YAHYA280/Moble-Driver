// screens/innerApplication/payslips/payslipDetailsScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
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

  const totalAdvances = selectedPayslip.advances.reduce(
    (sum, advance) => sum + advance.amount,
    0
  );

  const overtimeAmount =
    selectedPayslip.overtimeHours * selectedPayslip.overtimeRate;

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );

  const renderInfoRow = (
    label: string,
    value: string | number,
    isAmount = false
  ) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>
        {isAmount ? formatAmount(Number(value)) : value}
      </Text>
    </View>
  );

  const renderDeductionItem = (deduction: PayslipDeduction) => (
    <View key={deduction.id} style={styles.itemRow}>
      <Text style={[styles.itemLabel, { color: colors.textSecondary }]}>
        {deduction.label}
      </Text>
      <Text style={[styles.itemAmount, { color: colors.error }]}>
        -{formatAmount(deduction.amount)}
      </Text>
    </View>
  );

  const renderBonusItem = (bonus: PayslipBonus) => (
    <View key={bonus.id} style={styles.itemRow}>
      <Text style={[styles.itemLabel, { color: colors.textSecondary }]}>
        {bonus.label}
      </Text>
      <Text style={[styles.itemAmount, { color: colors.success }]}>
        +{formatAmount(bonus.amount)}
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
      paddingBottom: 100,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
      marginHorizontal: 16,
    },
    sectionContent: {
      marginHorizontal: 16,
      borderRadius: 12,
      padding: 16,
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
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: "500",
    },
    infoValue: {
      fontSize: 16,
      fontWeight: "600",
    },
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    itemLabel: {
      fontSize: 14,
      fontWeight: "500",
      flex: 1,
    },
    itemAmount: {
      fontSize: 14,
      fontWeight: "600",
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
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: "700",
    },
    footer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    downloadButton: {
      marginBottom: 8,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
      marginLeft: 4,
    },
    pdfContainer: {
      backgroundColor: colors.primary + "10",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 16,
    },
    pdfText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
      marginBottom: 8,
    },
    pdfSize: {
      fontSize: 12,
      color: colors.textTertiary,
    },
  });

  const getStatusColor = () => {
    switch (selectedPayslip.status) {
      case "available":
        return colors.success;
      case "pending":
        return colors.warning;
      case "processing":
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = () => {
    switch (selectedPayslip.status) {
      case "available":
        return "Disponible";
      case "pending":
        return "En attente";
      case "processing":
        return "En cours";
      default:
        return "Inconnu";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails bulletin"
        subtitle={selectedPayslip.monthYear}
      />

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Basic Information */}
          {renderSection(
            "Informations générales",
            <>
              {renderInfoRow("Mois et Année", selectedPayslip.monthYear)}
              {renderInfoRow("Salaire Brut", selectedPayslip.grossSalary, true)}
              {renderInfoRow(
                "Montant Net à Payer",
                selectedPayslip.netSalary,
                true
              )}
              {renderInfoRow(
                "Période de paie",
                `${selectedPayslip.payPeriodStart} - ${selectedPayslip.payPeriodEnd}`
              )}
              {renderInfoRow("Employé", selectedPayslip.employeeName)}
              {renderInfoRow("Poste", selectedPayslip.employeePosition)}
            </>
          )}

          {/* Deductions */}
          {selectedPayslip.deductions.length > 0 &&
            renderSection(
              "Déductions (cotisations CNSS, AMO, impôts, etc.)",
              <>
                {selectedPayslip.deductions.map(renderDeductionItem)}
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.text }]}>
                    Total des déductions
                  </Text>
                  <Text style={[styles.totalAmount, { color: colors.error }]}>
                    -{formatAmount(totalDeductions)}
                  </Text>
                </View>
              </>
            )}

          {/* Bonuses */}
          {selectedPayslip.bonuses.length > 0 &&
            renderSection(
              "Prime(s) éventuelle(s)",
              <>
                {selectedPayslip.bonuses.map(renderBonusItem)}
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.text }]}>
                    Total des primes
                  </Text>
                  <Text style={[styles.totalAmount, { color: colors.success }]}>
                    +{formatAmount(totalBonuses)}
                  </Text>
                </View>
              </>
            )}

          {/* Overtime */}
          {selectedPayslip.overtimeHours > 0 &&
            renderSection(
              "Heures supplémentaires",
              <>
                {renderInfoRow(
                  "Heures supplémentaires",
                  `${selectedPayslip.overtimeHours}h`
                )}
                {renderInfoRow(
                  "Taux horaire",
                  selectedPayslip.overtimeRate,
                  true
                )}
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.text }]}>
                    Total heures sup.
                  </Text>
                  <Text style={[styles.totalAmount, { color: colors.success }]}>
                    +{formatAmount(overtimeAmount)}
                  </Text>
                </View>
              </>
            )}

          {/* Advances */}
          {selectedPayslip.advances.length > 0 &&
            renderSection(
              "Avances sur salaire",
              <>
                {selectedPayslip.advances.map((advance) => (
                  <View key={advance.id} style={styles.itemRow}>
                    <Text
                      style={[
                        styles.itemLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {advance.label} ({advance.date})
                    </Text>
                    <Text style={[styles.itemAmount, { color: colors.error }]}>
                      -{formatAmount(advance.amount)}
                    </Text>
                  </View>
                ))}
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.text }]}>
                    Total des avances
                  </Text>
                  <Text style={[styles.totalAmount, { color: colors.error }]}>
                    -{formatAmount(totalAdvances)}
                  </Text>
                </View>
              </>
            )}

          {/* PDF Document */}
          {selectedPayslip.pdfUrl &&
            renderSection(
              "Document",
              <View style={styles.pdfContainer}>
                <Text style={styles.pdfText}>{selectedPayslip.pdfUrl}</Text>
                <Text style={styles.pdfSize}>
                  modifié le {selectedPayslip.createdDate}
                </Text>
                <Text style={styles.pdfSize}>Taille: 3,2 Mo</Text>
              </View>
            )}
        </ScrollView>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Télécharger le bulletin"
          onPress={handleDownload}
          disabled={selectedPayslip.status !== "available"}
          style={styles.downloadButton}
        />

        <View
          style={[
            styles.statusContainer,
            { backgroundColor: getStatusColor() + "15" },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            Statut: {getStatusLabel()}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
