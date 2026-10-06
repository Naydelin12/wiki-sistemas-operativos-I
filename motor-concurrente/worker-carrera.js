const {
    parentPort,
    workerData,
    threadId
} = require('worker_threads');

const contador = new Int32Array(
    workerData.memoriaContador
);

const {
    nombre,
    operaciones,
    protegido
} = workerData;

function enviar(tipo, detalle) {
    parentPort.postMessage({
        tipo,
        nombre,
        threadId,
        detalle
    });
}

enviar(
    'INICIO',
    `threadId=${threadId} inició con ${operaciones} operaciones`
);

// ==========================================
// MODO PROTEGIDO
// ==========================================

if (protegido) {

    for (let i = 0; i < operaciones; i++) {
        Atomics.add(contador, 0, 1);
    }

} else {

    // ======================================
    // MODO SIN PROTECCIÓN
    // ======================================
    // Se amplía deliberadamente la ventana
    // crítica para evidenciar la carrera.

    const pausa = new Int32Array(
        new SharedArrayBuffer(
            Int32Array.BYTES_PER_ELEMENT
        )
    );

    for (let i = 0; i < operaciones; i++) {

        // LECTURA NO ATÓMICA
        const valorActual = contador[0];

        // Cada cierto número de operaciones
        // cedemos tiempo para favorecer que
        // ambos workers lean el mismo valor.
        if (i % 100 === 0) {

            Atomics.wait(
                pausa,
                0,
                0,
                1
            );
        }

        // ESCRITURA NO ATÓMICA
        contador[0] = valorActual + 1;
    }
}

enviar(
    'FINALIZADO',
    `${nombre} terminó sus operaciones`
);
