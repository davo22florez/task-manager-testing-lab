import '../global.css';
import { Stack } from 'expo-router';

// Punto de partida del arranque en frío: se evalúa apenas se carga este
// módulo, lo más temprano posible en el arranque de la app.
export const appColdStartTime = Date.now();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="todo" options={{ title: 'Flujo Todo List' }} />
      <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
    </Stack>
  );
}
