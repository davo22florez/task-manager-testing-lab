import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';
import { createTask, toggleTaskStatus } from '../services/taskService';

const STORAGE_KEY = 'tasks';

export function useCreateTask() {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setTasks(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
      });
  }, []);

  useEffect(() => {
    // ponytail: no guardar antes de terminar de cargar, si no el [] inicial pisa lo guardado
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks]);

  const submit = async (title: string) => {
    const task: Task = {
      id: Date.now().toString(),
      title: title,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setCreateError(null);
    setTasks((prev) => [...prev, task]);
    setStatus('success');
    // Sincronización con el endpoint POST /tasks (Actividad 3) en segundo
    // plano: no bloquea ni retrasa la actualización local, que ya ocurrió
    // arriba de forma instantánea. Es este llamado el que MSW intercepta
    // en las pruebas de integración.
    try {
      await createTask(title);
    } catch {
      setCreateError('No se pudo sincronizar la tarea con el servidor');
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id: string) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;
    const nextStatus = current.status === 'completed' ? 'pending' : 'completed';
    setToggleError(null);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
    // Sincronización con el endpoint PATCH /tasks/:id (Actividad 3) en
    // segundo plano: no bloquea ni retrasa la actualización local, que ya
    // ocurrió arriba de forma instantánea.
    toggleTaskStatus(id, nextStatus).catch(() => {
      setToggleError('No se pudo sincronizar el estado con el servidor');
    });
  };

  return { status, tasks, submit, removeTask, toggleTask, toggleError, createError };
}
