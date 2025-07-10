import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "../../../hooks/useTheme";
import { LogoVSN } from "./sideBarLogoVsn";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

type IconType = keyof typeof FontAwesome.glyphMap;

interface SidebarItem {
  id: string;
  label: string;
  icon: IconType;
  onPress: () => void;
  badge?: number;
  isActive?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  style?: ViewStyle;
  visible: boolean;
  onClose?: () => void;
  onLogout?: () => void;
  showCloseButton?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  title,
  style,
  visible,
  onClose,
  onLogout,
  showCloseButton = true,
}) => {
  const colors = useThemeColors();
  const slideAnim = React.useRef(new Animated.Value(-300)).current;
  const overlayAnim = React.useRef(new Animated.Value(0)).current;

  // Calculate proper sidebar width for different screen sizes
  const sidebarWidth = React.useMemo(() => {
    if (Platform.OS === "android") {
      // Android optimization: responsive width based on screen size
      if (screenWidth < 360) return Math.min(260, screenWidth * 0.85); // Small phones
      if (screenWidth < 400) return Math.min(280, screenWidth * 0.8); // Medium phones
      return Math.min(320, screenWidth * 0.75); // Large phones/tablets
    }
    return Math.min(280, screenWidth * 0.8); // iOS default
  }, []);

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: Platform.OS === "android" ? 250 : 300, // Faster on Android
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: Platform.OS === "android" ? 200 : 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -sidebarWidth,
          duration: Platform.OS === "android" ? 200 : 250, // Faster on Android
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: Platform.OS === "android" ? 150 : 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, sidebarWidth]);

  const renderItem = (item: SidebarItem) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: item.isActive
            ? colors.primary + "15"
            : pressed && Platform.OS === "ios"
            ? colors.backgroundSecondary
            : "transparent",
          borderLeftColor: item.isActive ? colors.primary : "transparent",
        },
      ]}
      onPress={item.onPress}
      android_ripple={
        Platform.OS === "android"
          ? {
              color: colors.primary + "20",
              borderless: false,
            }
          : undefined
      }
    >
      <View style={styles.itemContent}>
        <View style={styles.itemLeft}>
          <FontAwesome
            name={item.icon}
            size={Platform.OS === "android" ? 16 : 18}
            color={item.isActive ? colors.primary : colors.iconSecondary}
            style={styles.itemIcon}
          />
          <Text
            style={[
              styles.itemLabel,
              {
                color: item.isActive ? colors.primary : colors.textSecondary,
                fontWeight: item.isActive ? "600" : "500",
                fontSize: Platform.OS === "android" ? 15 : 16,
              },
            ]}
          >
            {item.label}
          </Text>
        </View>

        <ConditionalComponent isValid={!!(item.badge && item.badge > 0)}>
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <Text style={styles.badgeText}>
              {item.badge && item.badge > 99 ? "99+" : item.badge}
            </Text>
          </View>
        </ConditionalComponent>
      </View>
    </Pressable>
  );

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    container: {
      height: screenHeight,
      width: sidebarWidth,
      backgroundColor: colors.surface,
      ...Platform.select({
        ios: {
          borderRightWidth: 1,
          borderRightColor: colors.border,
          shadowColor: colors.shadow,
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 16,
          borderRightWidth: 0,
        },
        web: {
          borderRightWidth: 1,
          borderRightColor: colors.border,
          boxShadow: colors.isDark
            ? "2px 0 8px rgba(0, 0, 0, 0.3)"
            : "2px 0 8px rgba(0, 0, 0, 0.1)",
        },
      }),
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    },
    logoSection: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Platform.OS === "android" ? 24 : 32,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      minHeight: Platform.OS === "android" ? 100 : 120,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === "android" ? 16 : 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: Platform.OS === "android" ? 16 : 18,
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      width: Platform.OS === "android" ? 28 : 32,
      height: Platform.OS === "android" ? 28 : 32,
      borderRadius: Platform.OS === "android" ? 14 : 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContent: {
      flex: 1,
      paddingTop: 8,
    },
    item: {
      marginHorizontal: 8,
      marginVertical: 1,
      borderRadius: Platform.OS === "android" ? 6 : 8,
      borderLeftWidth: 3,
      borderLeftColor: "transparent",
      overflow: Platform.OS === "android" ? "hidden" : "visible",
    },
    itemContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === "android" ? 10 : 12,
    },
    itemLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    itemIcon: {
      marginRight: Platform.OS === "android" ? 10 : 12,
    },
    itemLabel: {
      flex: 1,
      lineHeight: Platform.OS === "android" ? 18 : 20,
    },
    badge: {
      minWidth: Platform.OS === "android" ? 18 : 20,
      height: Platform.OS === "android" ? 18 : 20,
      borderRadius: Platform.OS === "android" ? 9 : 10,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Platform.OS === "android" ? 4 : 6,
    },
    badgeText: {
      color: "white",
      fontSize: Platform.OS === "android" ? 10 : 12,
      fontWeight: "600",
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === "android" ? 16 : 20,
      paddingBottom: Platform.select({
        ios: 34,
        android: 16,
        default: 20,
      }),
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Platform.OS === "android" ? 10 : 12,
      paddingHorizontal: 16,
      borderRadius: Platform.OS === "android" ? 6 : 8,
      backgroundColor: colors.error + "15",
      borderWidth: 1,
      borderColor: colors.error + "30",
      overflow: Platform.OS === "android" ? "hidden" : "visible",
    },
    logoutText: {
      color: colors.error,
      fontSize: Platform.OS === "android" ? 14 : 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === "android"}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: overlayAnim,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View
        style={[
          styles.container,
          {
            position: "absolute",
            left: 0,
            top: 0,
            transform: [{ translateX: slideAnim }],
          },
          style,
        ]}
      >
        <SafeAreaView
          style={styles.safeArea}
          edges={Platform.OS === "android" ? [] : ["top"]}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <LogoVSN
              width={Platform.OS === "android" ? 140 : 160}
              height={Platform.OS === "android" ? 32 : 38}
            />
          </View>

          {/* Header with title and close button */}
          <ConditionalComponent isValid={!!(title || showCloseButton)}>
            <View style={styles.header}>
              <ConditionalComponent isValid={!!title}>
                <Text style={styles.title}>{title}</Text>
              </ConditionalComponent>

              <ConditionalComponent isValid={showCloseButton && !!onClose}>
                <Pressable
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && Platform.OS === "ios" && { opacity: 0.7 },
                  ]}
                  onPress={onClose}
                  android_ripple={
                    Platform.OS === "android"
                      ? {
                          color: colors.textSecondary + "20",
                          borderless: true,
                        }
                      : undefined
                  }
                >
                  <FontAwesome
                    name="times"
                    size={Platform.OS === "android" ? 14 : 16}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </ConditionalComponent>
            </View>
          </ConditionalComponent>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={Platform.OS !== "android"}
          >
            {items.map(renderItem)}
          </ScrollView>

          {/* Footer with Logout Button */}
          {onLogout && (
            <View style={styles.footer}>
              <Pressable
                style={({ pressed }) => [
                  styles.logoutButton,
                  pressed && Platform.OS === "ios" && { opacity: 0.7 },
                ]}
                onPress={onLogout}
                android_ripple={
                  Platform.OS === "android"
                    ? {
                        color: colors.error + "20",
                        borderless: false,
                      }
                    : undefined
                }
              >
                <FontAwesome
                  name="sign-out"
                  size={Platform.OS === "android" ? 16 : 18}
                  color={colors.error}
                />
                <Text style={styles.logoutText}>Déconnecté</Text>
              </Pressable>
            </View>
          )}
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};
