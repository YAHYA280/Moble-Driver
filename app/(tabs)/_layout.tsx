// app/(tabs)/_layout.tsx - Advanced version with curved cutout
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

// Custom curved tab bar background with cutout
const CurvedTabBarBackground = () => {
  const tabBarHeight = 88;
  const curveRadius = 55;
  const curveDepth = 33;

  const centerX = width / 2;

  const pathData = `
    M 0 24
    Q 0 0 24 0
    L ${centerX - curveRadius - 35} 0
    Q ${centerX - curveRadius - 5} 0 ${centerX - curveRadius + 5} ${
    curveDepth * 0.4
  }
    Q ${centerX - curveRadius * 0.6} ${curveDepth * 1.2} ${
    centerX - curveRadius * 0.3
  } ${curveDepth * 1.4}
    Q ${centerX - 12} ${curveDepth * 1.55} ${centerX} ${curveDepth * 1.55}
    Q ${centerX + 12} ${curveDepth * 1.55} ${centerX + curveRadius * 0.3} ${
    curveDepth * 1.4
  }
    Q ${centerX + curveRadius * 0.6} ${curveDepth * 1.2} ${
    centerX + curveRadius - 5
  } ${curveDepth * 0.4}
    Q ${centerX + curveRadius + 5} 0 ${centerX + curveRadius + 30} 0
    L ${width - 24} 0
    Q ${width} 0 ${width} 24
    L ${width} ${tabBarHeight}
    L 0 ${tabBarHeight}
    Z
  `;

  return (
    <View style={styles.tabBarBackground}>
      <Svg
        width={width}
        height={tabBarHeight}
        style={StyleSheet.absoluteFillObject}
      >
        <Path d={pathData} fill="#ffffff" stroke="none" />
      </Svg>
    </View>
  );
};

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
        tabBarBackground: () => <CurvedTabBarBackground />,
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
                size={27}
                color={focused ? "#fff" : "#2c2c2c"}
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
                size={27}
                color={focused ? "#fff" : "#2c2c2c"}
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
                size={30}
                color={focused ? "#fff" : "#2c2c2c"}
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
                size={27}
                color={focused ? "#fff" : "#2c2c2c"}
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
                size={27}
                color={focused ? "#fff" : "#2c2c2c"}
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
        filter: "drop-shadow(0 -4px 12px rgba(0, 0, 0, 0.08))",
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
    width: 70,
    height: 70,
    borderRadius: 40,
    marginTop: -50,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#ffffff",
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#746cd4",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
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
          height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: "0 8px 16px rgba(99, 102, 241, 0.4)",
      },
    }),
  },
});
