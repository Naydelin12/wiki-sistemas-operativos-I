import React, { useState } from 'react';

const TOTAL_PROCESOS = 4;

const crearEstado = (capacidad = 1) => ({
  capacidad,
  disponibles: capacidad,
  procesos: Array(TOTAL_PROCESOS).fill('LISTO'),
  cola: [],
  eventos: [
    `Simulación iniciada con ${capacidad} permiso(s).`
  ]
});

const colores = {
  LISTO: '#2563eb',
  EJECUTANDO: '#15803d',
  BLOQUEADO: '#d97706'
};

export default function SimuladorSemaforos() {
  const [tipo, setTipo] = useState('binario');
  const [cantidad, setCantidad] = useState(3);
  const [sistema, setSistema] = useState(() => crearEstado(1));

  const cambiarTipo = (nuevoTipo) => {
    setTipo(nuevoTipo);
    setSistema(crearEstado(
      nuevoTipo === 'binario' ? 1 : cantidad
    ));
  };

  const cambiarCantidad = (valor) => {
    const numero = Number(valor);
    setCantidad(numero);

    if (tipo === 'contador') {
      setSistema(crearEstado(numero));
    }
  };

  const wait = (i) => {
    setSistema((anterior) => {
      if (anterior.procesos[i] !== 'LISTO') {
        return anterior;
      }

      const nuevo = {
        ...anterior,
        procesos: [...anterior.procesos],
        cola: [...anterior.cola],
        eventos: [...anterior.eventos]
      };

      if (nuevo.disponibles > 0) {
        nuevo.disponibles--;
        nuevo.procesos[i] = 'EJECUTANDO';

        nuevo.eventos.push(
          `P${i + 1} ejecuta wait(): obtiene un permiso.`
        );
      } else {
        nuevo.procesos[i] = 'BLOQUEADO';
        nuevo.cola.push(i);

        nuevo.eventos.push(
          `P${i + 1} ejecuta wait(): no hay permisos y queda bloqueado.`
        );
      }

      return nuevo;
    });
  };

  const signal = (i) => {
    setSistema((anterior) => {
      if (anterior.procesos[i] !== 'EJECUTANDO') {
        return anterior;
      }

      const nuevo = {
        ...anterior,
        procesos: [...anterior.procesos],
        cola: [...anterior.cola],
        eventos: [...anterior.eventos]
      };

      nuevo.procesos[i] = 'LISTO';

      if (nuevo.cola.length > 0) {
        const siguiente = nuevo.cola.shift();

        nuevo.procesos[siguiente] = 'EJECUTANDO';

        nuevo.eventos.push(
          `P${i + 1} ejecuta signal(): transfiere su permiso a P${siguiente + 1}.`
        );
      } else {
        nuevo.disponibles++;

        nuevo.eventos.push(
          `P${i + 1} ejecuta signal(): devuelve un permiso.`
        );
      }

      return nuevo;
    });
  };

  const ocupados = sistema.procesos.filter(
    (estado) => estado === 'EJECUTANDO'
  ).length;

  const reiniciar = () => {
    setSistema(crearEstado(
      tipo === 'binario' ? 1 : cantidad
    ));
  };

  return (
    <div style={{
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: 14,
      padding: 20,
      margin: '24px 0'
    }}>
      <h2>Simulador Interactivo de Semáforos</h2>

      <p>
        Controla el acceso de cuatro procesos a recursos
        compartidos mediante las operaciones wait() y signal().
      </p>

      <h3>Configuración del semáforo</h3>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20
      }}>
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="tipo-semaforo">
            <strong>Tipo de semáforo</strong>
          </label>

          <select
            id="tipo-semaforo"
            value={tipo}
            onChange={(e) => cambiarTipo(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
              background: 'var(--ifm-background-color)',
              color: 'var(--ifm-font-color-base)',
              border: '1px solid var(--ifm-color-emphasis-400)'
            }}
          >
            <option value="binario">
              Semáforo binario
            </option>
            <option value="contador">
              Semáforo contador
            </option>
          </select>
        </div>

        {tipo === 'contador' && (
          <div style={{ flex: '1 1 200px' }}>
            <label htmlFor="cantidad-permisos">
              <strong>Cantidad de permisos</strong>
            </label>

            <select
              id="cantidad-permisos"
              value={cantidad}
              onChange={(e) => cambiarCantidad(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                marginTop: 8,
                borderRadius: 8,
                background: 'var(--ifm-background-color)',
                color: 'var(--ifm-font-color-base)',
                border: '1px solid var(--ifm-color-emphasis-400)'
              }}
            >
              {[1, 2, 3, 4].map((numero) => (
                <option key={numero} value={numero}>
                  {numero} permiso(s)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <h3>Estado del semáforo</h3>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20
      }}>
        {[
          ['Capacidad total', sistema.capacidad],
          ['Disponibles', sistema.disponibles],
          ['Ocupados', ocupados],
          ['En espera', sistema.cola.length]
        ].map(([titulo, valor]) => (
          <div key={titulo} style={{
            flex: '1 1 130px',
            padding: 15,
            borderRadius: 10,
            textAlign: 'center',
            background: 'var(--ifm-color-emphasis-100)'
          }}>
            <div style={{
              fontSize: 13,
              marginBottom: 8
            }}>
              {titulo}
            </div>

            <strong style={{ fontSize: 24 }}>
              {valor}
            </strong>
          </div>
        ))}
      </div>

      <h3>Procesos del sistema</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(190px, 1fr))',
        gap: 14,
        marginBottom: 20
      }}>
        {sistema.procesos.map((estado, i) => (
          <div key={i} style={{
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: 12,
            padding: 15,
            background: 'var(--ifm-background-surface-color)'
          }}>
            <h4>Proceso P{i + 1}</h4>

            <div style={{
              padding: 12,
              textAlign: 'center',
              borderRadius: 8,
              color: '#fff',
              fontWeight: 'bold',
              background: colores[estado],
              marginBottom: 15
            }}>
              {estado}
            </div>

            <div style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap'
            }}>
              <button
                className="button button--primary button--sm"
                disabled={estado !== 'LISTO'}
                onClick={() => wait(i)}
              >
                wait()
              </button>

              <button
                className="button button--secondary button--sm"
                disabled={estado !== 'EJECUTANDO'}
                onClick={() => signal(i)}
              >
                signal()
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3>Recursos compartidos</h3>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20
      }}>
        {Array.from(
          { length: sistema.capacidad },
          (_, indice) => {
            const propietarios = sistema.procesos
              .map((estado, i) =>
                estado === 'EJECUTANDO' ? i : null
              )
              .filter((i) => i !== null);

            const propietario = propietarios[indice];

            return (
              <div key={indice} style={{
                flex: '1 1 130px',
                padding: 16,
                borderRadius: 10,
                textAlign: 'center',
                border: '1px solid var(--ifm-color-emphasis-300)',
                background: propietario !== undefined
                  ? 'rgba(21,128,61,0.15)'
                  : 'var(--ifm-color-emphasis-100)'
              }}>
                <strong>Permiso {indice + 1}</strong>

                <div style={{ marginTop: 8 }}>
                  {propietario !== undefined
                    ? `P${propietario + 1} lo utiliza`
                    : 'Disponible'}
                </div>
              </div>
            );
          }
        )}
      </div>

      <h3>Cola de espera (FIFO)</h3>

      <div style={{
        padding: 16,
        borderRadius: 10,
        background: 'var(--ifm-color-emphasis-100)',
        marginBottom: 20
      }}>
        {sistema.cola.length === 0
          ? 'No hay procesos bloqueados.'
          : sistema.cola
              .map((i) => `P${i + 1}`)
              .join(' → ')}
      </div>

      <h3>Registro de eventos</h3>

      <div
        aria-live="polite"
        style={{
          maxHeight: 250,
          overflowY: 'auto',
          padding: 15,
          borderRadius: 8,
          background: 'var(--ifm-color-emphasis-100)',
          marginBottom: 20
        }}
      >
        {sistema.eventos.map((evento, index) => (
          <div key={index} style={{
            padding: '7px 0',
            borderBottom:
              '1px solid var(--ifm-color-emphasis-200)'
          }}>
            <strong>{index + 1}.</strong> {evento}
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
