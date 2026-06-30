import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The index.tsx (Login) and (tabs) will automatically render inside here */}
    </Stack>
  );
}