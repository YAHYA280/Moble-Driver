// app/(tabs)/payslips/_layout.tsx - Stack layout inside tabs
import { Stack } from "expo-router";

export default function PayslipsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen name="details/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
