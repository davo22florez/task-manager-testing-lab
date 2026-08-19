import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { useCreateTask } from '../hooks/useCreateTask';
import { filterTasksByStatus, FilterStatus } from '../utils/filterTasks';
import { markScreenReady, startFpsMonitor } from '../utils/performanceMonitor';

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
];

export function CreateTaskScreen() {
  const { status, tasks, submit, removeTask, toggleTask, toggleError, createError } = useCreateTask();
  const insets = useSafeAreaInsets();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  // Reloj propio de esta pantalla: arranca justo cuando el componente se
  // construye por primera vez (al navegar aquí), no cuando se abrió la app.
  const screenMountTime = useRef(Date.now()).current;

  useEffect(() => {
    markScreenReady('Pantalla Nueva tarea cargada', screenMountTime);
    // Mide FPS durante 5 segundos apenas se abre la pantalla; interactúa
    // (escribe, toca botones, haz scroll) durante ese tiempo para que la
    // medición refleje uso real, no solo la pantalla en reposo.
    startFpsMonitor(5000);
  }, []);

  const pendingTask = tasks.find((t) => t.id === pendingDelete);
  const visibleTasks = filterTasksByStatus(tasks, filter);

  return (
    <View
      className="flex-1 gap-4 bg-gray-50 p-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
    >
      <Text className="text-2xl font-bold text-gray-900">Nueva tarea</Text>
      <TaskForm onSubmit={submit} />
      {status === 'success' && (
        <Text className="rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-800">
          Tarea creada exitosamente
        </Text>
      )}
      {createError && (
        <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          {createError}
        </Text>
      )}
      {toggleError && (
        <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          {toggleError}
        </Text>
      )}
      <View className="flex-row gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className={`rounded-full px-4 py-2 ${active ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-700'}`}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <TaskList tasks={visibleTasks} onDelete={setPendingDelete} onToggle={toggleTask} />
      <ConfirmDeleteDialog
        visible={pendingDelete !== null}
        taskTitle={pendingTask?.title}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) removeTask(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </View>
  );
}
