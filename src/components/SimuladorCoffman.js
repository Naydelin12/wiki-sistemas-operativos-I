
import React, { useState } from 'react';

const condiciones = [
  {
    id: 'exclusion',
    nombre: '1. Exclusión mutua',
    descripcion:
      'Los recursos R1 y R2 son exclusivos: solo un proceso puede utilizar cada recurso a la vez.',
    solucion:
      'Al permitir compartir los recursos, los procesos no necesitan esperar por su uso exclusivo.',
    ejemplo: 'P1 utiliza R1 mientras P2 utiliza R2.'
  },
  {
    id: 'retencion',
    nombre: '2. Retención y espera',
    descripcion:
      'Cada proceso conserva un recurso mientras espera obtener otro.',
    solucion:
      'Los procesos deben solicitar conjuntamente los recursos necesarios o liberar los que poseen antes de esperar.',
    ejemplo: 'P1 conserva R1 y solicita R2; P2 conserva R2 y solicita R1.'
  },
  {
    id: 'expropiacion',
    nombre: '3. No expropiación',
    descripcion:
      'Los recursos no pueden retirarse obligatoriamente de los procesos que los poseen.',
    solucion:
      'El sistema puede recuperar de forma controlada los recursos que admitan expropiación segura.',
    ejemplo: 'P1 y P2 conservan sus recursos mientras permanecen bloqueados.'
  },
  {
    id: 'circular',
    nombre: '4. Espera circular',
    descripcion:
      'P1 espera un recurso de P2 y P2 espera un recurso de P1.',
    solucion:
      'Establecer un orden global de adquisición de recursos impide formar ciclos de espera.',
    ejemplo: 'P1 → R2 → P2 → R1 → P1.'
  }
];

const inicial = {
  exclusion: true,
  retencion: true,
  expropiacion: true,
  circular: true
};

const estilos = {
  contenedor: {
    border: '1px solid #606875',
    borderRadius: 12,
    padding: 18,
    marginTop: 20
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: 12,
    marginTop: 14
  },
  tarjeta: {
    border: '1px solid #606875',
    borderRadius: 9,
    padding: 14,
    backgroundColor: '#242526'
  },
  panel: {
    backgroundColor: '#1c1e22',
    borderRadius: 8,
    padding: 14,
    marginTop: 12
  },
  boton: {
    border: 'none',
    borderRadius: 6,
    padding: '10px 15px',
    backgroundColor: '#20bfa5',
    color: '#000',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default function SimuladorCoffman() {
  const [activas, setActivas] = useState(inicial);

  const [seleccionada, setSeleccionada] = useState('exclusion');

  const todasActivas = Object.values(activas).every(Boolean);

  const cantidad = Object.values(activas).filter(Boolean).length;

  const actual = condiciones.find(
    condicion => condicion.id === seleccionada
  );

  const cambiar = id => {
    setActivas(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const reiniciar = () => {
    setActivas({ ...inicial });
    setSeleccionada('exclusion');
  };

  const estado = todasActivas
    ? 'INTERBLOQUEO EN EL ESCENARIO'
    : 'INTERBLOQUEO IMPEDIDO EN ESTE MODELO';

  return (
    <div style={estilos.contenedor}>
      <h2>Visualizador de las Condiciones de Coffman</h2>

      <p>
        Activa o desactiva las cuatro condiciones y observa
        cómo cambia el escenario de dos procesos y dos
        recursos compartidos.
      </p>

      <h3>Configuración de las condiciones</h3>

      <div style={estilos.grid}>
        {condiciones.map(condicion => (
          <div key={condicion.id} style={estilos.tarjeta}>
            <h4>{condicion.nombre}</h4>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              cursor: 'pointer',
              marginBottom: 10
            }}>
              <input
                type="checkbox"
                checked={activas[condicion.id]}
                onChange={() => cambiar(condicion.id)}
              />

              {activas[condicion.id]
                ? 'ACTIVA'
                : 'DESACTIVADA'}
            </label>

            <button
              type="button"
              onClick={() => setSeleccionada(condicion.id)}
              style={{
                ...estilos.boton,
                padding: '7px 10px',
                fontSize: 12
              }}
            >
              Ver explicación
            </button>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 20 }}>
        Explicación de la condición
      </h3>

      <div style={estilos.panel}>
        <h4>{actual.nombre}</h4>

        <p>{actual.descripcion}</p>

        <p>
          <strong>Ejemplo:</strong> {actual.ejemplo}
        </p>

        {!activas[actual.id] && (
          <p style={{ color: '#20bfa5' }}>
            <strong>Condición eliminada:</strong>{' '}
            {actual.solucion}
          </p>
        )}
      </div>

      <h3 style={{ marginTop: 20 }}>
        Procesos del sistema
      </h3>

      <div style={estilos.grid}>
        {['P1', 'P2'].map(proceso => (
          <div key={proceso} style={estilos.tarjeta}>
            <h4>Proceso {proceso}</h4>

            <div style={{
              padding: 12,
              borderRadius: 6,
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: todasActivas
                ? '#d97706'
                : '#2563eb'
            }}>
              {todasActivas ? 'BLOQUEADO' : 'SIN BLOQUEO CIRCULAR'}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 20 }}>
        Recursos compartidos
      </h3>

      <div style={estilos.grid}>
        <div style={estilos.tarjeta}>
          <h4>Recurso R1</h4>
          <p>
            {todasActivas
              ? 'Asignado a P1'
              : 'Asignación según estrategia preventiva'}
          </p>
        </div>

        <div style={estilos.tarjeta}>
          <h4>Recurso R2</h4>
          <p>
            {todasActivas
              ? 'Asignado a P2'
              : 'Asignación según estrategia preventiva'}
          </p>
        </div>
      </div>

      <h3 style={{ marginTop: 20 }}>
        Grafo de dependencias
      </h3>

      <div style={{
        ...estilos.panel,
        textAlign: 'center'
      }}>
        {todasActivas ? (
          <svg
            viewBox="0 0 500 220"
            width="100%"
            role="img"
            aria-label="Ciclo de espera circular"
          >
            <defs>
              <marker
                id="flechaCoffman"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="3"
                orient="auto"
              >
                <path
                  d="M0,0 L0,6 L7,3 Z"
                  fill="#f59e0b"
                />
              </marker>
            </defs>

            <circle cx="100" cy="50" r="27" fill="#2563eb" />
            <circle cx="400" cy="50" r="27" fill="#2563eb" />

            <rect x="73" y="145" width="54" height="54"
              rx="6" fill="#15803d" />

            <rect x="373" y="145" width="54" height="54"
              rx="6" fill="#15803d" />

            <path
              d="M100 145 L100 78"
              stroke="#22c55e"
              strokeWidth="3"
              fill="none"
            />

            <path
              d="M400 145 L400 78"
              stroke="#22c55e"
              strokeWidth="3"
              fill="none"
            />

            <path
              d="M127 50 Q250 60 400 145"
              stroke="#f59e0b"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#flechaCoffman)"
            />

            <path
              d="M373 50 Q250 60 100 145"
              stroke="#f59e0b"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#flechaCoffman)"
            />

            {[
              [100, 55, 'P1'],
              [400, 55, 'P2'],
              [100, 178, 'R1'],
              [400, 178, 'R2']
            ].map(([x, y, texto]) => (
              <text
                key={texto}
                x={x}
                y={y}
                textAnchor="middle"
                fill="#fff"
                fontSize="16"
                fontWeight="bold"
              >
                {texto}
              </text>
            ))}
          </svg>
        ) : (
          <div style={{ padding: 20 }}>
            <p style={{ color: '#20bfa5', fontWeight: 'bold' }}>
              No existe un ciclo de espera bloqueante
              bajo la estrategia preventiva seleccionada.
            </p>

            <p>
              Al eliminar una condición necesaria de Coffman,
              se impide el interbloqueo en este modelo.
            </p>
          </div>
        )}
      </div>

      <h3 style={{ marginTop: 20 }}>
        Resultado del análisis
      </h3>

      <div style={{
        ...estilos.panel,
        borderLeft: `4px solid ${
          todasActivas ? '#ef4444' : '#20bfa5'
        }`
      }}>
        <h4 style={{
          color: todasActivas ? '#ef4444' : '#20bfa5'
        }}>
          {estado}
        </h4>

        <p>
          Condiciones activas: {cantidad} de 4
        </p>

        {todasActivas ? (
          <p>
            En este escenario, P1 conserva R1 y espera R2,
            mientras P2 conserva R2 y espera R1.
            Los dos procesos quedan interbloqueados.
          </p>
        ) : (
          <p>
            Se ha eliminado al menos una condición necesaria
            para el interbloqueo. La estrategia preventiva
            representada impide que se mantenga la situación
            de bloqueo circular.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={reiniciar}
        style={{
          ...estilos.boton,
          backgroundColor: '#ff3344',
          marginTop: 15
        }}
      >
        Reiniciar simulación
      </button>
    </div>
  );
}
