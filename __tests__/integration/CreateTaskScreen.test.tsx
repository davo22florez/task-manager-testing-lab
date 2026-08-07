import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';

const API_URL = 'https://api.taskmanager.com';

beforeEach(async () => {
  await AsyncStorage.clear();
});

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CreateTaskScreen />
    </SafeAreaProvider>
  );

describe('CreateTaskScreen - Integración', () => {
  it('crea una tarea exitosamente y muestra confirmación', async () => {
    await renderScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Estudiar pruebas de integración'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Tarea creada exitosamente')).toBeTruthy();
    });
  }, 15000);

  it('muestra la tarea creada en la lista', async () => {
    await renderScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Comprar pan'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Comprar pan')).toBeTruthy();
    });
  });

  it('sincroniza el cambio de estado con el endpoint PATCH /tasks/:id (éxito)', async () => {
    server.use(
      http.patch(`${API_URL}/tasks/:id`, async ({ params, request }) => {
        const body = (await request.json()) as { status: string };
        return HttpResponse.json({ id: params.id, title: 'Tarea sync', status: body.status });
      })
    );

    await renderScreen();
    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Tarea sync'
    );
    await fireEvent.press(screen.getByText('Guardar'));
    await waitFor(() => screen.getByText('○ Pendiente'));

    await fireEvent.press(screen.getByText('○ Pendiente'));

    expect(screen.getByText('✓ Completada')).toBeTruthy();
    await waitFor(() => {
      expect(screen.queryByText('No se pudo sincronizar el estado con el servidor')).toBeNull();
    });
  });

  it('muestra un mensaje cuando el endpoint PATCH /tasks/:id falla, sin revertir el cambio local', async () => {
    server.use(http.patch(`${API_URL}/tasks/:id`, () => new HttpResponse(null, { status: 500 })));

    await renderScreen();
    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Tarea con error'
    );
    await fireEvent.press(screen.getByText('Guardar'));
    await waitFor(() => screen.getByText('○ Pendiente'));

    await fireEvent.press(screen.getByText('○ Pendiente'));

    expect(screen.getByText('✓ Completada')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('No se pudo sincronizar el estado con el servidor')).toBeTruthy();
    });
  });
});
