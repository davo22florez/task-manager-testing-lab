import { filterTasksByStatus } from '../../src/utils/filterTasks';
import { Task } from '../../src/types';

describe('filterTasksByStatus - casos límite adicionales', () => {
  it('devuelve un arreglo vacío al filtrar una lista de tareas vacía', () => {
    expect(filterTasksByStatus([], 'completed')).toEqual([]);
  });

  it('el mensaje de error incluye el estado inválido recibido', () => {
    // @ts-expect-error probando entrada inválida en runtime
    expect(() => filterTasksByStatus([], 'xyz')).toThrow('xyz');
  });

  it('no muta el arreglo original de tareas al filtrar', () => {
    const original: Task[] = [
      { id: '1', title: 'Tarea A', status: 'pending' },
      { id: '2', title: 'Tarea B', status: 'completed' },
    ];
    const copia = [...original];
    filterTasksByStatus(original, 'pending');
    expect(original).toEqual(copia);
  });

  it('devuelve todas las tareas cuando todas comparten el mismo estado filtrado', () => {
    const tasks: Task[] = [
      { id: '1', title: 'A', status: 'pending' },
      { id: '2', title: 'B', status: 'pending' },
    ];
    expect(filterTasksByStatus(tasks, 'pending')).toHaveLength(2);
  });
});