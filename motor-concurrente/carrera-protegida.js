const { Worker, isMainThread, workerData, parentPort } =
    require('worker_threads');

const OPERACIONES_POR_HILO = 100000;

if (isMainThread) {

    const memoria = new SharedArrayBuffer(
        Int32Array.BYTES_PER_ELEMENT
    );

    const saldo = new Int32Array(memoria);
    saldo[0] = 0;

    console.log('==========================================');
    console.log(' PRUEBA CON SINCRONIZACIÓN');
    console.log('==========================================');
    console.log(`PID: ${process.pid}`);
    console.log('');
    console.log('Protección: Atomics');
    console.log('Trabajadores: 2');
    console.log(`Operaciones por trabajador: ${OPERACIONES_POR_HILO}`);
    console.log('');
    console.log('Valor esperado: 200000');
    console.log('Ejecutando CON protección...');
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
            console.log(`${mensaje.nombre} terminó.`);
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

                if (saldo[0] === 200000) {
                    console.log('');
                    console.log('INTEGRIDAD CONSERVADA');
                    console.log(
                        'No se perdió ninguna actualización.'
                    );
                } else {
                    console.log('');
                    console.log('ERROR DE INTEGRIDAD');
                }
            }
        });
    }

} else {

    const saldo = new Int32Array(workerData.memoria);

    for (let i = 0; i < workerData.operaciones; i++) {

        // Incremento atómico.
        // Los trabajadores no pueden perder actualizaciones.
        Atomics.add(saldo, 0, 1);
    }

    parentPort.postMessage({
        nombre: workerData.nombre
    });
}
