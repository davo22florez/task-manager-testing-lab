import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError('Correo y contraseña son obligatorios');
      setLoggedIn(false);
      return;
    }
    if (!email.includes('@')) {
      setError('Ingresa un correo válido');
      setLoggedIn(false);
      return;
    }
    setError(null);
    setLoggedIn(true);
  };

  return (
    <View
      className="flex-1 justify-center gap-4 bg-gray-50 p-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
    >
      <Text className="mb-2 text-3xl font-bold text-gray-900">Iniciar sesión</Text>

      <TextInput
        testID="input-email-login"
        placeholder="Correo electrónico"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        accessibilityLabel="Correo electrónico"
        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
      />
      <TextInput
        testID="input-password-login"
        placeholder="Contraseña"
        placeholderTextColor="#9ca3af"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessibilityLabel="Contraseña"
        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
      />

      <Pressable
        testID="btn-iniciar-sesion"
        onPress={handleLogin}
        accessibilityRole="button"
        accessibilityLabel="Iniciar sesión"
        accessibilityHint="Valida el correo y la contraseña ingresados"
        className="rounded-lg bg-blue-600 py-3 active:bg-blue-700"
      >
        <Text className="text-center text-base font-semibold text-white">Iniciar sesión</Text>
      </Pressable>

      {error && (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
          className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800"
        >
          {error}
        </Text>
      )}
      {loggedIn && (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          className="rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-800"
        >
          Bienvenido, sesión iniciada correctamente
        </Text>
      )}
    </View>
  );
}
