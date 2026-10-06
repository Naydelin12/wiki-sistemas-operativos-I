const { Worker, threadId } = require('worker_threads');

console.log('==========================================');
console.log(' MOTOR DE TRANSACCIONES CONCURRENTES');
console.log('==========================================');
console.log(`Proceso principal PID: ${process.pid}`);
console.log(`Hilo principal threadId: ${threadId}`);
console.log('');

function crearTrabajador(nombre) {
    const worker = new Worker('./worker.js', {
        workerData: {
            nombre: nombre
        }
    });

    worker.on('message', (mensaje) => {
        console.log(
            `[MAIN] Mensaje recibido de ${mensaje.nombre} | ` +
            `threadId=${mensaje.threadId} | operación=${mensaje.operacion}`
        );
    });

    worker.on('error', (error) => {
        console.error(`[ERROR ${nombre}]`, error);
    });

    worker.on('exit', (codigo) => {
        console.log(`[MAIN] ${nombre} terminó con código ${codigo}`);
    });

    return worker;
}

crearTrabajador('T1');
crearTrabajador('T2');

console.log('T1 y T2 fueron creados.');
console.log('Presiona Ctrl+C para detener el programa.');
