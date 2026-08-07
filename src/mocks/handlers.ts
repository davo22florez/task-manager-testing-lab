import { http, HttpResponse } from 'msw';
import { Task } from '../types';

const API_URL = 'https://api.taskmanager.com';

// ponytail: la "API falsa" es un array en memoria; resetTasks lo limpia entre tests
let tasks: Task[] = [];

export const resetTasks = () => {
  tasks = [];
};

export const handlers = [
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    const { title } = (await request.json()) as { title: string };
    const task: Task = { id: String(tasks.length + 1), title, status: 'pending' };
    tasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  http.get(`${API_URL}/tasks`, () => HttpResponse.json(tasks)),

  // Endpoint nuevo agregado para la Actividad 3: marcar una tarea como
  // completada o pendiente. Distinto a los dos handlers anteriores
  // (POST /tasks y GET /tasks), que ya venían del proyecto base.
  http.patch(`${API_URL}/tasks/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { status: 'pending' | 'completed' };
    const idx = tasks.findIndex((t) => t.id === params.id);
    if (idx !== -1) tasks[idx] = { ...tasks[idx], status: body.status };
    return HttpResponse.json(
      { id: params.id as string, title: tasks[idx]?.title ?? '', status: body.status },
      { status: 200 }
    );
  }),
];

// https://api.taskmanager.com/tasks - POST
/**
{
  {
    id: "234234",
    title: "Tarea 1",
    status: 'pending'
  },
  { status: 201 }
}
*/

// https://api.taskmanager.com/tasks - GET
/**
[
  {
    id: "234234",
    title: "Tarea 1",
    status: 'pending'
  }
]
*/