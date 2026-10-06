const {
    Worker,
    isMainThread,
    workerData,
    parentPort,
    threadId
} = require('worker_threads');

if (isMainThread) {

    // Dos Mutex:
    // 0 = Cuenta A
    // 1 = Cuenta B
    const memoriaLocks = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * 2
    );

    /*
       Barrera de sincronización:
       barrera[0] = cantidad de trabajadores
                    que adquirieron su primer recurso
    */
    const memoriaBarrera = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT
    );

    const locks = new Int32Array(memoriaLocks);
    const barrera = new Int32Array(memoriaBarrera);

    locks[0] = 0;
    locks[1] = 0;
    barrera[0] = 0;

    console.log('==========================================');
    console.log(' MODO CAÓTICO - INTERBLOQUEO REAL');
    console.log('==========================================');
    console.log(`PID principal: ${process.pid}`);
    console.log('');
    console.log('T1 solicitará: A -> B');
    console.log('T2 solicitará: B -> A');
    console.log('');

    function crearWorker(nombre, primero, segundo) {

        const worker = new Worker(__filename, {
            workerData: {
                nombre,
                primero,
                segundo,
                memoriaLocks,
                memoriaBarrera
            }
        });

        worker.on('message', mensaje => {
            console.log(mensaje);
        });

        worker.on('error', error => {
            console.error(`[${nombre}] ERROR:`, error);
        });

        return worker;
    }

    crearWorker('T1', 0, 1);
    crearWorker('T2', 1, 0);

    // Monitor del estado real de los locks.
    setInterval(() => {

        console.log('');
        console.log('--- ESTADO DE RECURSOS ---');
        console.log(
            `Mutex A: ${Atomics.load(locks, 0) === 1 ? 'OCUPADO' : 'LIBRE'}`
        );
        console.log(
            `Mutex B: ${Atomics.load(locks, 1) === 1 ? 'OCUPADO' : 'LIBRE'}`
        );
        console.log(
            `Trabajadores en barrera: ${Atomics.load(barrera, 0)}`
        );

    }, 3000);
}

else {

    const locks = new Int32Array(workerData.memoriaLocks);
    const barrera = new Int32Array(workerData.memoriaBarrera);

    const {
        nombre,
        primero,
        segundo
    } = workerData;

    const cuentas = ['A', 'B'];

    function adquirirLock(indice) {

        while (
            Atomics.compareExchange(
                locks,
                indice,
                0,
                1
            ) !== 0
        ) {

            parentPort.postMessage(
                `[${nombre}] ESPERANDO Mutex ${cuentas[indice]}`
            );

            Atomics.wait(
                locks,
                indice,
                1
            );
        }
    }

    // Adquirimos el primer recurso.
    adquirirLock(primero);

    parentPort.postMessage(
        `[${nombre}] threadId=${threadId} adquirió Mutex ${cuentas[primero]}`
    );

    /*
       BARRERA REAL

       Cada trabajador informa que ya posee
       su primer recurso.
    */
    Atomics.add(barrera, 0, 1);

    // Esperamos hasta que AMBOS tengan
    // su primer recurso.
    while (Atomics.load(barrera, 0) < 2) {

        Atomics.wait(
            barrera,
            0,
            1,
            100
        );
    }

    // Despertamos al otro trabajador.
    Atomics.notify(
        barrera,
        0,
        2
    );

    parentPort.postMessage(
        `[${nombre}] solicita Mutex ${cuentas[segundo]}`
    );

    /*
       AQUÍ APARECERÁ EL DEADLOCK:

       T1 posee A y espera B.
       T2 posee B y espera A.
    */
    adquirirLock(segundo);

    // En esta demostración nunca deberíamos
    // llegar aquí mientras exista el deadlock.
    parentPort.postMessage(
        `[${nombre}] adquirió ambos recursos`
    );
}
