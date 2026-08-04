import { validateTaskTitle } from '../../src/utils/validateTask';

describe('validateTaskTitle - casos límite adicionales', () => {
  it('recorta espacios al inicio y al final antes de contar la longitud', () => {
    expect(validateTaskTitle('  Ab  ')).toBe('El título debe tener al menos 3 caracteres');
  });

  it('acepta títulos con espacios internos múltiples sin afectar el conteo', () => {
    expect(validateTaskTitle('Comprar   pan   integral')).toBeNull();
  });

  it('el mensaje de error para título vacío contiene la palabra "título"', () => {
    expect(validateTaskTitle('')).toContain('título');
  });

  it('trata una cadena de solo saltos de línea y tabulaciones como vacía', () => {
    expect(validateTaskTitle('\n\t\n')).toBe('El título es obligatorio');
  });
});