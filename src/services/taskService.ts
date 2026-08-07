import { Task } from '../types';

const API_URL = 'https://api.taskmanager.com';

export async function fetchTasks(): Promise<Task[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300);
  try {
    const res = await fetch(`${API_URL}/tasks`, { signal: controller.signal });
    if (!res.ok) throw new Error('Error al obtener las tareas');
    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function createTask(title: string): Promise<Task> {
  return { id: Date.now().toString(), title, status: 'pending' };
}

export async function toggleTaskStatus(id: string, status: Task['status']): Promise<Task> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300);
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('Error al actualizar el estado de la tarea');
    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
