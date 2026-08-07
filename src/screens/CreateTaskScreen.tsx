import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { useCreateTask } from '../hooks/useCreateTask';

export function CreateTaskScreen() {
  const { status, tasks, submit, removeTask, loadError, toggleStatus, toggleError } = useCreateTask();
  const insets = useSafeAreaInsets();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const pendingTask = tasks.find((t) => t.id === pendingDelete);

  return (
    <View
      className="flex-1 gap-4 bg-gray-50 p-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
    >
      <Text className="text-2xl font-bold text-gray-900">Nueva tarea</Text>
      <TaskForm onSubmit={submit} />
      <TaskList tasks={tasks} onDelete={setPendingDelete} onToggle={toggleStatus} />
      {status === 'success' && (
        <Text className="rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-800">
          Tarea creada exitosamente
        </Text>
      )}
      {status === 'error' && (
        <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          Error al crear la tarea
        </Text>
      )}
      {loadError && (
        <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          {loadError}
        </Text>
      )}
      {toggleError && (
        <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          {toggleError}
        </Text>
      )}
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
