const {
    Worker,
    isMainThread,
    workerData,
    parentPort,
    threadId
} = require('worker_threads');

if (isMainThread) {

    // ==============================
    // MEMORIA COMPARTIDA
    // ==============================

    // Locks: 0 = libre, 1 = ocupado
    const memoriaLocks = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * 2
    );

    // Propietarios:
    // 0 = nadie, 1 = T1, 2 = T2
    const memoriaPropietarios = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * 2
    );

    // Esperas:
    // -1 = ninguno, 0 = A, 1 = B
    const memoriaEsperas = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * 2
    );

    // Señal de cancelación:
    // 0 = continuar
    // 1 = cancelar
    const memoriaCancelar = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * 2
    );

    const memoriaBarrera = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT
    );

    const locks = new Int32Array(memoriaLocks);
    const propietarios = new Int32Array(memoriaPropietarios);
    const esperas = new Int32Array(memoriaEsperas);
    const cancelar = new Int32Array(memoriaCancelar);
    const barrera = new Int32Array(memoriaBarrera);

    locks.fill(0);
    propietarios.fill(0);
    esperas.fill(-1);
    cancelar.fill(0);
    barrera[0] = 0;

    console.log('==========================================');
    console.log(' DEADLOCK + RAG + DFS + RECUPERACIÓN');
    console.log('==========================================');
    console.log(`PID principal: ${process.pid}`);
    console.log('');

    function crearWorker(id, nombre, primero, segundo) {

        const worker = new Worker(__filename, {
            workerData: {
                id,
                nombre,
                primero,
                segundo,
                memoriaLocks,
                memoriaPropietarios,
                memoriaEsperas,
                memoriaCancelar,
                memoriaBarrera
            }
        });

        worker.on('message', mensaje => {
            console.log(mensaje);
        });

        worker.on('error', error => {
            console.error(`[${nombre}] ERROR`, error);
        });

        worker.on('exit', codigo => {
            console.log(
                `[${nombre}] finalizó con código ${codigo}`
            );
        });

        return worker;
    }

    crearWorker(1, 'T1', 0, 1);
    crearWorker(2, 'T2', 1, 0);

    // ==============================
    // CONSTRUIR RAG
    // ==============================

    function construirRAG() {

        const grafo = {
            T1: [],
            T2: [],
            A: [],
            B: []
        };

        const recursos = ['A', 'B'];

        for (let r = 0; r < 2; r++) {

            const propietario =
                Atomics.load(propietarios, r);

            if (propietario !== 0) {
                grafo[recursos[r]].push(
                    `T${propietario}`
                );
            }
        }

        for (let t = 0; t < 2; t++) {

            const espera =
                Atomics.load(esperas, t);

            if (espera !== -1) {
                grafo[`T${t + 1}`].push(
                    recursos[espera]
                );
            }
        }

        return grafo;
    }

    // ==============================
    // DFS
    // ==============================

    function detectarCiclo(grafo) {

        const visitados = new Set();
        const enCamino = new Set();
        const camino = [];

        function dfs(nodo) {

            if (enCamino.has(nodo)) {

                const inicio =
                    camino.indexOf(nodo);

                return [
                    ...camino.slice(inicio),
                    nodo
                ];
            }

            if (visitados.has(nodo)) {
                return null;
            }

            visitados.add(nodo);
            enCamino.add(nodo);
            camino.push(nodo);

            for (const vecino of grafo[nodo]) {

                const ciclo = dfs(vecino);

                if (ciclo) {
                    return ciclo;
                }
            }

            camino.pop();
            enCamino.delete(nodo);

            return null;
        }

        for (const nodo of Object.keys(grafo)) {

            const ciclo = dfs(nodo);

            if (ciclo) {
                return ciclo;
            }
        }

        return null;
    }

    let recuperacionEjecutada = false;

    // ==============================
    // GUARDIÁN
    // ==============================

    const guardian = setInterval(() => {

        const grafo = construirRAG();
        const ciclo = detectarCiclo(grafo);

        if (ciclo && !recuperacionEjecutada) {

            recuperacionEjecutada = true;

            console.log('');
            console.log('--- RAG EN DEADLOCK ---');

            for (
                const [nodo, vecinos]
                of Object.entries(grafo)
            ) {
                if (vecinos.length > 0) {
                    console.log(
                        `${nodo} -> ${vecinos.join(', ')}`
                    );
                }
            }

            console.log('');
            console.log('==========================================');
            console.log(' INTERBLOQUEO DETECTADO');
            console.log('==========================================');

            console.log(
                `Ciclo: ${ciclo.join(' -> ')}`
            );

            console.log('');
            console.log('--- RECUPERACIÓN ---');

            /*
                Estrategia:
                T2 será la víctima.

                No modificó saldos todavía,
                así que puede cancelar su
                transacción de forma segura.
            */

            console.log(
                'Víctima seleccionada: T2'
            );

            Atomics.store(
                cancelar,
                1,
                1
            );

            // Despertamos T2 si está esperando.
            Atomics.notify(
                locks,
                0,
                10
            );

            Atomics.notify(
                locks,
                1,
                10
            );
        }

        if (recuperacionEjecutada) {

            const nuevoGrafo =
                construirRAG();

            const nuevoCiclo =
                detectarCiclo(nuevoGrafo);

            if (!nuevoCiclo) {

                console.log('');
                console.log('==========================================');
                console.log(' INTERBLOQUEO RESUELTO');
                console.log('==========================================');

                console.log(
                    'El RAG ya no contiene ciclos.'
                );

                clearInterval(guardian);

                setTimeout(() => {
                    process.exit(0);
                }, 1000);
            }
        }

    }, 300);

} else {

    const locks = new Int32Array(
        workerData.memoriaLocks
    );

    const propietarios = new Int32Array(
        workerData.memoriaPropietarios
    );

    const esperas = new Int32Array(
        workerData.memoriaEsperas
    );

    const cancelar = new Int32Array(
        workerData.memoriaCancelar
    );

    const barrera = new Int32Array(
        workerData.memoriaBarrera
    );

    const {
        id,
        nombre,
        primero,
        segundo
    } = workerData;

    const recursos = ['A', 'B'];

    function liberarLock(indice) {

        if (
            Atomics.load(propietarios, indice)
            === id
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

            parentPort.postMessage(
                `[${nombre}] liberó recurso ${recursos[indice]}`
            );
        }
    }

    function adquirirLock(indice) {

        while (true) {

            // ¿Fue cancelada esta transacción?
            if (
                Atomics.load(
                    cancelar,
                    id - 1
                ) === 1
            ) {
                return false;
            }

            const adquirido =
                Atomics.compareExchange(
                    locks,
                    indice,
                    0,
                    1
                );

            if (adquirido === 0) {

                Atomics.store(
                    esperas,
                    id - 1,
                    -1
                );

                Atomics.store(
                    propietarios,
                    indice,
                    id
                );

                return true;
            }

            Atomics.store(
                esperas,
                id - 1,
                indice
            );

            Atomics.wait(
                locks,
                indice,
                1,
                200
            );
        }
    }

    // ==============================
    // PRIMER RECURSO
    // ==============================

    if (!adquirirLock(primero)) {
        process.exit(0);
    }

    parentPort.postMessage(
        `[${nombre}] threadId=${threadId} posee ${recursos[primero]}`
    );

    Atomics.add(
        barrera,
        0,
        1
    );

    while (
        Atomics.load(barrera, 0) < 2
    ) {

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

    // ==============================
    // SEGUNDO RECURSO
    // ==============================

    Atomics.store(
        esperas,
        id - 1,
        segundo
    );

    parentPort.postMessage(
        `[${nombre}] solicita ${recursos[segundo]}`
    );

    const obtuvoSegundo =
        adquirirLock(segundo);

    // ==============================
    // CANCELACIÓN
    // ==============================

    if (!obtuvoSegundo) {

        parentPort.postMessage(
            `[${nombre}] transacción CANCELADA`
        );

        Atomics.store(
            esperas,
            id - 1,
            -1
        );

        liberarLock(primero);

        parentPort.postMessage(
            `[${nombre}] recuperación completada`
        );

        process.exit(0);
    }

    // ==============================
    // CONTINUACIÓN NORMAL
    // ==============================

    parentPort.postMessage(
        `[${nombre}] adquirió ambos recursos`
    );

    parentPort.postMessage(
        `[${nombre}] operación completada`
    );

    liberarLock(segundo);
    liberarLock(primero);

    process.exit(0);
}
