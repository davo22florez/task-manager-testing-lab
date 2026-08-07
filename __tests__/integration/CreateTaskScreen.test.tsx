import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';

const API_URL = 'https://api.taskmanager.com';

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
    server.use(http.get(`${API_URL}/tasks`, () => HttpResponse.json([])));

    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText('No hay tareas aún')).toBeTruthy();
    });

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Estudiar pruebas de integración'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Tarea creada exitosamente')).toBeTruthy();
    });
  }, 15000);

  it('muestra un mensaje de error cuando la API falla al cargar las tareas', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () => new HttpResponse(null, { status: 500 }))
    );

    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar las tareas')).toBeTruthy();
    });
  });

  it('muestra el estado vacío cuando la API responde sin tareas', async () => {
    server.use(http.get(`${API_URL}/tasks`, () => HttpResponse.json([])));

    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText('No hay tareas aún')).toBeTruthy();
    });
  });

  it('marca una tarea como completada usando el endpoint PATCH /tasks/:id', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () =>
        HttpResponse.json([{ id: '9', title: 'Tarea a completar', status: 'pending' }])
      ),
      http.patch(`${API_URL}/tasks/:id`, async ({ params, request }) => {
        const body = (await request.json()) as { status: string };
        return HttpResponse.json({ id: params.id, title: 'Tarea a completar', status: body.status });
      })
    );

    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText('○ Pendiente')).toBeTruthy();
    });

    await fireEvent.press(screen.getByTestId('btn-toggle-estado-9'));

    await waitFor(() => {
      expect(screen.getByText('✓ Completada')).toBeTruthy();
    });
  });

  it('muestra un mensaje de error cuando el endpoint PATCH /tasks/:id falla', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () =>
        HttpResponse.json([{ id: '9', title: 'Tarea a completar', status: 'pending' }])
      ),
      http.patch(`${API_URL}/tasks/:id`, () => new HttpResponse(null, { status: 500 }))
    );

    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText('○ Pendiente')).toBeTruthy();
    });

    await fireEvent.press(screen.getByTestId('btn-toggle-estado-9'));

    await waitFor(() => {
      expect(screen.getByText('No se pudo actualizar el estado de la tarea')).toBeTruthy();
    });

    // El estado local no cambia si la API falla
    expect(screen.getByText('○ Pendiente')).toBeTruthy();
  });
});
