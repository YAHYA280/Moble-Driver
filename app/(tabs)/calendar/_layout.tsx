import { Stack } from "expo-router";

export default function CalendarLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="appointment/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="agenda/[date]" options={{ headerShown: false }} />
    </Stack>
  );
}
