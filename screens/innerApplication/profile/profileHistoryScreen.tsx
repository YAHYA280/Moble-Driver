// screens/innerApplication/profile/profileHistoryScreen.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { ProfileModificationHistory } from "../../../shared/types/profile";
import { useProfileStore } from "../../../store/profileStore";

interface HistoryItemProps {
  item: ProfileModificationHistory;
  index: number;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, index }) => {
  const colors = useTheme().colors;
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index, animValue]);

  const getIconForType = () => {
    switch (item.modificationType) {
      case "personal":
        return "user";
      case "professional":
        return "briefcase";
      case "settings":
        return "cog";
      case "password":
        return "lock";
      default:
        return "edit";
    }
  };

  const getColorForType = () => {
    switch (item.modificationType) {
      case "personal":
        return colors.primary;
      case "professional":
        return colors.info;
      case "settings":
        return colors.warning;
      case "password":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getTypeLabel = () => {
    switch (item.modificationType) {
      case "personal":
        return "Informations personnelles";
      case "professional":
        return "Informations professionnelles";
      case "settings":
        return "Paramètres";
      case "password":
        return "Mot de passe";
      default:
        return "Modification";
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 8,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 4px rgba(0, 0, 0, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.05)",
        },
      }),
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      backgroundColor: getColorForType() + "15",
    },
    contentContainer: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    typeLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
    },
    date: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "400",
    },
    modifiedBy: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    changesContainer: {
      marginTop: 4,
    },
    changeItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    changeField: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.text,
      minWidth: 80,
    },
    changeArrow: {
      marginHorizontal: 8,
    },
    changeValue: {
      fontSize: 13,
      color: colors.textSecondary,
      flex: 1,
    },
    newValue: {
      fontWeight: "600",
      color: getColorForType(),
    },
  });

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name={getIconForType() as any}
            size={20}
            color={getColorForType()}
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.typeLabel}>{getTypeLabel()}</Text>
            <Text style={styles.date}>{item.modificationDate}</Text>
          </View>

          <Text style={styles.modifiedBy}>Modifié par {item.modifiedBy}</Text>

          <ConditionalComponent isValid={item.changes.length > 0}>
            <View style={styles.changesContainer}>
              {item.changes.map((change, changeIndex) => (
                <View key={changeIndex} style={styles.changeItem}>
                  <Text style={styles.changeField}>
                    {change.field === "phoneNumber"
                      ? "Téléphone"
                      : change.field === "email"
                      ? "Email"
                      : change.field === "fullName"
                      ? "Nom"
                      : change.field}
                    :
                  </Text>
                  <FontAwesome
                    name="arrow-right"
                    size={10}
                    color={colors.textTertiary}
                    style={styles.changeArrow}
                  />
                  <Text style={[styles.changeValue, styles.newValue]}>
                    {change.newValue}
                  </Text>
                </View>
              ))}
            </View>
          </ConditionalComponent>
        </View>
      </View>
    </Animated.View>
  );
};

export const ProfileHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const { profile } = useProfileStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderHistoryItem = ({
    item,
    index,
  }: {
    item: ProfileModificationHistory;
    index: number;
  }) => <HistoryItem item={item} index={index} />;

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <FontAwesome name="history" size={48} color={colors.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>Aucun historique</Text>
      <Text style={styles.emptyText}>
        L&apos;historique des modifications de votre profil apparaîtra ici.
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
    listContent: {
      paddingVertical: 16,
      paddingBottom: 100,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingTop: 100,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Historique des modifications"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList
          data={profile?.modificationHistory || []}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            !profile?.modificationHistory?.length
              ? { flex: 1 }
              : styles.listContent
          }
          ListEmptyComponent={renderEmptyState}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
