
import React, { useState } from 'react';

const pasos = [
  {
    p1: 'LISTO',
    p2: 'LISTO',
    r1: null,
    r2: null,
    esperaP1: null,
    esperaP2: null,
    descripcion: 'Sistema iniciado. Ambos procesos están listos.'
  },
  {
    p1: 'EJECUTANDO',
    p2: 'LISTO',
    r1: 'P1',
    r2: null,
    esperaP1: null,
    esperaP2: null,
    descripcion: 'P1 adquiere el recurso R1.'
  },
  {
    p1: 'EJECUTANDO',
    p2: 'EJECUTANDO',
    r1: 'P1',
    r2: 'P2',
    esperaP1: null,
    esperaP2: null,
    descripcion: 'P2 adquiere el recurso R2.'
  },
  {
    p1: 'BLOQUEADO',
    p2: 'EJECUTANDO',
    r1: 'P1',
    r2: 'P2',
    esperaP1: 'R2',
    esperaP2: null,
    descripcion: 'P1 solicita R2, pero está ocupado por P2. P1 queda bloqueado.'
  },
  {
    p1: 'BLOQUEADO',
    p2: 'BLOQUEADO',
    r1: 'P1',
    r2: 'P2',
    esperaP1: 'R2',
    esperaP2: 'R1',
    descripcion: 'P2 solicita R1, pero está ocupado por P1. Se forma una espera circular.'
  },
  {
    p1: 'BLOQUEADO',
    p2: 'BLOQUEADO',
    r1: 'P1',
    r2: 'P2',
    esperaP1: 'R2',
    esperaP2: 'R1',
    descripcion: 'Interbloqueo detectado: ninguno de los procesos puede continuar.'
  }
];

const colores = {
  LISTO: '#2563eb',
  EJECUTANDO: '#15803d',
  BLOQUEADO: '#d97706'
};

const estilos = {
  contenedor: {
    border: '1px solid #606875',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '20px'
  },
  tarjetas: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  tarjeta: {
    border: '1px solid #606875',
    borderRadius: '10px',
    padding: '16px',
    backgroundColor: '#242526'
  },
  estado: {
    padding: '12px',
    borderRadius: '7px',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  recurso: {
    border: '1px solid #606875',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center'
  },
  boton: {
    backgroundColor: '#20bfa5',
    color: '#000',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '10px',
    marginTop: '10px'
  },
  registro: {
    backgroundColor: '#1c1e22',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '10px',
    maxHeight: '220px',
    overflowY: 'auto'
  }
};

export default function SimuladorInterbloqueo() {
  const [paso, setPaso] = useState(0);

  const actual = pasos[paso];
  const deadlock = paso === pasos.length - 1;

  const siguiente = () => {
    setPaso(prev => Math.min(prev + 1, pasos.length - 1));
  };

  const reiniciar = () => setPaso(0);

  const renderProceso = (id, estado, espera) => (
    <div style={estilos.tarjeta}>
      <h3>Proceso {id}</h3>

      <div style={{
        ...estilos.estado,
        backgroundColor: colores[estado]
      }}>
        {estado}
      </div>

      <p>
        <strong>Recurso solicitado:</strong>{' '}
        {espera || 'Ninguno'}
      </p>
    </div>
  );

  return (
    <div style={estilos.contenedor}>
      <h2>Simulador Interactivo de Interbloqueo</h2>

      <p>
        Observa cómo dos procesos compiten por recursos
        exclusivos hasta generar una espera circular.
      </p>

      <h3>Procesos del sistema</h3>

      <div style={estilos.tarjetas}>
        {renderProceso('P1', actual.p1, actual.esperaP1)}
        {renderProceso('P2', actual.p2, actual.esperaP2)}
      </div>

      <h3 style={{ marginTop: '20px' }}>
        Recursos compartidos
      </h3>

      <div style={estilos.tarjetas}>
        <div style={estilos.recurso}>
          <h4>Recurso R1</h4>
          <p>
            {actual.r1
              ? `Asignado a ${actual.r1}`
              : 'DISPONIBLE'}
          </p>
        </div>

        <div style={estilos.recurso}>
          <h4>Recurso R2</h4>
          <p>
            {actual.r2
              ? `Asignado a ${actual.r2}`
              : 'DISPONIBLE'}
          </p>
        </div>
      </div>

      <h3 style={{ marginTop: '20px' }}>
        Grafo de asignación de recursos
      </h3>

      <div style={{
        ...estilos.recurso,
        padding: '20px',
        backgroundColor: '#1c1e22'
      }}>
        <svg
          viewBox="0 0 500 200"
          width="100%"
          role="img"
          aria-label="Grafo de asignación de recursos"
        >
          <defs>
            <marker
              id="flechaDeadlock"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L7,3 Z" fill="#ffffff" />
            </marker>
          </defs>

          {[
            { x: 100, y: 50, texto: 'P1', proceso: true },
            { x: 400, y: 50, texto: 'P2', proceso: true },
            { x: 100, y: 150, texto: 'R1', proceso: false },
            { x: 400, y: 150, texto: 'R2', proceso: false }
          ].map((nodo) => (
            <g key={nodo.texto}>
              {nodo.proceso ? (
                <circle
                  cx={nodo.x}
                  cy={nodo.y}
                  r="25"
                  fill="#2563eb"
                />
              ) : (
                <rect
                  x={nodo.x - 25}
                  y={nodo.y - 25}
                  width="50"
                  height="50"
                  rx="6"
                  fill="#15803d"
                />
              )}

              <text
                x={nodo.x}
                y={nodo.y + 5}
                textAnchor="middle"
                fill="#fff"
                fontSize="16"
                fontWeight="bold"
              >
                {nodo.texto}
              </text>
            </g>
          ))}

          {actual.r1 === 'P1' && (
            <line
              x1="100" y1="125"
              x2="100" y2="77"
              stroke="#22c55e"
              strokeWidth="3"
              markerEnd="url(#flechaDeadlock)"
            />
          )}

          {actual.r2 === 'P2' && (
            <line
              x1="400" y1="125"
              x2="400" y2="77"
              stroke="#22c55e"
              strokeWidth="3"
              markerEnd="url(#flechaDeadlock)"
            />
          )}

          {actual.esperaP1 === 'R2' && (
            <path
              d="M125 50 Q250 65 400 125"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              markerEnd="url(#flechaDeadlock)"
            />
          )}

          {actual.esperaP2 === 'R1' && (
            <path
              d="M375 50 Q250 65 100 125"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              markerEnd="url(#flechaDeadlock)"
            />
          )}
        </svg>

        <p>
          <span style={{ color: '#22c55e' }}>Verde:</span>{' '}
          recurso asignado.{' '}
          <span style={{ color: '#f59e0b' }}>Naranja:</span>{' '}
          recurso solicitado.
        </p>
      </div>

      <h3 style={{ marginTop: '20px' }}>
        Ejecución paso a paso
      </h3>

      <p>
        Paso {paso + 1} de {pasos.length}
      </p>

      <div style={estilos.registro}>
        {pasos.slice(0, paso + 1).map((item, indice) => (
          <div
            key={indice}
            style={{
              padding: '8px 0',
              borderBottom: '1px solid #454b54'
            }}
          >
            <strong>{indice + 1}.</strong>{' '}
            {item.descripcion}
          </div>
        ))}
      </div>

      {deadlock && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          border: '1px solid #ef4444',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#ef4444' }}>
            INTERBLOQUEO DETECTADO
          </h3>

          <p>
            P1 espera R2 y P2 espera R1. Ninguno puede
            continuar porque ambos conservan sus recursos.
          </p>
        </div>
      )}

      <button
        type="button"
        style={{
          ...estilos.boton,
          opacity: deadlock ? 0.5 : 1
        }}
        onClick={siguiente}
        disabled={deadlock}
      >
        Siguiente paso
      </button>

      <button
        type="button"
        style={{
          ...estilos.boton,
          backgroundColor: '#ff3344'
        }}
        onClick={reiniciar}
      >
        Reiniciar simulación
      </button>
    </div>
  );
}
