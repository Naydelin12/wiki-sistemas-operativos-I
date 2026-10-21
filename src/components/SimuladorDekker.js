import React, { useState } from 'react';

const algoritmos = [
  {
    nombre: 'Intento 1: Alternancia estricta',
    descripcion: 'Los procesos utilizan una variable de turno para decidir quién puede ingresar.',
    problema: 'Violación del progreso',
    explicacion: 'P1 puede quedar esperando aunque P0 no quiera utilizar la sección crítica.',
    pasos: [
      { p0: 'LISTO', p1: 'LISTO', turno: 0, interes: [false, false], mensaje: 'El turno inicial pertenece a P0.' },
      { p0: 'SECCIÓN CRÍTICA', p1: 'LISTO', turno: 0, interes: [false, false], mensaje: 'P0 ingresa porque tiene el turno.' },
      { p0: 'RESTANTE', p1: 'LISTO', turno: 1, interes: [false, false], mensaje: 'P0 termina y entrega el turno a P1.' },
      { p0: 'RESTANTE', p1: 'SECCIÓN CRÍTICA', turno: 1, interes: [false, false], mensaje: 'P1 ingresa a la sección crítica.' },
      { p0: 'RESTANTE', p1: 'RESTANTE', turno: 0, interes: [false, false], mensaje: 'P1 termina y devuelve el turno a P0.' },
      { p0: 'RESTANTE', p1: 'ESPERANDO', turno: 0, interes: [false, false], mensaje: 'P1 quiere ingresar otra vez, pero P0 no desea participar. Se viola el progreso.' }
    ]
  },
  {
    nombre: 'Intento 2: Indicadores de ocupación',
    descripcion: 'Cada proceso comprueba el indicador del otro antes de activar el suyo.',
    problema: 'Condición de carrera',
    explicacion: 'Ambos procesos pueden comprobar los indicadores antes de que alguno los modifique.',
    pasos: [
      { p0: 'LISTO', p1: 'LISTO', turno: null, interes: [false, false], mensaje: 'Ambos indicadores están desactivados.' },
      { p0: 'COMPROBANDO', p1: 'LISTO', turno: null, interes: [false, false], mensaje: 'P0 comprueba que P1 no está interesado.' },
      { p0: 'COMPROBANDO', p1: 'COMPROBANDO', turno: null, interes: [false, false], mensaje: 'P1 también comprueba que P0 no está interesado.' },
      { p0: 'SECCIÓN CRÍTICA', p1: 'COMPROBANDO', turno: null, interes: [true, false], mensaje: 'P0 activa su indicador e ingresa.' },
      { p0: 'SECCIÓN CRÍTICA', p1: 'SECCIÓN CRÍTICA', turno: null, interes: [true, true], mensaje: 'P1 también ingresa. ¡Se viola la exclusión mutua!' }
    ]
  },
  {
    nombre: 'Intento 3: Declarar intención primero',
    descripcion: 'Los procesos anuncian su intención antes de comprobar al otro.',
    problema: 'Bloqueo mutuo',
    explicacion: 'Ambos pueden quedar esperando indefinidamente porque los dos indicadores permanecen activos.',
    pasos: [
      { p0: 'LISTO', p1: 'LISTO', turno: null, interes: [false, false], mensaje: 'Los procesos están preparados.' },
      { p0: 'SOLICITANDO', p1: 'LISTO', turno: null, interes: [true, false], mensaje: 'P0 activa su indicador de intención.' },
      { p0: 'SOLICITANDO', p1: 'SOLICITANDO', turno: null, interes: [true, true], mensaje: 'P1 también activa su indicador.' },
      { p0: 'ESPERANDO', p1: 'SOLICITANDO', turno: null, interes: [true, true], mensaje: 'P0 detecta que P1 está interesado y espera.' },
      { p0: 'ESPERANDO', p1: 'ESPERANDO', turno: null, interes: [true, true], mensaje: 'P1 también espera. Se produce un bloqueo mutuo.' }
    ]
  },
  {
    nombre: 'Intento 4: Retirada temporal',
    descripcion: 'Los procesos retiran temporalmente su intención cuando detectan competencia.',
    problema: 'Bloqueo activo (livelock)',
    explicacion: 'Los dos procesos pueden continuar cambiando sus indicadores sin conseguir ingresar.',
    pasos: [
      { p0: 'LISTO', p1: 'LISTO', turno: null, interes: [false, false], mensaje: 'Ambos procesos están listos.' },
      { p0: 'SOLICITANDO', p1: 'SOLICITANDO', turno: null, interes: [true, true], mensaje: 'Los dos anuncian su intención.' },
      { p0: 'REINTENTANDO', p1: 'REINTENTANDO', turno: null, interes: [false, false], mensaje: 'Ambos retiran temporalmente sus indicadores.' },
      { p0: 'SOLICITANDO', p1: 'SOLICITANDO', turno: null, interes: [true, true], mensaje: 'Ambos vuelven a activar sus indicadores.' },
      { p0: 'REINTENTANDO', p1: 'REINTENTANDO', turno: null, interes: [false, false], mensaje: 'Los procesos vuelven a retirarse. Ninguno ingresa.' },
      { p0: 'SOLICITANDO', p1: 'SOLICITANDO', turno: null, interes: [true, true], mensaje: 'El comportamiento puede repetirse: bloqueo activo.' }
    ]
  },
  {
    nombre: 'Intento 5: Dekker completo',
    descripcion: 'Combina indicadores de intención y una variable de turno para resolver los conflictos.',
    problema: 'Solución correcta bajo los supuestos clásicos',
    explicacion: 'El turno resuelve la competencia y permite que los procesos ingresen sin coincidir.',
    pasos: [
      { p0: 'LISTO', p1: 'LISTO', turno: 0, interes: [false, false], mensaje: 'El turno inicial pertenece a P0.' },
      { p0: 'SOLICITANDO', p1: 'LISTO', turno: 0, interes: [true, false], mensaje: 'P0 anuncia su intención.' },
      { p0: 'SOLICITANDO', p1: 'SOLICITANDO', turno: 0, interes: [true, true], mensaje: 'P1 también desea ingresar.' },
      { p0: 'SOLICITANDO', p1: 'ESPERANDO', turno: 0, interes: [true, false], mensaje: 'P1 retira temporalmente su intención porque el turno favorece a P0.' },
      { p0: 'SECCIÓN CRÍTICA', p1: 'ESPERANDO', turno: 0, interes: [true, false], mensaje: 'P0 ingresa de forma exclusiva.' },
      { p0: 'RESTANTE', p1: 'ESPERANDO', turno: 1, interes: [false, false], mensaje: 'P0 termina, cede el turno a P1 y desactiva su indicador.' },
      { p0: 'RESTANTE', p1: 'SOLICITANDO', turno: 1, interes: [false, true], mensaje: 'P1 vuelve a activar su indicador.' },
      { p0: 'RESTANTE', p1: 'SECCIÓN CRÍTICA', turno: 1, interes: [false, true], mensaje: 'P1 ingresa correctamente.' },
      { p0: 'RESTANTE', p1: 'RESTANTE', turno: 0, interes: [false, false], mensaje: 'P1 finaliza, cede el turno y libera su indicador.' }
    ]
  }
];

const colores = {
  LISTO: '#2563eb',
  SOLICITANDO: '#7c3aed',
  COMPROBANDO: '#7c3aed',
  ESPERANDO: '#d97706',
  REINTENTANDO: '#d97706',
  'SECCIÓN CRÍTICA': '#15803d',
  RESTANTE: '#64748b'
};

export default function SimuladorDekker() {
  const [intento, setIntento] = useState(0);
  const [paso, setPaso] = useState(0);

  const algoritmo = algoritmos[intento];
  const actual = algoritmo.pasos[paso];
  const finalizado = paso === algoritmo.pasos.length - 1;
  const conflicto = actual.p0 === 'SECCIÓN CRÍTICA' &&
                    actual.p1 === 'SECCIÓN CRÍTICA';

  const seleccionar = (valor) => {
    setIntento(Number(valor));
    setPaso(0);
  };

  const tarjetaProceso = (nombre, estado) => (
    <div style={{
      flex: '1 1 220px',
      padding: 18,
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: 12,
      background: 'var(--ifm-background-surface-color)'
    }}>
      <h3>{nombre}</h3>
      <div style={{
        padding: 14,
        borderRadius: 8,
        textAlign: 'center',
        background: colores[estado],
        color: '#fff',
        fontWeight: 'bold'
      }}>
        {estado}
      </div>
    </div>
  );

  return (
    <div style={{
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: 14,
      padding: 20,
      margin: '24px 0'
    }}>
      <h2>Visualizador de Algoritmos de Dekker</h2>

      <p>
        Explora una secuencia representativa de cada intento
        y observa el comportamiento de dos procesos concurrentes.
      </p>

      <label htmlFor="selector-dekker">
        <strong>Selecciona un algoritmo:</strong>
      </label>

      <select
        id="selector-dekker"
        value={intento}
        onChange={(e) => seleccionar(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: 12,
          margin: '10px 0 18px',
          borderRadius: 8,
          background: 'var(--ifm-background-color)',
          color: 'var(--ifm-font-color-base)',
          border: '1px solid var(--ifm-color-emphasis-400)'
        }}
      >
        {algoritmos.map((item, index) => (
          <option key={index} value={index}>
            {item.nombre}
          </option>
        ))}
      </select>

      <p>{algoritmo.descripcion}</p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20
      }}>
        {tarjetaProceso('Proceso P0', actual.p0)}
        {tarjetaProceso('Proceso P1', actual.p1)}
      </div>

      <div style={{
        padding: 18,
        border: `2px dashed ${conflicto ? '#dc2626' : 'var(--ifm-color-emphasis-400)'}`,
        borderRadius: 12,
        textAlign: 'center',
        marginBottom: 20
      }}>
        <h3>Sección crítica compartida</h3>

        <strong style={{
          color: conflicto ? '#ef4444' : 'var(--ifm-color-primary)'
        }}>
          {conflicto
            ? 'CONFLICTO: P0 Y P1 DENTRO'
            : actual.p0 === 'SECCIÓN CRÍTICA'
              ? 'OCUPADA POR P0'
              : actual.p1 === 'SECCIÓN CRÍTICA'
                ? 'OCUPADA POR P1'
                : 'SIN PROCESOS DENTRO'}
        </strong>
      </div>

      <h3>Variables compartidas</h3>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20
      }}>
        {actual.turno !== null && (
          <div style={{
            padding: 12,
            borderRadius: 8,
            background: 'var(--ifm-color-emphasis-100)'
          }}>
            <strong>turno:</strong> P{actual.turno}
          </div>
        )}

        {intento !== 0 && actual.interes.map((valor, index) => (
          <div key={index} style={{
            padding: 12,
            borderRadius: 8,
            background: 'var(--ifm-color-emphasis-100)'
          }}>
            <strong>interes[{index}]:</strong> {String(valor)}
          </div>
        ))}
      </div>

      <h3>Ejecución paso a paso</h3>

      <p>
        Paso {paso + 1} de {algoritmo.pasos.length}
      </p>

      <div style={{
        padding: 16,
        background: 'var(--ifm-color-emphasis-100)',
        borderRadius: 10,
        marginBottom: 16,
        minHeight: 90
      }} aria-live="polite">
        {actual.mensaje}
      </div>

      <div style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        marginBottom: 22
      }}>
        <button
          className="button button--primary"
          onClick={() => setPaso((p) => p + 1)}
          disabled={finalizado}
        >
          Siguiente paso
        </button>

        <button
          className="button button--secondary"
          onClick={() => setPaso((p) => Math.max(0, p - 1))}
          disabled={paso === 0}
        >
          Paso anterior
        </button>

        <button
          className="button button--danger"
          onClick={() => setPaso(0)}
        >
          Reiniciar
        </button>
      </div>

      {finalizado && (
        <div style={{
          borderLeft: '4px solid var(--ifm-color-primary)',
          background: 'var(--ifm-color-emphasis-100)',
          borderRadius: 8,
          padding: 16
        }}>
          <h3>Resultado del intento</h3>
          <p><strong>{algoritmo.problema}</strong></p>
          <p style={{marginBottom: 0}}>
            {algoritmo.explicacion}
          </p>
        </div>
      )}
    </div>
  );
}
