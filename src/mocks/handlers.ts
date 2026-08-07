import { http, HttpResponse } from 'msw';

const API_URL = 'https://api.taskmanager.com';

export const handlers = [
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    const body = (await request.json()) as { title: string };
    return HttpResponse.json(
      { id: Date.now().toString(), title: body.title, status: 'pending' },
      { status: 201 }
    );
  }),

  http.get(`${API_URL}/tasks`, () => {
    return HttpResponse.json([
      { id: '1', title: 'Tarea existente', status: 'pending' },
      { id: '2', title: 'Otra tarea', status: 'completed' },
    ]);
  }),

  // Endpoint nuevo agregado para la Actividad 3: marcar una tarea como
  // completada o pendiente. Distinto a los dos handlers anteriores
  // (POST /tasks y GET /tasks), que ya venían del proyecto base.
  http.patch(`${API_URL}/tasks/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { status: 'pending' | 'completed' };
    return HttpResponse.json(
      { id: params.id as string, title: 'Tarea actualizada', status: body.status },
      { status: 200 }
    );
  }),
];
