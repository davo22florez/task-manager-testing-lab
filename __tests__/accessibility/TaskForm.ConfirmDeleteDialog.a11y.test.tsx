import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';
import { ConfirmDeleteDialog } from '../../src/components/ConfirmDeleteDialog';

// Pruebas de accesibilidad propias de la Actividad 3, complementarias a las
// que ya existían en TaskCard.a11y.test.tsx 
// Aquí se cubren dos componentes distintos: el formulario de creación
// (TaskForm) y el diálogo de confirmación de borrado (ConfirmDeleteDialog).

describe('Accesibilidad - TaskForm', () => {
  it('el campo de texto tiene un accessibilityLabel descriptivo', async () => {
    await render(<TaskForm onSubmit={() => {}} />);

    const input = screen.getByLabelText('Título de la tarea');
    expect(input).toBeTruthy();
  });

  it('el botón Guardar expone accessibilityRole="button"', async () => {
    await render(<TaskForm onSubmit={() => {}} />);

    const boton = screen.getByRole('button', { name: 'Guardar' });
    expect(boton).toBeTruthy();
  });
});

describe('Accesibilidad - ConfirmDeleteDialog', () => {
  it('los botones de Cancelar y Confirmar eliminación tienen accessibilityLabel propio', async () => {
    await render(
      <ConfirmDeleteDialog
        visible={true}
        taskTitle="Comprar materiales"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByLabelText('Cancelar')).toBeTruthy();
    expect(screen.getByLabelText('Confirmar eliminación')).toBeTruthy();
  });

  it('ambos botones del diálogo exponen accessibilityRole="button" para lectores de pantalla', async () => {
    await render(
      <ConfirmDeleteDialog
        visible={true}
        taskTitle="Comprar materiales"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    const botones = screen.getAllByRole('button');
    expect(botones.length).toBe(2);
  });
});
