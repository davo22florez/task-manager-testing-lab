import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm - validación de envío', () => {
  it('no llama a onSubmit si el campo está vacío', async () => {
    const onSubmit = jest.fn();
    await render(<TaskForm onSubmit={onSubmit} />);
    await fireEvent.press(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('no llama a onSubmit si el campo solo contiene espacios', async () => {
    const onSubmit = jest.fn();
    await render(<TaskForm onSubmit={onSubmit} />);
    await fireEvent.changeText(screen.getByTestId('input-titulo'), '   ');
    await fireEvent.press(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('llama a onSubmit con el texto ingresado cuando es válido', async () => {
    const onSubmit = jest.fn();
    await render(<TaskForm onSubmit={onSubmit} />);
    await fireEvent.changeText(screen.getByTestId('input-titulo'), 'Comprar pan');
    await fireEvent.press(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledWith('Comprar pan');
  });

  it('refleja en el input el texto que el usuario escribe', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);
    const input = screen.getByTestId('input-titulo');
    await fireEvent.changeText(input, 'Estudiar Jest');
    expect(input.props.value).toBe('Estudiar Jest');
  });
});