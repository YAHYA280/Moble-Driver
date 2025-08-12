// app/(tabs)/routes/_layout.tsx
import { Stack } from "expo-router";

export default function RoutesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="edit/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="view/[id]/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="view/[id]/day/[date]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
