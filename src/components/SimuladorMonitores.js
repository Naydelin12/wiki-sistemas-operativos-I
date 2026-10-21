import React, { useState } from 'react';

const CAPACIDAD = 3;

const PROCESOS = [
  { id: 'P1', tipo: 'productor' },
  { id: 'P2', tipo: 'productor' },
  { id: 'C1', tipo: 'consumidor' },
  { id: 'C2', tipo: 'consumidor' }
];

const crearEstado = () => ({
  buffer: [],
  propietario: null,
  procesos: Object.fromEntries(
    PROCESOS.map(p => [p.id, 'LISTO'])
  ),
  colaEntrada: [],
  colaNoLleno: [],
  colaNoVacio: [],
  eventos: ['Monitor iniciado. El búfer está vacío.'],
  siguienteProducto: 1
});

const colores = {
  LISTO: '#2563eb',
  EN_MONITOR: '#15803d',
  ESPERANDO: '#d97706',
  NOTIFICADO: '#7c3aed',
  EN_COLA: '#64748b'
};

export default function SimuladorMonitores() {
  const [sistema, setSistema] = useState(crearEstado);

  const agregarEvento = (estado, mensaje) => {
    estado.eventos.push(mensaje);
  };

  const solicitar = (id) => {
    setSistema(anterior => {
      if (anterior.procesos[id] !== 'LISTO') {
        return anterior;
      }

      const nuevo = {
        ...anterior,
        procesos: { ...anterior.procesos },
        colaEntrada: [...anterior.colaEntrada],
        colaNoLleno: [...anterior.colaNoLleno],
        colaNoVacio: [...anterior.colaNoVacio],
        eventos: [...anterior.eventos]
      };

      if (nuevo.propietario === null) {
        nuevo.propietario = id;
        nuevo.procesos[id] = 'EN_MONITOR';

        agregarEvento(
          nuevo,
          `${id} ingresa al monitor.`
        );
      } else {
        nuevo.procesos[id] = 'EN_COLA';
        nuevo.colaEntrada.push(id);

        agregarEvento(
          nuevo,
          `${id} solicita acceso y espera en la cola de entrada.`
        );
      }

      return nuevo;
    });
  };

  const asignarSiguiente = (estado) => {
    estado.propietario = null;

    if (estado.colaEntrada.length > 0) {
      const siguiente = estado.colaEntrada.shift();

      estado.propietario = siguiente;
      estado.procesos[siguiente] = 'EN_MONITOR';

      agregarEvento(
        estado,
        `${siguiente} obtiene acceso al monitor.`
      );
    }
  };

  const notificar = (estado, cola, nombreCondicion) => {
    if (estado[cola].length > 0) {
      const id = estado[cola].shift();

      estado.procesos[id] = 'NOTIFICADO';
      estado.colaEntrada.push(id);

      agregarEvento(
        estado,
        `signal(${nombreCondicion}): ${id} es notificado y pasa a la cola de entrada.`
      );
    }
  };

  const ejecutar = (id) => {
    setSistema(anterior => {
      if (
        anterior.propietario !== id ||
        anterior.procesos[id] !== 'EN_MONITOR'
      ) {
        return anterior;
      }

      const nuevo = {
        ...anterior,
        buffer: [...anterior.buffer],
        procesos: { ...anterior.procesos },
        colaEntrada: [...anterior.colaEntrada],
        colaNoLleno: [...anterior.colaNoLleno],
        colaNoVacio: [...anterior.colaNoVacio],
        eventos: [...anterior.eventos]
      };

      const proceso = PROCESOS.find(p => p.id === id);

      if (proceso.tipo === 'productor') {
        if (nuevo.buffer.length === CAPACIDAD) {
          nuevo.procesos[id] = 'ESPERANDO';
          nuevo.colaNoLleno.push(id);

          agregarEvento(
            nuevo,
            `${id} ejecuta wait(noLleno): búfer lleno. Libera el monitor.`
          );

          asignarSiguiente(nuevo);
        } else {
          const producto = nuevo.siguienteProducto;

          nuevo.buffer.push(producto);
          nuevo.siguienteProducto++;

          agregarEvento(
            nuevo,
            `${id} produce el producto ${producto}.`
          );

          notificar(nuevo, 'colaNoVacio', 'noVacio');

          nuevo.procesos[id] = 'LISTO';
          asignarSiguiente(nuevo);
        }
      } else {
        if (nuevo.buffer.length === 0) {
          nuevo.procesos[id] = 'ESPERANDO';
          nuevo.colaNoVacio.push(id);

          agregarEvento(
            nuevo,
            `${id} ejecuta wait(noVacio): búfer vacío. Libera el monitor.`
          );

          asignarSiguiente(nuevo);
        } else {
          const producto = nuevo.buffer.shift();

          agregarEvento(
            nuevo,
            `${id} consume el producto ${producto}.`
          );

          notificar(nuevo, 'colaNoLleno', 'noLleno');

          nuevo.procesos[id] = 'LISTO';
          asignarSiguiente(nuevo);
        }
      }

      return nuevo;
    });
  };

  const reiniciar = () => setSistema(crearEstado());

  const estiloPanel = {
    border: '1px solid var(--ifm-color-emphasis-300)',
    borderRadius: 12,
    padding: 16,
    background: 'var(--ifm-background-surface-color)'
  };

  return (
    <div style={{
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: 14,
      padding: 20,
      margin: '24px 0'
    }}>
      <h2>Simulador de Monitores y Variables de Condición</h2>

      <p>
        Explora el problema productor-consumidor mediante
        un monitor con semántica de Mesa.
      </p>

      <h3>Búfer compartido</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 20
      }}>
        {Array.from({ length: CAPACIDAD }, (_, i) => (
          <div key={i} style={{
            ...estiloPanel,
            textAlign: 'center',
            background: sistema.buffer[i] !== undefined
              ? 'rgba(21,128,61,0.15)'
              : 'var(--ifm-color-emphasis-100)'
          }}>
            <strong>Espacio {i + 1}</strong>

            <div style={{ marginTop: 10 }}>
              {sistema.buffer[i] !== undefined
                ? `Producto ${sistema.buffer[i]}`
                : 'Vacío'}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        ...estiloPanel,
        marginBottom: 20,
        textAlign: 'center'
      }}>
        <strong>Estado del monitor</strong>

        <h3 style={{ marginTop: 10 }}>
          {sistema.propietario === null
            ? 'LIBRE'
            : `OCUPADO POR ${sistema.propietario}`}
        </h3>

        <p>
          Productos: {sistema.buffer.length} / {CAPACIDAD}
        </p>
      </div>

      <h3>Procesos del sistema</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(190px, 1fr))',
        gap: 12,
        marginBottom: 20
      }}>
        {PROCESOS.map(proceso => {
          const estado = sistema.procesos[proceso.id];

          return (
            <div key={proceso.id} style={estiloPanel}>
              <h4>
                {proceso.id} - {proceso.tipo === 'productor'
                  ? 'Productor'
                  : 'Consumidor'}
              </h4>

              <div style={{
                padding: 10,
                borderRadius: 8,
                textAlign: 'center',
                background: colores[estado],
                color: '#fff',
                fontWeight: 'bold',
                marginBottom: 12
              }}>
                {estado.replace('_', ' ')}
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8
              }}>
                <button
                  className="button button--primary button--sm"
                  disabled={estado !== 'LISTO'}
                  onClick={() => solicitar(proceso.id)}
                >
                  Solicitar acceso
                </button>

                <button
                  className="button button--secondary button--sm"
                  disabled={estado !== 'EN_MONITOR'}
                  onClick={() => ejecutar(proceso.id)}
                >
                  Ejecutar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <h3>Colas del monitor</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        marginBottom: 20
      }}>
        {[
          ['Cola de entrada', sistema.colaEntrada],
          ['Condición noLleno', sistema.colaNoLleno],
          ['Condición noVacio', sistema.colaNoVacio]
        ].map(([titulo, cola]) => (
          <div key={titulo} style={estiloPanel}>
            <h4>{titulo}</h4>
            <p>
              {cola.length
                ? cola.join(' → ')
                : 'Vacía'}
            </p>
          </div>
        ))}
      </div>

      <h3>Registro de eventos</h3>

      <div
        aria-live="polite"
        style={{
          maxHeight: 260,
          overflowY: 'auto',
          padding: 15,
          borderRadius: 8,
          background: 'var(--ifm-color-emphasis-100)',
          marginBottom: 20
        }}
      >
        {sistema.eventos.map((evento, i) => (
          <div key={i} style={{
            padding: '7px 0',
            borderBottom:
              '1px solid var(--ifm-color-emphasis-200)'
          }}>
            <strong>{i + 1}.</strong> {evento}
          </div>
        ))}
      </div>

      <button
        className="button button--danger"
        onClick={reiniciar}
      >
        Reiniciar simulación
      </button>
    </div>
  );
}
