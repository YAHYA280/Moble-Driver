import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { PaymentMethod } from "../../../../shared/types/fuelCard";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const colors = useThemeColors();

  const paymentMethods: {
    value: PaymentMethod;
    label: string;
    color: string;
    icon: string;
  }[] = [
    {
      value: "Carte carburant",
      label: "Carte carburant",
      color: colors.primary,
      icon: "credit-card",
    },
    {
      value: "Hors carte",
      label: "Hors carte (de ma poche)",
      color: colors.error,
      icon: "money",
    },
  ];

  const styles = StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    methodsContainer: {
      flexDirection: "row",
      gap: 12,
    },
    methodButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 2,
    },
    methodIcon: {
      marginRight: 8,
    },
    methodText: {
      fontSize: 14,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Méthode de paiement</Text>
      <View style={styles.methodsContainer}>
        {paymentMethods.map((method) => {
          const isSelected = value === method.value;
          return (
            <TouchableOpacity
              key={method.value}
              style={[
                styles.methodButton,
                {
                  backgroundColor: isSelected
                    ? method.color + "20"
                    : colors.surface,
                  borderColor: isSelected ? method.color : colors.border,
                  opacity: disabled ? 0.7 : 1,
                },
              ]}
              onPress={() => !disabled && onChange(method.value)}
              activeOpacity={disabled ? 1 : 0.7}
              disabled={disabled}
            >
              <FontAwesome
                name={method.icon as any}
                size={14}
                color={isSelected ? method.color : colors.textSecondary}
                style={styles.methodIcon}
              />
              <Text
                style={[
                  styles.methodText,
                  {
                    color: isSelected ? method.color : colors.textSecondary,
                  },
                ]}
              >
                {method.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
