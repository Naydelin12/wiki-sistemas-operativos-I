import React, { useState } from 'react';

const estadoInicial = () => ({
  interes: [false, false],
  turno: 0,
  pc: [0, 0],
  eventos: ['Sistema iniciado. Ambos procesos están listos.']
});

const instrucciones = [
  'interes[i] = true;',
  'turno = j;',
  'while (interes[j] && turno == j)',
  'SECCIÓN CRÍTICA',
  'interes[i] = false;',
  'SECCIÓN RESTANTE'
];

export default function SimuladorPeterson() {
  const [sistema, setSistema] = useState(estadoInicial);

  const avanzar = (i) => {
    setSistema((anterior) => {
      const j = 1 - i;
      const nuevo = {
        interes: [...anterior.interes],
        turno: anterior.turno,
        pc: [...anterior.pc],
        eventos: [...anterior.eventos]
      };

      const registrar = (mensaje) => {
        nuevo.eventos.push(mensaje);
      };

      switch (nuevo.pc[i]) {
        case 0:
          nuevo.interes[i] = true;
          nuevo.pc[i] = 1;
          registrar(`P${i} anuncia su intención de ingresar.`);
          break;

        case 1:
          nuevo.turno = j;
          nuevo.pc[i] = 2;
          registrar(`P${i} asigna el turno a P${j}.`);
          break;

        case 2:
          if (nuevo.interes[j] && nuevo.turno === j) {
            registrar(`P${i} espera: P${j} está interesado y tiene prioridad.`);
          } else {
            nuevo.pc[i] = 3;
            registrar(`P${i} supera la condición de espera.`);
          }
          break;

        case 3:
          // La instrucción anterior ya autorizó el ingreso.
          nuevo.pc[i] = 4;
          registrar(`P${i} finaliza su sección crítica.`);
          break;

        case 4:
          nuevo.interes[i] = false;
          nuevo.pc[i] = 5;
          registrar(`P${i} libera el recurso y desactiva su indicador.`);
          break;

        case 5:
          nuevo.pc[i] = 0;
          registrar(`P${i} termina su sección restante y vuelve al inicio.`);
          break;

        default:
          break;
      }

      return nuevo;
    });
  };

  const estadoProceso = (i) => {
    const pc = sistema.pc[i];

    if (pc === 3 || pc === 4) return 'SECCIÓN CRÍTICA';

    if (
      pc === 2 &&
      sistema.interes[1 - i] &&
      sistema.turno === 1 - i
    ) {
      return 'ESPERANDO';
    }

    if (pc === 5) return 'SECCIÓN RESTANTE';
    if (pc === 0) return 'LISTO';

    return 'SOLICITANDO';
  };

  const colores = {
    LISTO: '#2563eb',
    SOLICITANDO: '#7c3aed',
    ESPERANDO: '#d97706',
    'SECCIÓN CRÍTICA': '#15803d',
    'SECCIÓN RESTANTE': '#64748b'
  };

  const proceso = (i) => {
    const estado = estadoProceso(i);

    return (
      <div style={{
        flex: '1 1 260px',
        padding: 18,
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: 12,
        background: 'var(--ifm-background-surface-color)'
      }}>
        <h3>Proceso P{i}</h3>

        <div style={{
          background: colores[estado],
          color: 'white',
          textAlign: 'center',
          padding: 12,
          borderRadius: 8,
          fontWeight: 'bold',
          marginBottom: 16
        }}>
          {estado}
        </div>

        <h4>Instrucción actual</h4>

        <div style={{
          background: 'var(--ifm-color-emphasis-100)',
          padding: 12,
          borderRadius: 8,
          marginBottom: 15,
          fontFamily: 'monospace',
          overflowWrap: 'anywhere'
        }}>
          {instrucciones[sistema.pc[i]]}
        </div>

        <button
          className="button button--primary"
          onClick={() => avanzar(i)}
        >
          Ejecutar siguiente instrucción
        </button>
      </div>
    );
  };

  const dentro = [0, 1].filter(
    (i) => sistema.pc[i] === 3 || sistema.pc[i] === 4
  );

  const conflicto = dentro.length > 1;

  return (
    <div style={{
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: 14,
      padding: 20,
      margin: '24px 0'
    }}>
      <h2>Simulador de la Solución de Peterson</h2>

      <p>
        Ejecuta las instrucciones de cada proceso y observa cómo
        Peterson coordina el acceso a una sección crítica compartida.
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20
      }}>
        {proceso(0)}
        {proceso(1)}
      </div>

      <div style={{
        border: `2px dashed ${
          conflicto ? '#dc2626' : 'var(--ifm-color-emphasis-400)'
        }`,
        borderRadius: 12,
        textAlign: 'center',
        padding: 20,
        marginBottom: 20
      }}>
        <h3>Sección crítica compartida</h3>

        <strong style={{
          color: conflicto
            ? '#ef4444'
            : 'var(--ifm-color-primary)'
        }}>
          {conflicto
            ? 'CONFLICTO: AMBOS PROCESOS DENTRO'
            : dentro.length === 1
              ? `OCUPADA POR P${dentro[0]}`
              : 'LIBRE'}
        </strong>
      </div>

      <h3>Variables compartidas</h3>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20
      }}>
        <div style={{
          background: 'var(--ifm-color-emphasis-100)',
          padding: 12,
          borderRadius: 8
        }}>
          <strong>interes[0]:</strong> {String(sistema.interes[0])}
        </div>

        <div style={{
          background: 'var(--ifm-color-emphasis-100)',
          padding: 12,
          borderRadius: 8
        }}>
          <strong>interes[1]:</strong> {String(sistema.interes[1])}
        </div>

        <div style={{
          background: 'var(--ifm-color-emphasis-100)',
          padding: 12,
          borderRadius: 8
        }}>
          <strong>turno:</strong> P{sistema.turno}
        </div>
      </div>

      <h3>Pseudocódigo de Peterson</h3>

      <pre style={{
        padding: 16,
        borderRadius: 10,
        overflowX: 'auto'
      }}>
        <code>{`Proceso Pi:
  j = 1 - i

  while (true) {
    interes[i] = true;
    turno = j;

    while (interes[j] && turno == j) {
      // Esperar
    }

    // Sección crítica

    interes[i] = false;

    // Sección restante
  }`}</code>
      </pre>

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
            padding: '6px 0',
            borderBottom: '1px solid var(--ifm-color-emphasis-200)'
          }}>
            <strong>{index + 1}.</strong> {evento}
          </div>
        ))}
      </div>

      <button
        className="button button--danger"
        onClick={() => setSistema(estadoInicial())}
      >
        Reiniciar simulación
      </button>
    </div>
  );
}
