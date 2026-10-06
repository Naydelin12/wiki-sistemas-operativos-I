const {
    Worker,
    isMainThread,
    workerData,
    parentPort,
    threadId
} = require('worker_threads');

const NUM_CUENTAS = 2;

if (isMainThread) {

    // Memoria compartida para los saldos.
    const memoriaSaldos = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * NUM_CUENTAS
    );

    // Memoria compartida para los Mutex.
    // 0 = libre
    // 1 = bloqueado
    const memoriaLocks = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * NUM_CUENTAS
    );

    const saldos = new Int32Array(memoriaSaldos);
    const locks = new Int32Array(memoriaLocks);

    // Q1000 en cada cuenta.
    saldos[0] = 1000; // Cuenta A
    saldos[1] = 1000; // Cuenta B

    locks[0] = 0;
    locks[1] = 0;

    console.log('==========================================');
    console.log(' MOTOR DE TRANSFERENCIAS CONCURRENTES');
    console.log('==========================================');
    console.log(`PID principal: ${process.pid}`);
    console.log('');
    console.log('SALDOS INICIALES');
    console.log(`Cuenta A: Q${saldos[0]}`);
    console.log(`Cuenta B: Q${saldos[1]}`);
    console.log(`Total:    Q${saldos[0] + saldos[1]}`);
    console.log('');

    const trabajadores = [
        {
            nombre: 'T1',
            origen: 0,
            destino: 1,
            monto: 100
        },
        {
            nombre: 'T2',
            origen: 1,
            destino: 0,
            monto: 50
        }
    ];

    let terminados = 0;

    for (const datos of trabajadores) {

        const worker = new Worker(__filename, {
            workerData: {
                ...datos,
                memoriaSaldos,
                memoriaLocks
            }
        });

        worker.on('message', mensaje => {
            console.log(mensaje);
        });

        worker.on('error', error => {
            console.error('Error del trabajador:', error);
        });

        worker.on('exit', codigo => {

            terminados++;

            console.log(
                `${datos.nombre} finalizó con código ${codigo}`
            );

            if (terminados === trabajadores.length) {

                console.log('');
                console.log('==========================================');
                console.log(' RESULTADO FINAL');
                console.log('==========================================');

                console.log(`Cuenta A: Q${saldos[0]}`);
                console.log(`Cuenta B: Q${saldos[1]}`);

                const total = saldos[0] + saldos[1];

                console.log(`Total:    Q${total}`);
                console.log('');

                if (total === 2000) {
                    console.log('INTEGRIDAD CONSERVADA');
                    console.log(
                        'El dinero total del sistema continúa siendo Q2000.'
                    );
                } else {
                    console.log('ERROR DE INTEGRIDAD');
                }
            }
        });
    }

} else {

    const saldos = new Int32Array(workerData.memoriaSaldos);
    const locks = new Int32Array(workerData.memoriaLocks);

    const {
        nombre,
        origen,
        destino,
        monto
    } = workerData;

    const nombresCuenta = ['A', 'B'];

    // ==============================
    // MUTEX
    // ==============================

    function adquirirLock(indice) {

        while (
            Atomics.compareExchange(
                locks,
                indice,
                0,
                1
            ) !== 0
        ) {
            // El lock está ocupado.
            // Esperamos hasta que cambie.
            Atomics.wait(
                locks,
                indice,
                1,
                100
            );
        }
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

    // Para el modo normal adquirimos siempre
    // los locks en un orden global.
    // Esto evita deadlocks.

    const primero = Math.min(origen, destino);
    const segundo = Math.max(origen, destino);

    parentPort.postMessage(
        `[${nombre}] threadId=${threadId} inicia transferencia ` +
        `Cuenta ${nombresCuenta[origen]} -> ` +
        `Cuenta ${nombresCuenta[destino]} | Q${monto}`
    );

    adquirirLock(primero);

    parentPort.postMessage(
        `[${nombre}] adquirió Mutex de Cuenta ` +
        `${nombresCuenta[primero]}`
    );

    adquirirLock(segundo);

    parentPort.postMessage(
        `[${nombre}] adquirió Mutex de Cuenta ` +
        `${nombresCuenta[segundo]}`
    );

    // ==============================
    // SECCIÓN CRÍTICA
    // ==============================

    if (saldos[origen] >= monto) {

        saldos[origen] -= monto;
        saldos[destino] += monto;

        parentPort.postMessage(
            `[${nombre}] transferencia realizada correctamente`
        );

    } else {

        parentPort.postMessage(
            `[${nombre}] saldo insuficiente`
        );
    }

    // Liberamos en orden inverso.
    liberarLock(segundo);
    liberarLock(primero);

    parentPort.postMessage(
        `[${nombre}] liberó los recursos`
    );
}
