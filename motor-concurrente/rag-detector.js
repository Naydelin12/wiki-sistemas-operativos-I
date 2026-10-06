const {
    Worker,
    isMainThread,
    workerData,
    parentPort,
    threadId
} = require('worker_threads');

if (isMainThread) {

    // =========================
    // MEMORIA COMPARTIDA
    // =========================

    // Mutex de recursos:
    // 0 = Cuenta A
    // 1 = Cuenta B
    const memoriaLocks = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * 2
    );

    // Propietario de cada recurso:
    // 0 = nadie
    // 1 = T1
    // 2 = T2
    const memoriaPropietarios = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * 2
    );

    // Recurso que espera cada trabajador:
    // -1 = ninguno
    // 0 = A
    // 1 = B
    const memoriaEsperas = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * 2
    );

    const memoriaBarrera = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT
    );

    const locks = new Int32Array(memoriaLocks);
    const propietarios = new Int32Array(memoriaPropietarios);
    const esperas = new Int32Array(memoriaEsperas);
    const barrera = new Int32Array(memoriaBarrera);

    propietarios.fill(0);
    esperas.fill(-1);
    barrera[0] = 0;

    console.log('==========================================');
    console.log(' RAG DINÁMICO + DETECTOR DE DEADLOCK');
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
                memoriaBarrera
            }
        });

        worker.on('message', mensaje => {
            console.log(mensaje);
        });

        worker.on('error', error => {
            console.error(`[${nombre}]`, error);
        });
    }

    crearWorker(1, 'T1', 0, 1);
    crearWorker(2, 'T2', 1, 0);

    // =========================
    // CONSTRUIR RAG
    // =========================

    function construirRAG() {

        const grafo = {
            T1: [],
            T2: [],
            A: [],
            B: []
        };

        const nombresRecursos = ['A', 'B'];

        // Recurso -> trabajador
        // significa ASIGNACIÓN.
        for (let r = 0; r < 2; r++) {

            const propietario = Atomics.load(
                propietarios,
                r
            );

            if (propietario !== 0) {
                grafo[nombresRecursos[r]].push(
                    `T${propietario}`
                );
            }
        }

        // Trabajador -> recurso
        // significa SOLICITUD.
        for (let t = 0; t < 2; t++) {

            const recursoEsperado = Atomics.load(
                esperas,
                t
            );

            if (recursoEsperado !== -1) {
                grafo[`T${t + 1}`].push(
                    nombresRecursos[recursoEsperado]
                );
            }
        }

        return grafo;
    }

    // =========================
    // DFS PARA BUSCAR CICLOS
    // =========================

    function detectarCiclo(grafo) {

        const visitados = new Set();
        const enCamino = new Set();
        const camino = [];

        function dfs(nodo) {

            if (enCamino.has(nodo)) {

                const inicio = camino.indexOf(nodo);

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

    // =========================
    // HILO GUARDIÁN LÓGICO
    // =========================

    const guardian = setInterval(() => {

        const grafo = construirRAG();
        const ciclo = detectarCiclo(grafo);

        console.log('');
        console.log('--- RAG ACTUAL ---');

        for (const [nodo, vecinos] of Object.entries(grafo)) {

            if (vecinos.length > 0) {
                console.log(
                    `${nodo} -> ${vecinos.join(', ')}`
                );
            }
        }

        if (ciclo) {

            console.log('');
            console.log('==========================================');
            console.log(' INTERBLOQUEO DETECTADO');
            console.log('==========================================');

            console.log(
                `Ciclo: ${ciclo.join(' -> ')}`
            );

            console.log('');
            console.log(
                'DFS encontró una espera circular en el RAG.'
            );

            clearInterval(guardian);
        }

    }, 500);

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

    const barrera = new Int32Array(
        workerData.memoriaBarrera
    );

    const {
        id,
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

            // Registramos el estado REAL
            // de espera para construir el RAG.
            Atomics.store(
                esperas,
                id - 1,
                indice
            );

            Atomics.wait(
                locks,
                indice,
                1
            );
        }

        // Ya no está esperando.
        Atomics.store(
            esperas,
            id - 1,
            -1
        );

        // Registramos quién posee el recurso.
        Atomics.store(
            propietarios,
            indice,
            id
        );
    }

    adquirirLock(primero);

    parentPort.postMessage(
        `[${nombre}] threadId=${threadId} posee recurso ${cuentas[primero]}`
    );

    // Barrera: ambos deben poseer
    // su primer recurso.
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

    // Antes de intentar adquirir el segundo,
    // registramos la solicitud.
    Atomics.store(
        esperas,
        id - 1,
        segundo
    );

    parentPort.postMessage(
        `[${nombre}] solicita recurso ${cuentas[segundo]}`
    );

    adquirirLock(segundo);

    parentPort.postMessage(
        `[${nombre}] adquirió ambos recursos`
    );
}
