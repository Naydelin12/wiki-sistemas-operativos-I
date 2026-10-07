import React, { useCallback, useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

const API_URL = 'http://localhost:3001';

const initialEvents = [
  {
    time: '22:14:08',
    type: 'SYSTEM',
    message: 'Motor inicializado correctamente',
  },
  {
    time: '22:14:08',
    type: 'SYSTEM',
    message: 'Esperando una operación concurrente',
  },
];

const defaultThreads = [
  {
    id: 'T1',
    name: 'Transferencia 01',
    detail: 'A → B · Q 100',
    status: 'READY',
  },
  {
    id: 'T2',
    name: 'Transferencia 02',
    detail: 'B → A · Q 50',
    status: 'READY',
  },
];

const defaultRagNodes = ['T1', 'A', 'B', 'T2'];

const ragPositions = {
  T1: { x: 120, percent: 13.5 },
  A: { x: 350, percent: 39 },
  B: { x: 550, percent: 61 },
  T2: { x: 780, percent: 86.5 },
};

function formatMoney(value) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return 'Q 0.00';
  }

  return `Q ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatTime(value) {
  if (!value) {
    return '--:--:--';
  }

  const text = String(value);

  if (/^\d{2}:\d{2}:\d{2}$/.test(text)) {
    return text;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return text;
  }

  return date.toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function normalizeEvent(event) {
  if (typeof event === 'string') {
    return {
      time: formatTime(new Date()),
      type: 'SYSTEM',
      message: event,
    };
  }

  return {
    time: formatTime(
      event?.time ??
        event?.hora ??
        event?.timestamp ??
        event?.fecha
    ),
    type: String(
      event?.type ??
        event?.tipo ??
        event?.event ??
        'SYSTEM'
    ).toUpperCase(),
    message:
      event?.message ??
      event?.mensaje ??
      event?.descripcion ??
      'Evento registrado por el motor',
  };
}

function normalizeThread(thread, index) {
  if (typeof thread === 'string') {
    return {
      id: thread,
      name: `Hilo ${thread}`,
      detail: 'Ejecución concurrente',
      status: 'ACTIVE',
    };
  }

  const id =
    thread?.id ??
    thread?.pid ??
    thread?.hilo ??
    thread?.worker ??
    `T${index + 1}`;

  const name =
    thread?.name ??
    thread?.nombre ??
    thread?.operacion ??
    `Hilo ${index + 1}`;

  let detail =
    thread?.detail ??
    thread?.detalle ??
    thread?.mensaje ??
    '';

  if (!detail && thread?.origen && thread?.destino) {
    detail = `${thread.origen} → ${thread.destino}`;
  }

  if (
    !detail &&
    thread?.from &&
    thread?.to
  ) {
    detail = `${thread.from} → ${thread.to}`;
  }

  if (
    !detail &&
    thread?.monto !== undefined
  ) {
    detail = `Q ${thread.monto}`;
  }

  if (!detail) {
    detail = 'Ejecución concurrente';
  }

  const status =
    thread?.status ??
    thread?.estado ??
    thread?.state ??
    'ACTIVE';

  return {
    id: String(id),
    name: String(name),
    detail: String(detail),
    status: String(status).toUpperCase(),
  };
}

function normalizeEdge(edge) {
  if (Array.isArray(edge)) {
    if (edge.length >= 2) {
      return {
        from: String(edge[0]),
        to: String(edge[1]),
      };
    }

    return null;
  }

  if (!edge || typeof edge !== 'object') {
    return null;
  }

  const from =
    edge.from ??
    edge.desde ??
    edge.origen ??
    edge.source ??
    edge.de ??
    edge.proceso;

  const to =
    edge.to ??
    edge.hacia ??
    edge.destino ??
    edge.target ??
    edge.a ??
    edge.recurso;

  if (from === undefined || to === undefined) {
    return null;
  }

  return {
    from: String(from),
    to: String(to),
  };
}

function getRagPosition(node, index, total) {
  if (ragPositions[node]) {
    return ragPositions[node];
  }

  const percent =
    total > 1
      ? 10 + (index / (total - 1)) * 80
      : 50;

  return {
    x: (percent / 100) * 900,
    percent,
  };
}

export default function MotorTransacciones() {
  const [status, setStatus] = useState('NORMAL');

  const [accounts, setAccounts] = useState({
    A: 1000,
    B: 1000,
  });

  const [events, setEvents] = useState(initialEvents);

  const [threads, setThreads] = useState(defaultThreads);

  const [ragNodes, setRagNodes] = useState(defaultRagNodes);

  const [ragEdges, setRagEdges] = useState([]);

  const [deadlock, setDeadlock] = useState(false);

  const [pruebaCarrera, setPruebaCarrera] = useState(null);

  const [busy, setBusy] = useState(false);

  const obtenerEstado = useCallback(async () => {
    try {
      const respuesta = await fetch(
        `${API_URL}/api/estado`,
        {
          cache: 'no-store',
        }
      );

      if (!respuesta.ok) {
        throw new Error(
          'No se pudo obtener el estado del motor'
        );
      }

      const datos = await respuesta.json();

      setStatus(
        typeof datos.estado === 'string'
          ? datos.estado
          : 'NORMAL'
      );

      if (datos.cuentas) {
        setAccounts({
          A: Number(datos.cuentas.A ?? 1000),
          B: Number(datos.cuentas.B ?? 1000),
        });
      }

      if (
        Array.isArray(datos.eventos) &&
        datos.eventos.length > 0
      ) {
        setEvents(
          datos.eventos.map(normalizeEvent)
        );
      }

      if (
        Array.isArray(datos.hilos) &&
        datos.hilos.length > 0
      ) {
        setThreads(
          datos.hilos.map(normalizeThread)
        );
      } else {
        setThreads(defaultThreads);
      }

      const backendRag = datos.rag ?? {};

      if (
        Array.isArray(backendRag.nodos) &&
        backendRag.nodos.length > 0
      ) {
        setRagNodes(
          backendRag.nodos.map(String)
        );
      } else {
        setRagNodes(defaultRagNodes);
      }

      if (
        Array.isArray(backendRag.aristas)
      ) {
        setRagEdges(
          backendRag.aristas
            .map(normalizeEdge)
            .filter(Boolean)
        );
      } else {
        setRagEdges([]);
      }

      setDeadlock(Boolean(datos.deadlock));

      setPruebaCarrera(
        datos.pruebaCarrera ?? null
      );

      return datos;
    } catch (error) {
      console.error(
        'Error al conectar con el backend:',
        error
      );

      return null;
    }
  }, []);

  useEffect(() => {
    obtenerEstado();

    const intervalo = setInterval(() => {
      obtenerEstado();
    }, 800);

    return () => {
      clearInterval(intervalo);
    };
  }, [obtenerEstado]);

  const agregarEventoLocal = (type, message) => {
    const now = new Date();

    const time = now.toLocaleTimeString('es-GT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setEvents((previous) => [
      ...previous,
      {
        time,
        type,
        message,
      },
    ]);
  };

  const ejecutarOperacion = async (
    endpoint,
    estadosFinales
  ) => {
    if (busy) {
      return;
    }

    setBusy(true);

    try {
      const respuesta = await fetch(
        `${API_URL}${endpoint}`,
        {
          method: 'POST',
        }
      );

      if (!respuesta.ok) {
        let mensaje =
          'El backend rechazó la operación.';

        try {
          const datosError =
            await respuesta.json();

          mensaje =
            datosError?.mensaje ??
            datosError?.message ??
            datosError?.error ??
            mensaje;
        } catch {
          // No hay cuerpo JSON en la respuesta.
        }

        throw new Error(mensaje);
      }

      const inicio = Date.now();
      const tiempoMaximo = 15000;

      while (
        Date.now() - inicio <
        tiempoMaximo
      ) {
        const datos =
          await obtenerEstado();

        if (
          datos &&
          estadosFinales.includes(
            datos.estado
          )
        ) {
          break;
        }

        await new Promise((resolve) => {
          setTimeout(resolve, 250);
        });
      }
    } catch (error) {
      console.error(
        'Error ejecutando operación:',
        error
      );

      agregarEventoLocal(
        'ERROR',
        error.message
      );
    } finally {
      setBusy(false);

      await obtenerEstado();
    }
  };

  const ejecutarResolver = async () => {
    if (!deadlock) {
      agregarEventoLocal(
        'SYSTEM',
        'No existe un deadlock activo para resolver'
      );

      return;
    }

    await ejecutarOperacion(
      '/api/resolver',
      ['RESUELTO']
    );
  };

  const reiniciarMotor = async () => {
    await ejecutarOperacion(
      '/api/reiniciar',
      ['NORMAL']
    );
  };

  const getStatusClass = () => {
    if (status === 'DEADLOCK_DETECTADO') {
      return styles.statusDanger;
    }

    if (
      status === 'EJECUTANDO' ||
      status === 'PROVOCANDO_DEADLOCK'
    ) {
      return styles.statusWarning;
    }

    if (
      status === 'RECUPERANDO' ||
      status === 'RESUELTO'
    ) {
      return styles.statusRecovery;
    }

    return styles.statusNormal;
  };

  const normalizedStatus =
    typeof status === 'string'
      ? status
      : 'NORMAL';

  const statusText =
    normalizedStatus.replaceAll('_', ' ');

  const resultado =
    pruebaCarrera ?? {};

  const operacionesEsperadas =
    resultado.esperado ?? 200000;

  const operacionesObtenidas =
    resultado.obtenido ?? '—';

  const actualizacionesPerdidas =
    resultado.perdidas ?? '—';

  let integridadTexto =
    'ESPERANDO PRUEBA';

  if (resultado.integridad === true) {
    integridadTexto = 'INTEGRIDAD CORRECTA';
  }

  if (resultado.integridad === false) {
    integridadTexto = 'INTEGRIDAD FALLIDA';
  }

  const workerCount =
    resultado.trabajadores ??
    (threads.length > 0
      ? threads.length
      : 2);

  const resourceCount =
    ragNodes.filter(
      (node) =>
        node === 'A' ||
        node === 'B'
    ).length || 2;

  return (
    <Layout
      title="Motor de Transacciones Concurrentes"
      description="Laboratorio de concurrencia y transacciones"
    >
      <main className={styles.page}>
        <div className={styles.shell}>

          {/* HEADER */}
          <header className={styles.header}>
            <div>
              <div className={styles.eyebrow}>
                SISTEMAS OPERATIVOS · LABORATORIO DE CONCURRENCIA
              </div>

              <h1>
                Motor de Transacciones Concurrentes
              </h1>

              <p>
                Entorno de observación y ejecución
                de procesos concurrentes,
                sincronización e interbloqueos.
              </p>
            </div>

            <div
              className={`${styles.statusBox} ${getStatusClass()}`}
            >
              <span
                className={styles.statusDot}
              ></span>

              <div>
                <span
                  className={styles.statusLabel}
                >
                  ESTADO DEL MOTOR
                </span>

                <strong>
                  {statusText}
                </strong>
              </div>
            </div>
          </header>

          {/* ACCOUNT STRIP */}
          <section
            className={styles.accountGrid}
          >

            <article
              className={styles.accountCard}
            >
              <div
                className={styles.cardTop}
              >
                <span
                  className={styles.accountTag}
                >
                  CUENTA
                </span>

                <span
                  className={styles.accountState}
                >
                  ACTIVA
                </span>
              </div>

              <div
                className={styles.accountMain}
              >
                <span
                  className={
                    styles.accountLetter
                  }
                >
                  A
                </span>

                <div>
                  <span
                    className={
                      styles.smallLabel
                    }
                  >
                    SALDO ACTUAL
                  </span>

                  <strong>
                    {formatMoney(
                      accounts.A
                    )}
                  </strong>
                </div>
              </div>
            </article>

            <div
              className={
                styles.transferIndicator
              }
            >
              <span></span>
              <div>CONCURRENCIA</div>
              <span></span>
            </div>

            <article
              className={styles.accountCard}
            >
              <div
                className={styles.cardTop}
              >
                <span
                  className={styles.accountTag}
                >
                  CUENTA
                </span>

                <span
                  className={styles.accountState}
                >
                  ACTIVA
                </span>
              </div>

              <div
                className={styles.accountMain}
              >
                <span
                  className={
                    styles.accountLetter
                  }
                >
                  B
                </span>

                <div>
                  <span
                    className={
                      styles.smallLabel
                    }
                  >
                    SALDO ACTUAL
                  </span>

                  <strong>
                    {formatMoney(
                      accounts.B
                    )}
                  </strong>
                </div>
              </div>
            </article>

          </section>

          {/* MAIN GRID */}
          <section className={styles.mainGrid}>

            {/* OPERATIONS */}
            <article className={styles.panel}>
              <div
                className={
                  styles.panelHeader
                }
              >
                <div>
                  <span
                    className={
                      styles.panelIndex
                    }
                  >
                    01
                  </span>

                  <h2>
                    Pruebas del motor
                  </h2>
                </div>

                <span
                  className={styles.panelMeta}
                >
                  CONTROL
                </span>
              </div>

              <div
                className={styles.operations}
              >

                <button
                  className={
                    styles.operationButton
                  }
                  onClick={() =>
                    ejecutarOperacion(
                      '/api/transferencias',
                      ['NORMAL']
                    )
                  }
                  disabled={busy}
                >
                  <span
                    className={
                      styles.buttonNumber
                    }
                  >
                    01
                  </span>

                  <div>
                    <strong>
                      Transferencias concurrentes
                    </strong>

                    <small>
                      Ejecutar T1 y T2 simultáneamente
                    </small>
                  </div>

                  <span
                    className={styles.arrow}
                  >
                    →
                  </span>
                </button>

                <button
                  className={
                    styles.operationButton
                  }
                  onClick={() =>
                    ejecutarOperacion(
                      '/api/carrera',
                      ['CARRERA_FINALIZADA']
                    )
                  }
                  disabled={busy}
                >
                  <span
                    className={
                      styles.buttonNumber
                    }
                  >
                    02
                  </span>

                  <div>
                    <strong>
                      Condición de carrera
                    </strong>

                    <small>
                      Observar actualización sin sincronización
                    </small>
                  </div>

                  <span
                    className={styles.arrow}
                  >
                    →
                  </span>
                </button>

                <button
                  className={
                    styles.operationButton
                  }
                  onClick={() =>
                    ejecutarOperacion(
                      '/api/carrera-protegida',
                      [
                        'CARRERA_PROTEGIDA_FINALIZADA',
                      ]
                    )
                  }
                  disabled={busy}
                >
                  <span
                    className={
                      styles.buttonNumber
                    }
                  >
                    03
                  </span>

                  <div>
                    <strong>
                      Carrera protegida
                    </strong>

                    <small>
                      Ejecutar operación con sincronización
                    </small>
                  </div>

                  <span
                    className={styles.arrow}
                  >
                    →
                  </span>
                </button>

                <button
                  className={`${styles.operationButton} ${styles.deadlockButton}`}
                  onClick={() =>
                    ejecutarOperacion(
                      '/api/deadlock',
                      ['DEADLOCK_DETECTADO']
                    )
                  }
                  disabled={busy}
                >
                  <span
                    className={
                      styles.buttonNumber
                    }
                  >
                    04
                  </span>

                  <div>
                    <strong>
                      Provocar deadlock
                    </strong>

                    <small>
                      Crear espera circular entre T1 y T2
                    </small>
                  </div>

                  <span
                    className={styles.arrow}
                  >
                    →
                  </span>
                </button>

                <button
                  className={`${styles.operationButton} ${styles.recoveryButton}`}
                  onClick={ejecutarResolver}
                  disabled={busy}
                >
                  <span
                    className={
                      styles.buttonNumber
                    }
                  >
                    05
                  </span>

                  <div>
                    <strong>
                      Resolver deadlock
                    </strong>

                    <small>
                      Aplicar mecanismo de recuperación
                    </small>
                  </div>

                  <span
                    className={styles.arrow}
                  >
                    →
                  </span>
                </button>

              </div>

              <button
                className={styles.resetButton}
                onClick={reiniciarMotor}
                disabled={busy}
              >
                Reiniciar estado del motor
              </button>
            </article>

            {/* THREADS */}
            <article className={styles.panel}>
              <div
                className={
                  styles.panelHeader
                }
              >
                <div>
                  <span
                    className={
                      styles.panelIndex
                    }
                  >
                    02
                  </span>

                  <h2>
                    Hilos activos
                  </h2>
                </div>

                <span
                  className={
                    styles.liveIndicator
                  }
                >
                  ● LIVE
                </span>
              </div>

              <div
                className={styles.threadList}
              >
                {threads.map(
                  (thread, index) => (
                    <div
                      className={
                        styles.thread
                      }
                      key={`${thread.id}-${index}`}
                    >
                      <div
                        className={
                          styles.threadIdentity
                        }
                      >
                        <span
                          className={
                            styles.threadIcon
                          }
                        >
                          {thread.id}
                        </span>

                        <div>
                          <strong>
                            {thread.name}
                          </strong>

                          <small>
                            {thread.detail}
                          </small>
                        </div>
                      </div>

                      <span
                        className={
                          styles.threadStatus
                        }
                      >
                        {thread.status}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div
                className={styles.threadInfo}
              >
                <div>
                  <span>
                    WORKERS
                  </span>

                  <strong>
                    {workerCount}
                  </strong>
                </div>

                <div>
                  <span>
                    RECURSOS
                  </span>

                  <strong>
                    {String(
                      resourceCount
                    ).padStart(2, '0')}
                  </strong>
                </div>

                <div>
                  <span>
                    LOCKS
                  </span>

                  <strong>
                    02
                  </strong>
                </div>
              </div>
            </article>

          </section>

          {/* RAG */}
          <section className={styles.panel}>
            <div
              className={
                styles.panelHeader
              }
            >
              <div>
                <span
                  className={
                    styles.panelIndex
                  }
                >
                  03
                </span>

                <h2>
                  Grafo de Asignación de Recursos
                </h2>

                <p>
                  Representación de procesos,
                  recursos y relaciones de espera.
                </p>
              </div>

              <span
                className={styles.panelMeta}
              >
                RAG · LIVE
              </span>
            </div>

            <div
              className={styles.ragContainer}
            >
              <svg
                className={
                  styles.ragLines
                }
                viewBox="0 0 900 300"
                preserveAspectRatio="none"
              >
                <defs>
                  <marker
                    id="ragArrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M 0 0 L 10 5 L 0 10 z"
                      fill="#4c7e79"
                    />
                  </marker>

                  <marker
                    id="ragArrowDanger"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M 0 0 L 10 5 L 0 10 z"
                      fill="#bd625f"
                    />
                  </marker>
                </defs>

                {ragEdges.map(
                  (edge, index) => {
                    const fromPosition =
                      getRagPosition(
                        edge.from,
                        ragNodes.indexOf(
                          edge.from
                        ),
                        ragNodes.length
                      );

                    const toPosition =
                      getRagPosition(
                        edge.to,
                        ragNodes.indexOf(
                          edge.to
                        ),
                        ragNodes.length
                      );

                    const isDanger =
                      deadlock ||
                      status ===
                        'DEADLOCK_DETECTADO';

                    return (
                      <line
                        key={`${edge.from}-${edge.to}-${index}`}
                        x1={fromPosition.x}
                        y1="150"
                        x2={toPosition.x}
                        y2="150"
                        className={
                          isDanger
                            ? styles.ragLineDanger
                            : styles.ragLine
                        }
                        markerEnd={
                          isDanger
                            ? 'url(#ragArrowDanger)'
                            : 'url(#ragArrow)'
                        }
                      />
                    );
                  }
                )}
              </svg>

              {ragNodes.map(
                (node, index) => {
                  const position =
                    getRagPosition(
                      node,
                      index,
                      ragNodes.length
                    );

                  const isProcess =
                    String(node)
                      .toUpperCase()
                      .startsWith('T');

                  const isDanger =
                    isProcess &&
                    (deadlock ||
                      status ===
                        'DEADLOCK_DETECTADO');

                  return (
                    <div
                      key={`${node}-${index}`}
                      className={`${styles.ragNode} ${
                        isProcess
                          ? styles.processNode
                          : styles.resourceNode
                      } ${
                        isDanger
                          ? styles.nodeDanger
                          : ''
                      }`}
                      style={{
                        left: `${position.percent}%`,
                        right: 'auto',
                      }}
                    >
                      <span>
                        {node}
                      </span>

                      <small>
                        {isProcess
                          ? 'PROCESO'
                          : 'RECURSO'}
                      </small>
                    </div>
                  );
                }
              )}
            </div>

            <div
              className={styles.ragLegend}
            >
              <span>
                <i
                  className={
                    styles.legendProcess
                  }
                ></i>

                Proceso
              </span>

              <span>
                <i
                  className={
                    styles.legendResource
                  }
                ></i>

                Recurso
              </span>

              <span>
                <i
                  className={
                    styles.legendWait
                  }
                ></i>

                Relación de espera
              </span>
            </div>
          </section>

          {/* BOTTOM GRID */}
          <section
            className={styles.bottomGrid}
          >

            {/* EVENTS */}
            <article className={styles.panel}>
              <div
                className={
                  styles.panelHeader
                }
              >
                <div>
                  <span
                    className={
                      styles.panelIndex
                    }
                  >
                    04
                  </span>

                  <h2>
                    Monitor de eventos
                  </h2>
                </div>

                <span
                  className={styles.panelMeta}
                >
                  {events.length} EVENTOS
                </span>
              </div>

              <div
                className={
                  styles.eventConsole
                }
              >
                {events.map(
                  (event, index) => (
                    <div
                      className={
                        styles.eventLine
                      }
                      key={`${event.time}-${index}`}
                    >
                      <span
                        className={
                          styles.eventTime
                        }
                      >
                        {event.time}
                      </span>

                      <span
                        className={
                          styles.eventType
                        }
                      >
                        [{event.type}]
                      </span>

                      <span
                        className={
                          styles.eventMessage
                        }
                      >
                        {event.message}
                      </span>
                    </div>
                  )
                )}
              </div>
            </article>

            {/* RESULTS */}
            <article className={styles.panel}>
              <div
                className={
                  styles.panelHeader
                }
              >
                <div>
                  <span
                    className={
                      styles.panelIndex
                    }
                  >
                    05
                  </span>

                  <h2>
                    Integridad de ejecución
                  </h2>
                </div>

                <span
                  className={styles.panelMeta}
                >
                  RESULTADOS
                </span>
              </div>

              <div
                className={styles.results}
              >

                <div
                  className={
                    styles.resultRow
                  }
                >
                  <span>
                    OPERACIONES ESPERADAS
                  </span>

                  <strong>
                    {Number(
                      operacionesEsperadas
                    ).toLocaleString(
                      'en-US'
                    )}
                  </strong>
                </div>

                <div
                  className={
                    styles.resultRow
                  }
                >
                  <span>
                    OPERACIONES OBTENIDAS
                  </span>

                  <strong>
                    {typeof operacionesObtenidas ===
                    'number'
                      ? operacionesObtenidas.toLocaleString(
                          'en-US'
                        )
                      : operacionesObtenidas}
                  </strong>
                </div>

                <div
                  className={
                    styles.resultRow
                  }
                >
                  <span>
                    ACTUALIZACIONES PERDIDAS
                  </span>

                  <strong>
                    {typeof actualizacionesPerdidas ===
                    'number'
                      ? actualizacionesPerdidas.toLocaleString(
                          'en-US'
                        )
                      : actualizacionesPerdidas}
                  </strong>
                </div>

                <div
                  className={
                    styles.integrityBox
                  }
                >
                  <span>
                    INTEGRIDAD
                  </span>

                  <strong>
                    {integridadTexto}
                  </strong>
                </div>

              </div>
            </article>

          </section>

          <footer
            className={styles.footer}
          >
            <span>
              MOTOR DE TRANSACCIONES CONCURRENTES
            </span>

            <span>
              SO1 · CONCURRENCIA · SINCRONIZACIÓN · RAG
            </span>
          </footer>

        </div>
      </main>
    </Layout>
  );
}