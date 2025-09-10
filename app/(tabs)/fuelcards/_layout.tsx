import { Stack } from "expo-router";

export default function FuelCardsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="details/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="receipt/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
