import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggle?: (id: string) => void;
}

export function TaskCard({ task, onDelete, onToggle = () => {} }: TaskCardProps) {
  const done = task.status === 'completed';
  return (
    <View
      className="mb-2 rounded-lg border border-gray-200 bg-white p-4"
      testID={`task-card-${task.id}`}
    >
      <Text
        className="text-base font-semibold text-gray-900"
        testID={`task-title-${task.id}`}
      >
        {task.title}
      </Text>
      <Pressable
        testID={`btn-toggle-estado-${task.id}`}
        onPress={() => onToggle(task.id)}
        accessibilityRole="button"
        accessibilityLabel={`Marcar tarea ${task.title} como ${done ? 'pendiente' : 'completada'}`}
      >
        <Text
          className={`mt-1 text-sm ${
            done ? 'text-green-600' : 'text-gray-500'
          }`}
          testID={`task-status-${task.id}`}
        >
          {done ? '✓ Completada' : '○ Pendiente'}
        </Text>
      </Pressable>
      <Pressable
        testID="btn-eliminar-tarea"
        onPress={() => onDelete(task.id)}
        accessibilityRole="button"
        accessibilityLabel={`Eliminar tarea ${task.title}`}
        accessibilityHint={`Elimina la tarea ${task.title}`}
        className="mt-2 self-start"
      >
        <Text className="text-sm font-medium text-red-600">
          Eliminar
        </Text>
      </Pressable>
    </View>
  );
}
