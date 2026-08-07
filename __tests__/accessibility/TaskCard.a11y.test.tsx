import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskCard } from '../../src/components/TaskCard';

const mockTask = {
  id: '1',
  title: 'Estudiar accesibilidad',
  status: 'pending' as const,
};

describe('TaskCard - Accesibilidad', () => {
  it('el botón de eliminar tiene un accessibilityLabel descriptivo', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);
    const deleteButton = screen.getByLabelText('Eliminar tarea Estudiar accesibilidad');
    expect(deleteButton).toBeTruthy();
  });

  it('los controles de la tarjeta son botones enfocables por separado', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('el estado de la tarea es anunciado al lector de pantalla', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);
    expect(screen.getByText('○ Pendiente')).toBeTruthy();
  });
});
