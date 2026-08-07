import { Task } from '../types';

const API_URL = 'https://api.taskmanager.com';

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error('Error al obtener las tareas');
  return res.json();
}

export async function createTask(title: string): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Error al crear la tarea');
  return res.json();
}

export async function toggleTaskStatus(id: string, status: Task['status']): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Error al actualizar el estado de la tarea');
  return res.json();
}
