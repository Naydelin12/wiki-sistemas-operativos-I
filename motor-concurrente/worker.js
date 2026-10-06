const { parentPort, workerData, threadId } = require('worker_threads');

console.log(
    `[HILO ${workerData.nombre}] iniciado | threadId=${threadId} | PID=${process.pid}`
);

let contador = 0;

setInterval(() => {
    contador++;

    console.log(
        `[HILO ${workerData.nombre}] trabajando... operación ${contador}`
    );

    parentPort.postMessage({
        nombre: workerData.nombre,
        threadId: threadId,
        operacion: contador
    });
}, 2000);
