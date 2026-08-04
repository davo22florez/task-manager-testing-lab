import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskCard } from '../../src/components/TaskCard';
import { Task } from '../../src/types';

describe('TaskCard - estados condicionales', () => {
  const pendingTask: Task = { id: '1', title: 'Lavar el carro', status: 'pending' };
  const completedTask: Task = { id: '2', title: 'Pagar servicios', status: 'completed' };

  it('renderiza el título de la tarea', async () => {
    await render(<TaskCard task={pendingTask} onDelete={jest.fn()} />);
    expect(screen.getByText('Lavar el carro')).toBeTruthy();
  });

  it('muestra el estado "Pendiente" cuando la tarea no está completada', async () => {
    await render(<TaskCard task={pendingTask} onDelete={jest.fn()} />);
    expect(screen.getByText(/Pendiente/)).toBeTruthy();
  });

  it('muestra el estado "Completada" cuando la tarea está completada', async () => {
    await render(<TaskCard task={completedTask} onDelete={jest.fn()} />);
    expect(screen.getByText(/Completada/)).toBeTruthy();
  });

  it('llama a onDelete con el id correcto al presionar eliminar', async () => {
    const onDelete = jest.fn();
    await render(<TaskCard task={pendingTask} onDelete={onDelete} />);
    fireEvent.press(screen.getByLabelText(`Eliminar tarea ${pendingTask.title}`));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});