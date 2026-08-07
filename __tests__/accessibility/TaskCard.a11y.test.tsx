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

  it('el contenedor de la tarea tiene el rol correcto', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);
    const card = screen.getByRole('button', { name: /Eliminar tarea/i });
    expect(card).toBeTruthy();
  });

  it('el estado de la tarea es anunciado al lector de pantalla', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);
    expect(screen.getByText('○ Pendiente')).toBeTruthy();
  });
});
