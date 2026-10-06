const express = require('express');
const cors = require('cors');
const { Worker } = require('worker_threads');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

// ==========================================
// ESTADO REAL DEL MOTOR
// ==========================================

const estadoMotor = {
    estado: 'NORMAL',

    cuentas: {
        A: 1000,
        B: 1000
    },

    hilos: [],

    rag: {
        nodos: [],
        aristas: []
    },

    deadlock: false,

    eventos: []
};

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get('/', (req, res) => {

    res.json({
        proyecto: 'Motor de Transacciones Concurrentes',
        estado: 'ACTIVO',
        entorno: 'WSL2',
        pid: process.pid,
        mensaje: 'Backend conectado correctamente'
    });
});

// ==========================================
// CONSULTAR ESTADO
// ==========================================

app.get('/api/estado', (req, res) => {

    res.json(estadoMotor);
});

// ==========================================
// TRANSFERENCIAS NORMALES
// ==========================================

app.post('/api/transferencias', (req, res) => {

    if (estadoMotor.estado === 'EJECUTANDO') {

        return res.status(409).json({
            error: 'Ya existe una operación en ejecución.'
        });
    }

    estadoMotor.estado = 'EJECUTANDO';
    estadoMotor.deadlock = false;
    estadoMotor.eventos = [];
    estadoMotor.hilos = [];

    // --------------------------
    // MEMORIA COMPARTIDA
    // --------------------------

    const memoriaSaldos = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * 2
    );

    const memoriaLocks = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT * 2
    );

    const saldos = new Int32Array(memoriaSaldos);
    const locks = new Int32Array(memoriaLocks);

    // Usamos el estado actual de las cuentas.
    saldos[0] = estadoMotor.cuentas.A;
    saldos[1] = estadoMotor.cuentas.B;

    locks[0] = 0;
    locks[1] = 0;

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

        estadoMotor.hilos.push({
            nombre: datos.nombre,
            estado: 'INICIANDO',
            threadId: null
        });

        const worker = new Worker(
            path.join(__dirname, 'worker-transferencia.js'),
            {
                workerData: {
                    ...datos,
                    memoriaSaldos,
                    memoriaLocks
                }
            }
        );

        worker.on('message', mensaje => {

            estadoMotor.eventos.push(mensaje);

            const hilo = estadoMotor.hilos.find(
                h => h.nombre === mensaje.nombre
            );

            if (hilo) {

                hilo.estado = mensaje.estado;

                if (mensaje.threadId !== undefined) {
                    hilo.threadId = mensaje.threadId;
                }
            }

            console.log(
                `[${mensaje.nombre}] ${mensaje.detalle}`
            );
        });

        worker.on('error', error => {

            console.error(
                `[${datos.nombre}]`,
                error
            );

            estadoMotor.estado = 'ERROR';
        });

        worker.on('exit', codigo => {

            terminados++;

            const hilo = estadoMotor.hilos.find(
                h => h.nombre === datos.nombre
            );

            if (hilo) {
                hilo.estado = 'FINALIZADO';
            }

            console.log(
                `${datos.nombre} terminó con código ${codigo}`
            );

            if (terminados === trabajadores.length) {

                estadoMotor.cuentas.A = saldos[0];
                estadoMotor.cuentas.B = saldos[1];

                estadoMotor.estado = 'NORMAL';

                console.log('');
                console.log('Transferencias terminadas.');
                console.log(
                    `Cuenta A: Q${estadoMotor.cuentas.A}`
                );
                console.log(
                    `Cuenta B: Q${estadoMotor.cuentas.B}`
                );
            }
        });
    }

    res.json({
        mensaje:
            'Transferencias concurrentes iniciadas en WSL2.',
        trabajadores: ['T1', 'T2']
    });
});
// ==========================================
// DEADLOCK + RAG + DFS
// ==========================================

let sesionDeadlock = null;

function construirRAG(propietarios, esperas) {

    const grafo = {
        T1: [],
        T2: [],
        A: [],
        B: []
    };

    const recursos = ['A', 'B'];

    // Recurso -> trabajador = asignación
    for (let r = 0; r < 2; r++) {

        const propietario =
            Atomics.load(propietarios, r);

        if (propietario !== 0) {
            grafo[recursos[r]].push(
                `T${propietario}`
            );
        }
    }

    // Trabajador -> recurso = solicitud
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

app.post('/api/deadlock', (req, res) => {

    if (sesionDeadlock) {

        return res.status(409).json({
            error:
                'Ya existe una demostración de deadlock activa.'
        });
    }

    const memoriaLocks =
        new SharedArrayBuffer(
            Int32Array.BYTES_PER_ELEMENT * 2
        );

    const memoriaPropietarios =
        new SharedArrayBuffer(
            Int32Array.BYTES_PER_ELEMENT * 2
        );

    const memoriaEsperas =
        new SharedArrayBuffer(
            Int32Array.BYTES_PER_ELEMENT * 2
        );

    const memoriaBarrera =
        new SharedArrayBuffer(
            Int32Array.BYTES_PER_ELEMENT
        );

    const memoriaCancelar =
        new SharedArrayBuffer(
            Int32Array.BYTES_PER_ELEMENT * 2
        );

    const propietarios =
        new Int32Array(memoriaPropietarios);

    const esperas =
        new Int32Array(memoriaEsperas);

    const cancelar =
        new Int32Array(memoriaCancelar);

    propietarios.fill(0);
    esperas.fill(-1);
    cancelar.fill(0);

    estadoMotor.estado = 'PROVOCANDO_DEADLOCK';
    estadoMotor.deadlock = false;
    estadoMotor.eventos = [];
    estadoMotor.hilos = [];

    const workers = [];

    const configuracion = [
        {
            id: 1,
            nombre: 'T1',
            primero: 0,
            segundo: 1
        },
        {
            id: 2,
            nombre: 'T2',
            primero: 1,
            segundo: 0
        }
    ];

    for (const datos of configuracion) {

        estadoMotor.hilos.push({
            nombre: datos.nombre,
            threadId: null,
            estado: 'INICIANDO'
        });

        const worker = new Worker(
            path.join(
                __dirname,
                'worker-deadlock.js'
            ),
            {
                workerData: {
                    ...datos,
                    memoriaLocks,
                    memoriaPropietarios,
                    memoriaEsperas,
                    memoriaBarrera,
                    memoriaCancelar
                }
            }
        );

        workers.push(worker);

        worker.on('message', mensaje => {

            estadoMotor.eventos.push(mensaje);

            const hilo =
                estadoMotor.hilos.find(
                    h => h.nombre === mensaje.nombre
                );

            if (hilo) {

                hilo.threadId =
                    mensaje.threadId;

                hilo.estado =
                    mensaje.tipo;
            }

            console.log(
                `[${mensaje.nombre}] ${mensaje.detalle}`
            );
        });

        worker.on('error', error => {
            console.error(error);
            estadoMotor.estado = 'ERROR';
        });
    }

    const monitor = setInterval(() => {

        const grafo =
            construirRAG(
                propietarios,
                esperas
            );

        const ciclo =
            detectarCiclo(grafo);

        const aristas = [];

        for (
            const [origen, destinos]
            of Object.entries(grafo)
        ) {

            for (const destino of destinos) {

                aristas.push({
                    origen,
                    destino,
                    tipo:
                        origen.startsWith('T')
                            ? 'SOLICITUD'
                            : 'ASIGNACION'
                });
            }
        }

        estadoMotor.rag = {
            nodos: ['T1', 'T2', 'A', 'B'],
            aristas
        };

        if (ciclo) {

            estadoMotor.deadlock = true;
            estadoMotor.estado =
                'DEADLOCK_DETECTADO';

            estadoMotor.ciclo = ciclo;

            clearInterval(monitor);

            console.log('');
            console.log(
                'INTERBLOQUEO DETECTADO POR DFS'
            );

            console.log(
                `Ciclo: ${ciclo.join(' -> ')}`
            );
        }

    }, 100);

    sesionDeadlock = {
        workers,
        propietarios,
        esperas,
        cancelar,
        monitor,
	memoriaLocks
    };

    res.json({
        mensaje:
            'Escenario de interbloqueo iniciado.',
        detalle:
            'T1 solicita A->B y T2 solicita B->A.'
    });
});

// ==========================================
// RESOLVER INTERBLOQUEO
// ==========================================

app.post('/api/resolver', (req, res) => {

    if (!sesionDeadlock) {

        return res.status(400).json({
            error:
                'No existe un interbloqueo activo.'
        });
    }

    if (!estadoMotor.deadlock) {

        return res.status(400).json({
            error:
                'Todavía no se ha detectado un interbloqueo.'
        });
    }

    console.log('');
    console.log('==========================================');
    console.log(' RECUPERACIÓN DEL INTERBLOQUEO');
    console.log('==========================================');

    console.log('Víctima seleccionada: T2');

    estadoMotor.estado = 'RECUPERANDO';

    estadoMotor.eventos.push({
        tipo: 'RECUPERACION',
        nombre: 'SISTEMA',
        detalle: 'T2 seleccionada como víctima'
    });

    // Cancelar T2.
    Atomics.store(
        sesionDeadlock.cancelar,
        1,
        1
    );

    /*
        Despertamos los workers.

        T2 comprobará la señal de cancelación,
        abandonará su transacción y liberará B.

        Entonces T1 podrá adquirir B.
    */

    for (let i = 0; i < 2; i++) {

        Atomics.notify(
            new Int32Array(
                sesionDeadlock.memoriaLocks
            ),
            i,
            10
        );
    }

    // Esperamos a que la recuperación ocurra.
    setTimeout(() => {

        const grafo = construirRAG(
            sesionDeadlock.propietarios,
            sesionDeadlock.esperas
        );

        const ciclo = detectarCiclo(grafo);

        const aristas = [];

        for (
            const [origen, destinos]
            of Object.entries(grafo)
        ) {

            for (const destino of destinos) {

                aristas.push({
                    origen,
                    destino,
                    tipo:
                        origen.startsWith('T')
                            ? 'SOLICITUD'
                            : 'ASIGNACION'
                });
            }
        }

        estadoMotor.rag = {
            nodos: ['T1', 'T2', 'A', 'B'],
            aristas
        };

        if (!ciclo) {

            estadoMotor.deadlock = false;
            estadoMotor.estado = 'RESUELTO';
            estadoMotor.ciclo = null;

            estadoMotor.eventos.push({
                tipo: 'RESUELTO',
                nombre: 'SISTEMA',
                detalle:
                    'El RAG ya no contiene ciclos'
            });

            console.log('');
            console.log('INTERBLOQUEO RESUELTO');
            console.log('El RAG ya no contiene ciclos.');

            // Permitimos iniciar otra demostración.
            sesionDeadlock = null;

        } else {

            estadoMotor.estado =
                'RECUPERACION_EN_PROCESO';
        }

    }, 1000);

    res.json({
        mensaje:
            'Recuperación iniciada.',
        victima: 'T2'
    });
});

// ==========================================
// CONDICIÓN DE CARRERA
// ==========================================

function ejecutarPruebaCarrera(protegido, res) {

    if (estadoMotor.estado === 'EJECUTANDO_CARRERA') {
        return res.status(409).json({
            error: 'Ya existe una prueba de carrera en ejecución.'
        });
    }

    const operacionesPorTrabajador = 100000;
    const numeroTrabajadores = 2;
    const valorEsperado =
        operacionesPorTrabajador * numeroTrabajadores;

    const memoriaContador =
        new SharedArrayBuffer(
            Int32Array.BYTES_PER_ELEMENT
        );

    const contador =
        new Int32Array(memoriaContador);

    contador[0] = 0;

    estadoMotor.estado = 'EJECUTANDO_CARRERA';
    estadoMotor.eventos = [];
    estadoMotor.hilos = [];
    estadoMotor.deadlock = false;

    const trabajadores = ['T1', 'T2'];

    let terminados = 0;

    for (const nombre of trabajadores) {

        estadoMotor.hilos.push({
            nombre,
            threadId: null,
            estado: 'INICIANDO'
        });

        const worker = new Worker(
            path.join(
                __dirname,
                'worker-carrera.js'
            ),
            {
                workerData: {
                    nombre,
                    operaciones:
                        operacionesPorTrabajador,
                    protegido,
                    memoriaContador
                }
            }
        );

        worker.on('message', mensaje => {

            estadoMotor.eventos.push(mensaje);

            const hilo =
                estadoMotor.hilos.find(
                    h => h.nombre === mensaje.nombre
                );

            if (hilo) {
                hilo.threadId = mensaje.threadId;
                hilo.estado = mensaje.tipo;
            }

            console.log(
                `[${mensaje.nombre}] ${mensaje.detalle}`
            );
        });

        worker.on('error', error => {

            console.error(error);

            estadoMotor.estado = 'ERROR';
        });

        worker.on('exit', codigo => {

            terminados++;

            const hilo =
                estadoMotor.hilos.find(
                    h => h.nombre === nombre
                );

            if (hilo) {
                hilo.estado = 'FINALIZADO';
            }

            console.log(
                `${nombre} terminó con código ${codigo}`
            );

            if (terminados === numeroTrabajadores) {

                const obtenido = contador[0];

                estadoMotor.pruebaCarrera = {
                    protegido,
                    trabajadores:
                        numeroTrabajadores,
                    operacionesPorTrabajador,
                    esperado: valorEsperado,
                    obtenido,
                    perdidas:
                        valorEsperado - obtenido,
                    integridad:
                        obtenido === valorEsperado
                };

                estadoMotor.estado =
                    protegido
                        ? 'CARRERA_PROTEGIDA_FINALIZADA'
                        : 'CARRERA_FINALIZADA';

                console.log('');
                console.log('==========================================');

                if (protegido) {
                    console.log(' PRUEBA CON SINCRONIZACIÓN');
                } else {
                    console.log(' CONDICIÓN DE CARRERA');
                }

                console.log('==========================================');
                console.log(`Esperado: ${valorEsperado}`);
                console.log(`Obtenido: ${obtenido}`);

                if (obtenido === valorEsperado) {

                    console.log('INTEGRIDAD CONSERVADA');

                } else {

                    console.log('CONDICIÓN DE CARRERA DETECTADA');

                    console.log(
                        `Actualizaciones perdidas: ${
                            valorEsperado - obtenido
                        }`
                    );
                }
            }
        });
    }

    res.json({
        mensaje: protegido
            ? 'Prueba protegida iniciada.'
            : 'Prueba sin protección iniciada.',
        protegido,
        trabajadores: numeroTrabajadores,
        operacionesPorTrabajador,
        esperado: valorEsperado
    });
}


// ==========================================
// API: CONDICIÓN DE CARRERA SIN PROTECCIÓN
// ==========================================

app.post('/api/carrera', (req, res) => {

    ejecutarPruebaCarrera(
        false,
        res
    );
});


// ==========================================
// API: CONDICIÓN DE CARRERA PROTEGIDA
// ==========================================

app.post('/api/carrera-protegida', (req, res) => {

    ejecutarPruebaCarrera(
        true,
        res
    );
});

// ==========================================
// REINICIAR
// ==========================================

app.post('/api/reiniciar', (req, res) => {

    estadoMotor.estado = 'NORMAL';

    estadoMotor.cuentas.A = 1000;
    estadoMotor.cuentas.B = 1000;

    estadoMotor.hilos = [];

    estadoMotor.rag = {
        nodos: [],
        aristas: []
    };

    estadoMotor.deadlock = false;
    estadoMotor.eventos = [];

estadoMotor.pruebaCarrera = null;
    res.json({
        mensaje: 'Estado reiniciado correctamente.',
        estado: estadoMotor
    });
});

// ==========================================
// SERVIDOR
// ==========================================

app.listen(PORT, '0.0.0.0', () => {

    console.log('==========================================');
    console.log(' BACKEND DEL MOTOR CONCURRENTE');
    console.log('==========================================');
    console.log(`PID: ${process.pid}`);
    console.log(`Puerto: ${PORT}`);
    console.log('');
    console.log('Servidor listo.');
});
