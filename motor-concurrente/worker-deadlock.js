const {
    parentPort,
    workerData,
    threadId
} = require('worker_threads');

const locks = new Int32Array(workerData.memoriaLocks);
const propietarios = new Int32Array(workerData.memoriaPropietarios);
const esperas = new Int32Array(workerData.memoriaEsperas);
const barrera = new Int32Array(workerData.memoriaBarrera);
const cancelar = new Int32Array(workerData.memoriaCancelar);

const {
    id,
    nombre,
    primero,
    segundo
} = workerData;

const recursos = ['A', 'B'];

function enviar(tipo, detalle) {
    parentPort.postMessage({
        tipo,
        nombre,
        threadId,
        detalle
    });
}

function adquirir(indice) {
	let esperaNotificada = false;
    while (true) {

        // Permite que posteriormente /api/resolver
        // cancele una transacción bloqueada.
        if (Atomics.load(cancelar, id - 1) === 1) {
            return false;
        }

        if (
            Atomics.compareExchange(
                locks,
                indice,
                0,
                1
            ) === 0
        ) {

            Atomics.store(
                propietarios,
                indice,
                id
            );

            Atomics.store(
                esperas,
                id - 1,
                -1
            );

            enviar(
                'POSEE',
                `posee recurso ${recursos[indice]}`
            );

            return true;
        }

        Atomics.store(
            esperas,
            id - 1,
            indice
        );

if (!esperaNotificada) {

    enviar(
        'ESPERA',
        `espera recurso ${recursos[indice]}`
    );

    esperaNotificada = true;
}

        Atomics.wait(
            locks,
            indice,
            1,
            200
        );
    }
}

function liberar(indice) {

    if (
        Atomics.load(propietarios, indice) === id
    ) {

        Atomics.store(
            propietarios,
            indice,
            0
        );

        Atomics.store(
            locks,
            indice,
            0
        );

        Atomics.notify(
            locks,
            indice,
            10
        );

        enviar(
            'LIBERA',
            `liberó recurso ${recursos[indice]}`
        );
    }
}

// Primer recurso
if (!adquirir(primero)) {
    process.exit(0);
}

// Barrera: ambos trabajadores deben tener
// su primer recurso antes de pedir el segundo.
Atomics.add(barrera, 0, 1);

while (Atomics.load(barrera, 0) < 2) {

    Atomics.wait(
        barrera,
        0,
        1,
        100
    );
}

Atomics.notify(
    barrera,
    0,
    2
);

// Solicita el segundo recurso.
Atomics.store(
    esperas,
    id - 1,
    segundo
);

enviar(
    'SOLICITA',
    `solicita recurso ${recursos[segundo]}`
);

const segundoAdquirido = adquirir(segundo);

// Si /api/resolver lo cancela:
if (!segundoAdquirido) {

    enviar(
        'CANCELADO',
        'transacción cancelada para recuperar el sistema'
    );

    Atomics.store(
        esperas,
        id - 1,
        -1
    );

    liberar(primero);

    process.exit(0);
}

// Si el otro trabajador fue cancelado,
// este puede continuar.
enviar(
    'CONTINUA',
    'adquirió ambos recursos y puede continuar'
);

liberar(segundo);
liberar(primero);

process.exit(0);
