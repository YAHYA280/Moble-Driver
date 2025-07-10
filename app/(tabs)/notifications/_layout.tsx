// app/(tabs)/notifications/_layout.tsx - Stack layout inside tabs
import { Stack } from "expo-router";

export default function NotificationsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}
