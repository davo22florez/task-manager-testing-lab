import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from '../../src/screens/LoginScreen';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <LoginScreen />
    </SafeAreaProvider>
  );

describe('LoginScreen - Integración', () => {
  it('muestra error si el correo o la contraseña están vacíos', async () => {
    await renderScreen();

    await fireEvent.press(screen.getByTestId('btn-iniciar-sesion'));

    await waitFor(() => {
      expect(screen.getByText('Correo y contraseña son obligatorios')).toBeTruthy();
    });
  });

  it('muestra error si el correo no tiene formato válido', async () => {
    await renderScreen();

    await fireEvent.changeText(screen.getByTestId('input-email-login'), 'correo-invalido');
    await fireEvent.changeText(screen.getByTestId('input-password-login'), '123456');
    await fireEvent.press(screen.getByTestId('btn-iniciar-sesion'));

    await waitFor(() => {
      expect(screen.getByText('Ingresa un correo válido')).toBeTruthy();
    });
  });

  it('inicia sesión exitosamente con datos válidos', async () => {
    await renderScreen();

    await fireEvent.changeText(screen.getByTestId('input-email-login'), 'usuario@correo.com');
    await fireEvent.changeText(screen.getByTestId('input-password-login'), '123456');
    await fireEvent.press(screen.getByTestId('btn-iniciar-sesion'));

    await waitFor(() => {
      expect(screen.getByText('Bienvenido, sesión iniciada correctamente')).toBeTruthy();
    });
  });
});
