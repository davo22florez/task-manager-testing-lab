import { useState, useEffect } from 'react';
import { createTask, fetchTasks, toggleTaskStatus } from '../services/taskService';
import { Task } from '../types';

export function useCreateTask() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks()
      .then((loadedTasks) => setTasks(loadedTasks))
      .catch(() => setLoadError('No se pudieron cargar las tareas'));
  }, []);

  const submit = async (title: string) => {
    setStatus('loading');
    try {
      const task = await createTask(title);
      setTasks((prev) => [task, ...prev]);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleStatus = async (id: string) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;
    const nextStatus = current.status === 'completed' ? 'pending' : 'completed';
    setToggleError(null);
    try {
      await toggleTaskStatus(id, nextStatus);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));
    } catch {
      setToggleError('No se pudo actualizar el estado de la tarea');
    }
  };

  return { status, tasks, submit, removeTask, loadError, toggleStatus, toggleError };
}
