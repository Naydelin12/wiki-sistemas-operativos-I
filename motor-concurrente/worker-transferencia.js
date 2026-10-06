const {
    parentPort,
    workerData,
    threadId
} = require('worker_threads');

const saldos = new Int32Array(
    workerData.memoriaSaldos
);

const locks = new Int32Array(
    workerData.memoriaLocks
);

const {
    nombre,
    origen,
    destino,
    monto
} = workerData;

const cuentas = ['A', 'B'];

function enviar(estado, detalle) {

    parentPort.postMessage({
        nombre,
        threadId,
        estado,
        detalle
    });
}

// ==========================================
// MUTEX
// ==========================================

function adquirirLock(indice) {

    enviar(
        'ESPERANDO',
        `solicita Mutex de Cuenta ${cuentas[indice]}`
    );

    while (
        Atomics.compareExchange(
            locks,
            indice,
            0,
            1
        ) !== 0
    ) {

        Atomics.wait(
            locks,
            indice,
            1,
            100
        );
    }

    enviar(
        'EJECUTANDO',
        `adquirió Mutex de Cuenta ${cuentas[indice]}`
    );
}

function liberarLock(indice) {

    Atomics.store(
        locks,
        indice,
        0
    );

    Atomics.notify(
        locks,
        indice,
        1
    );
}

// ==========================================
// TRANSFERENCIA
// ==========================================

enviar(
    'EJECUTANDO',
    `threadId=${threadId} inició transferencia ` +
    `${cuentas[origen]} -> ${cuentas[destino]} Q${monto}`
);

// Orden global para evitar deadlock.
const primero = Math.min(origen, destino);
const segundo = Math.max(origen, destino);

adquirirLock(primero);
adquirirLock(segundo);

if (saldos[origen] >= monto) {

    saldos[origen] -= monto;
    saldos[destino] += monto;

    enviar(
        'EJECUTANDO',
        `transferencia ${cuentas[origen]} -> ` +
        `${cuentas[destino]} completada`
    );

} else {

    enviar(
        'ERROR',
        'saldo insuficiente'
    );
}

liberarLock(segundo);
liberarLock(primero);

enviar(
    'FINALIZADO',
    'liberó todos los recursos'
);
