import { renderHook, act } from '@testing-library/react-native';
import { useCreateTask } from '../../src/hooks/useCreateTask';
import { createTask } from '../../src/services/taskService';

// Se aísla taskService.createTask con jest.mock() porque el hook depende de una
// función asíncrona que en producción golpearía una red simulada; mockearla evita
// que el test dependa de tiempos de espera reales y lo hace determinista y rápido.
jest.mock('../../src/services/taskService');
const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>;

describe('useCreateTask', () => {
  beforeEach(() => {
    mockedCreateTask.mockReset();
  });

  it('inicia en estado idle y sin tareas', async () => {
    const { result } = await renderHook(() => useCreateTask());
    expect(result.current.status).toBe('idle');
    expect(result.current.tasks).toEqual([]);
  });

  it('pasa a success cuando el servicio resuelve correctamente', async () => {
    mockedCreateTask.mockResolvedValueOnce({ id: '1', title: 'Nueva tarea', status: 'pending' });
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Nueva tarea');
    });

    expect(result.current.status).toBe('success');
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Nueva tarea');
  });

  it('pasa a error cuando el servicio rechaza la promesa', async () => {
    mockedCreateTask.mockRejectedValueOnce(new Error('fallo de red'));
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Tarea fallida');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.tasks).toEqual([]);
  });

  it('elimina una tarea creada previamente por su id', async () => {
    mockedCreateTask.mockResolvedValueOnce({ id: '5', title: 'Tarea a borrar', status: 'pending' });
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Tarea a borrar');
    });
    expect(result.current.tasks).toHaveLength(1);

    await act(async () => {
      result.current.removeTask('5');
    });
    expect(result.current.tasks).toEqual([]);
  });
});