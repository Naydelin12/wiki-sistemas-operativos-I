const { Worker, isMainThread, workerData, parentPort } =
    require('worker_threads');

const OPERACIONES_POR_HILO = 100000;

if (isMainThread) {

    // Un entero compartido entre todos los hilos.
    const memoria = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT
    );

    const saldo = new Int32Array(memoria);

    // Saldo inicial
    saldo[0] = 0;

    console.log('==========================================');
    console.log(' PRUEBA REAL DE CONDICIÓN DE CARRERA');
    console.log('==========================================');
    console.log(`PID: ${process.pid}`);
    console.log('');
    console.log(`Saldo inicial: ${saldo[0]}`);
    console.log(`Trabajadores: 2`);
    console.log(`Operaciones por trabajador: ${OPERACIONES_POR_HILO}`);
    console.log('');
    console.log('Valor esperado al finalizar: 200000');
    console.log('Ejecutando SIN protección Mutex...');
    console.log('');

    let terminados = 0;

    for (let i = 1; i <= 2; i++) {

        const worker = new Worker(__filename, {
            workerData: {
                memoria,
                nombre: `T${i}`,
                operaciones: OPERACIONES_POR_HILO
            }
        });

        worker.on('message', mensaje => {
            console.log(
                `${mensaje.nombre} terminó sus operaciones.`
            );
        });

        worker.on('exit', () => {

            terminados++;

            if (terminados === 2) {

                console.log('');
                console.log('==========================================');
                console.log(' RESULTADO');
                console.log('==========================================');

                console.log(`Valor esperado : 200000`);
                console.log(`Valor obtenido : ${saldo[0]}`);

                if (saldo[0] !== 200000) {
                    console.log('');
                    console.log('CONDICIÓN DE CARRERA DETECTADA');
                    console.log(
                        `Se perdieron ${200000 - saldo[0]} actualizaciones.`
                    );
                } else {
                    console.log('');
                    console.log(
                        'Esta ejecución coincidió con el valor esperado.'
                    );
                    console.log(
                        'Ejecuta nuevamente para intentar observar la carrera.'
                    );
                }
            }
        });
    }

} else {

    const saldo = new Int32Array(workerData.memoria);

    for (let i = 0; i < workerData.operaciones; i++) {

        // IMPORTANTE:
        // Esta operación NO es atómica.
        saldo[0] = saldo[0] + 1;
    }

    parentPort.postMessage({
        nombre: workerData.nombre
    });
}
