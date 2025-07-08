import { Stack } from "expo-router";

export default function InnerApplicationLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="payslips" options={{ headerShown: false }} />
      <Stack.Screen name="vehicles" options={{ headerShown: false }} />
      <Stack.Screen name="documents" options={{ headerShown: false }} />
      <Stack.Screen name="routes" options={{ headerShown: false }} />
      <Stack.Screen name="geolocation" options={{ headerShown: false }} />
      <Stack.Screen name="planning" options={{ headerShown: false }} />
      {/* ✅ Ajout des routes notifications */}
      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
          presentation: "modal", // Optionnel : pour un style modal
        }}
      />
      <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
    </Stack>
  );
}
