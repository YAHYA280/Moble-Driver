import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 88,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: 0,
        },
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          height: 88,
          paddingTop: 12,
          paddingBottom: 20,
        },
      }}
    >
      {/* Map - Left side */}
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIcon, focused && styles.activeTab]}>
              <Ionicons
                name="map"
                size={22}
                color={focused ? "#fff" : "#9ca3af"}
              />
            </View>
          ),
        }}
      />

      {/* Calendar - Left side */}
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIcon, focused && styles.activeTab]}>
              <Ionicons
                name="calendar"
                size={22}
                color={focused ? "#fff" : "#9ca3af"}
              />
            </View>
          ),
        }}
      />

      {/* Home - Center */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabIcon,
                styles.homeTab,
                focused && styles.activeHomeTab,
              ]}
            >
              <Ionicons
                name="home"
                size={24}
                color={focused ? "#fff" : "#9ca3af"}
              />
            </View>
          ),
        }}
      />

      {/* Chat - Right side */}
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIcon, focused && styles.activeTab]}>
              <Ionicons
                name="chatbubbles"
                size={22}
                color={focused ? "#fff" : "#9ca3af"}
              />
            </View>
          ),
        }}
      />

      {/* Profile - Right side */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIcon, focused && styles.activeTab]}>
              <Ionicons
                name="person"
                size={20}
                color={focused ? "#fff" : "#9ca3af"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 88,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.08)",
      },
    }),
  },
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  homeTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -16,
    backgroundColor: "#f8fafc",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  activeTab: {
    backgroundColor: "#6366f1",
    ...Platform.select({
      ios: {
        shadowColor: "#6366f1",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0 4px 8px rgba(99, 102, 241, 0.3)",
      },
    }),
  },
  activeHomeTab: {
    backgroundColor: "#6366f1",
    borderColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "#6366f1",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0 6px 12px rgba(99, 102, 241, 0.4)",
      },
    }),
  },
});
