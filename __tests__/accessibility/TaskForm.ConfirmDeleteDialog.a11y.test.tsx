import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';
import { ConfirmDeleteDialog } from '../../src/components/ConfirmDeleteDialog';

// Pruebas de accesibilidad propias de la Actividad 3, complementarias a las
// que ya existían en TaskCard.a11y.test.tsx (provistas por el docente).
// Aquí se cubren dos componentes distintos: el formulario de creación
// (TaskForm) y el diálogo de confirmación de borrado (ConfirmDeleteDialog).
//
// Se usan matchers de jest-native (toHaveAccessibleName, toBeEnabled) en
// lugar de solo consultas de RNTL + toBeTruthy, para que la aserción
// exprese explícitamente qué propiedad de accesibilidad se está validando.

describe('Accesibilidad - TaskForm', () => {
  it('el campo de texto tiene un accessibilityLabel descriptivo', async () => {
    await render(<TaskForm onSubmit={() => {}} />);

    const input = screen.getByLabelText('Título de la tarea');
    expect(input).toHaveAccessibleName('Título de la tarea');
  });

  it('el botón Guardar expone accessibilityRole="button" y está habilitado', async () => {
    await render(<TaskForm onSubmit={() => {}} />);

    const boton = screen.getByRole('button', { name: 'Guardar' });
    expect(boton).toHaveAccessibleName('Guardar');
    expect(boton).toBeEnabled();
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

    expect(screen.getByLabelText('Cancelar')).toHaveAccessibleName('Cancelar');
    expect(screen.getByLabelText('Confirmar eliminación')).toHaveAccessibleName('Confirmar eliminación');
  });

  it('ambos botones del diálogo exponen accessibilityRole="button" y están habilitados', async () => {
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
    botones.forEach((boton) => expect(boton).toBeEnabled());
  });
});
