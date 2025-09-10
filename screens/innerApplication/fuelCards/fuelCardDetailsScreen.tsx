// screens/innerApplication/fuelCards/fuelCardDetailsScreen.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
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
import { Receipt } from "../../../shared/types/fuelCard";
import { useFuelCardStore } from "../../../store/fuelCardStore";
import { FuelCardInfoCard } from "./components/FuelCardInfoCard";
import { ReceiptItem } from "./components/ReceiptItem";

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [animValue, delay]);

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};

export const FuelCardDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedFuelCard, selectFuelCard, fuelCards, selectReceipt } =
    useFuelCardStore();
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!selectedFuelCard && id) {
      const fuelCard = fuelCards.find((fc) => fc.id === id);
      if (fuelCard) {
        selectFuelCard(fuelCard);
      } else {
        router.back();
        return;
      }
    }

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [selectedFuelCard, id, fuelCards]);

  if (!selectedFuelCard) {
    return null;
  }

  const handleAddReceipt = () => {
    router.push(`/(tabs)/fuelcards/receipt/new?cardId=${selectedFuelCard.id}`);
  };

  const handleReceiptPress = (receipt: Receipt) => {
    selectReceipt(receipt);
    router.push(
      `/(tabs)/fuelcards/receipt/${receipt.id}?cardId=${selectedFuelCard.id}`
    );
  };

  const carteCarburantReceipts = selectedFuelCard.receipts.filter(
    (r) => r.paymentMethod === "Carte carburant"
  );
  const horsCarteReceipts = selectedFuelCard.receipts.filter(
    (r) => r.paymentMethod === "Hors carte"
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
    sectionContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.primary + "15",
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 6,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 32,
    },
    emptyIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    receiptsContainer: {
      gap: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}
      >
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détails carte carburant"
        />
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: headerAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Fuel Card Info */}
          <AnimatedSection delay={200}>
            <FuelCardInfoCard fuelCard={selectedFuelCard} />
          </AnimatedSection>

          {/* Carte Carburant Receipts */}
          <AnimatedSection delay={400}>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reçus carte carburant</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddReceipt}
                >
                  <FontAwesome name="plus" size={12} color={colors.primary} />
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
              </View>

              <ConditionalComponent
                isValid={carteCarburantReceipts.length > 0}
                defaultComponent={
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                      <FontAwesome
                        name="credit-card"
                        size={24}
                        color={colors.textTertiary}
                      />
                    </View>
                    <Text style={styles.emptyTitle}>
                      Aucun reçu carte carburant
                    </Text>
                    <Text style={styles.emptyText}>
                      Les reçus payés avec la carte carburant apparaîtront ici.
                    </Text>
                  </View>
                }
              >
                <View style={styles.receiptsContainer}>
                  {carteCarburantReceipts.map((receipt) => (
                    <ReceiptItem
                      key={receipt.id}
                      receipt={receipt}
                      onPress={() => handleReceiptPress(receipt)}
                    />
                  ))}
                </View>
              </ConditionalComponent>
            </View>
          </AnimatedSection>

          {/* Hors Carte Receipts */}
          <AnimatedSection delay={600}>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reçus hors carte</Text>
              </View>

              <ConditionalComponent
                isValid={horsCarteReceipts.length > 0}
                defaultComponent={
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                      <FontAwesome
                        name="money"
                        size={24}
                        color={colors.textTertiary}
                      />
                    </View>
                    <Text style={styles.emptyTitle}>Aucun reçu hors carte</Text>
                    <Text style={styles.emptyText}>
                      Les reçus payés de votre poche apparaîtront ici.
                    </Text>
                  </View>
                }
              >
                <View style={styles.receiptsContainer}>
                  {horsCarteReceipts.map((receipt) => (
                    <ReceiptItem
                      key={receipt.id}
                      receipt={receipt}
                      onPress={() => handleReceiptPress(receipt)}
                    />
                  ))}
                </View>
              </ConditionalComponent>
            </View>
          </AnimatedSection>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
