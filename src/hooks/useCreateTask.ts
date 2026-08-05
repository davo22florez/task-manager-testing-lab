import { useState, useEffect } from 'react';
import { createTask, fetchTasks } from '../services/taskService';
import { Task } from '../types';

export function useCreateTask() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  return { status, tasks, submit, removeTask, loadError };
}
