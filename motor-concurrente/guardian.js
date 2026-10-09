const {
    parentPort,
    workerData,
    threadId
} = require('worker_threads');

// ========================================
// HILO GUARDIÁN DE INTERBLOQUEOS
// ========================================

// Estructuras compartidas con T1 y T2.
const propietarios = new Int32Array(
    workerData.memoriaPropietarios
);

const esperas = new Int32Array(
    workerData.memoriaEsperas
);

// ========================================
// CONSTRUCCIÓN DINÁMICA DEL RAG
// ========================================

function construirRAG() {

    const grafo = {
        T1: [],
        T2: [],
        A: [],
        B: []
    };

    const recursos = ['A', 'B'];

    // Aristas de asignación: recurso -> hilo.
    for (let r = 0; r < 2; r++) {

        const propietario = Atomics.load(
            propietarios,
            r
        );

        if (propietario === 1 || propietario === 2) {
            grafo[recursos[r]].push(
                `T${propietario}`
            );
        }
    }

    // Aristas de solicitud: hilo -> recurso.
    for (let t = 0; t < 2; t++) {

        const recurso = Atomics.load(
            esperas,
            t
        );

        if (recurso === 0 || recurso === 1) {
            grafo[`T${t + 1}`].push(
                recursos[recurso]
            );
        }
    }

    return grafo;
}

// ========================================
// DETECCIÓN DE CICLOS MEDIANTE DFS
// ========================================

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

        for (const vecino of grafo[nodo] || []) {

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

// ========================================
// VIGILANCIA AUTOMÁTICA
// ========================================

let deteccionRealizada = false;

console.log(
    `[GUARDIAN] Hilo independiente iniciado. threadId=${threadId}`
);

const monitor = setInterval(() => {

    if (deteccionRealizada) {
        return;
    }

    const grafo = construirRAG();
    const ciclo = detectarCiclo(grafo);

    // Informar al servidor sobre el RAG actual.
    parentPort.postMessage({
        tipo: 'RAG_ACTUALIZADO',
        grafo
    });

    if (ciclo) {

        deteccionRealizada = true;

        parentPort.postMessage({
            tipo: 'DEADLOCK_DETECTADO',
            ciclo,
            grafo
        });

        clearInterval(monitor);
    }

}, 100);

// Permitir una finalización controlada.
parentPort.on('message', mensaje => {

    if (mensaje?.tipo === 'DETENER') {

        clearInterval(monitor);

        parentPort.postMessage({
            tipo: 'GUARDIAN_DETENIDO'
        });

        parentPort.close();
    }
});