import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="todo" options={{ title: 'Flujo Todo List' }} />
      <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
    </Stack>
  );
}
