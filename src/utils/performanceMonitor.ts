// Módulo de medición de rendimiento para la Actividad 4.
// No agrega dependencias nuevas: usa Date.now() y requestAnimationFrame,
// disponibles nativamente en React Native. Los resultados se imprimen en
// la consola de Metro (la misma terminal donde corre "npx expo run:android"),
// con el prefijo [PERF] para poder identificarlos fácilmente.
//
// markScreenReady recibe el timestamp de inicio como parámetro (en vez de
// usar un reloj global fijo), para que sirva tanto para medir el arranque
// en frío de la app (desde app/_layout.tsx) como el tiempo de una
// transición de pantalla en caliente (desde el momento en que ese
// componente se empieza a construir).

export function markScreenReady(screenName: string, startTime: number) {
  const elapsedMs = Date.now() - startTime;
  console.log(`[PERF] Tiempo hasta "${screenName}" visible: ${elapsedMs} ms`);
  return elapsedMs;
}

// Mide FPS real durante un periodo de tiempo, contando cuántos frames
// (fotogramas) se renderizan por segundo con requestAnimationFrame.
// Se usa mientras el usuario interactúa con la app (por ejemplo, mientras
// se hace scroll en la lista de tareas).
export function startFpsMonitor(durationMs: number = 5000) {
  if (process.env.NODE_ENV === 'test') return;

  let frameCount = 0;
  let lastSecondFrameCount = 0;
  let lastSecondTimestamp = Date.now();
  const startTime = Date.now();
  const samples: number[] = [];

  function tick() {
    frameCount++;
    const now = Date.now();
    if (now - lastSecondTimestamp >= 1000) {
      const fps = frameCount - lastSecondFrameCount;
      samples.push(fps);
      console.log(`[PERF] FPS en el último segundo: ${fps}`);
      lastSecondFrameCount = frameCount;
      lastSecondTimestamp = now;
    }
    if (now - startTime < durationMs) {
      requestAnimationFrame(tick);
    } else {
      const avg = samples.length ? Math.round(samples.reduce((a, b) => a + b, 0) / samples.length) : 0;
      console.log(`[PERF] FPS promedio durante ${durationMs}ms: ${avg}`);
    }
  }

  requestAnimationFrame(tick);
}
