import React from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Input } from "../../../../shared/components/ui/Input";

interface KilometrageSectionProps {
  startKm: string;
  endKm: string;
  fuelAmount: string;
  onStartKmChange: (value: string) => void;
  onEndKmChange: (value: string) => void;
  onFuelAmountChange: (value: string) => void;
  style?: ViewStyle;
}

export const KilometrageSection: React.FC<KilometrageSectionProps> = ({
  startKm,
  endKm,
  fuelAmount,
  onStartKmChange,
  onEndKmChange,
  onFuelAmountChange,
  style,
}) => {
  const colors = useThemeColors();

  const totalKm = React.useMemo(() => {
    const start = parseFloat(startKm) || 0;
    const end = parseFloat(endKm) || 0;
    const total = end - start;
    return total > 0 ? total : 0;
  }, [startKm, endKm]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    inputContainer: {
      flex: 1,
      marginHorizontal: 4,
    },
    label: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      fontWeight: "500",
    },
    totalContainer: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
      alignItems: "center",
    },
    totalLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.primary,
    },
    totalUnit: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Intervalle Kilométrage</Text>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Nombre de kilométrage en début de journée
          </Text>
          <Input
            value={startKm}
            onChangeText={onStartKmChange}
            placeholder="15 km"
            keyboardType="numeric"
            returnKeyType="next"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Nombre de kilométrage en fin de journée
          </Text>
          <Input
            value={endKm}
            onChangeText={onEndKmChange}
            placeholder="12"
            keyboardType="numeric"
            returnKeyType="next"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Montant en Carburant (optionnel)</Text>
        <Input
          value={fuelAmount}
          onChangeText={onFuelAmountChange}
          placeholder="1200 $"
          keyboardType="numeric"
          returnKeyType="done"
        />
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total kilométrage parcouru</Text>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={styles.totalValue}>{totalKm.toFixed(1)}</Text>
          <Text style={styles.totalUnit}>km</Text>
        </View>
      </View>
    </View>
  );
};
