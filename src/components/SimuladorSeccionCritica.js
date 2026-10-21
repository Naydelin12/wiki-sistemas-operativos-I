import React, { useState } from 'react';

export default function SimuladorSeccionCritica() {
  const [propietario, setPropietario] = useState(null);
  const [cola, setCola] = useState([]);
  const [eventos, setEventos] = useState([
    'Sistema iniciado. La sección crítica está libre.'
  ]);

  const registrar = (mensaje) => {
    setEventos((prev) => [...prev, mensaje]);
  };

  const solicitar = (proceso) => {
    if (propietario === proceso) {
      registrar(`${proceso} ya está dentro de la sección crítica.`);
      return;
    }

    if (cola.includes(proceso)) {
      registrar(`${proceso} ya está esperando su turno.`);
      return;
    }

    if (propietario === null) {
      setPropietario(proceso);
      registrar(`${proceso} ingresó a la sección crítica.`);
    } else {
      setCola((prev) => [...prev, proceso]);
      registrar(`${proceso} debe esperar. El recurso está ocupado.`);
    }
  };

  const liberar = (proceso) => {
    if (propietario !== proceso) {
      registrar(`${proceso} no puede liberar un recurso que no posee.`);
      return;
    }

    if (cola.length > 0) {
      const siguiente = cola[0];
      setCola((prev) => prev.slice(1));
      setPropietario(siguiente);
      registrar(`${proceso} liberó el recurso.`);
      registrar(`${siguiente} ingresó a la sección crítica.`);
    } else {
      setPropietario(null);
      registrar(`${proceso} liberó el recurso. Sección crítica libre.`);
    }
  };

  const reiniciar = () => {
    setPropietario(null);
    setCola([]);
    setEventos(['Simulación reiniciada.']);
  };

  const estado = (proceso) => {
    if (propietario === proceso) return 'EN SECCIÓN CRÍTICA';
    if (cola.includes(proceso)) return 'EN ESPERA';
    return 'LISTO';
  };

  const colorEstado = (proceso) => {
    if (propietario === proceso) return '#16a34a';
    if (cola.includes(proceso)) return '#d97706';
    return '#2563eb';
  };

  const tarjeta = (proceso) => (
    <div style={{
      flex: '1 1 240px',
      padding: 20,
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: 12,
      background: 'var(--ifm-background-surface-color)'
    }}>
      <h3>{proceso}</h3>

      <div style={{
        padding: 12,
        borderRadius: 8,
        background: colorEstado(proceso),
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 18
      }}>
        {estado(proceso)}
      </div>

      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <button
          className="button button--primary"
          onClick={() => solicitar(proceso)}
          disabled={propietario === proceso || cola.includes(proceso)}
        >
          Solicitar acceso
        </button>

        <button
          className="button button--secondary"
          onClick={() => liberar(proceso)}
          disabled={propietario !== proceso}
        >
          Liberar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      padding: 20,
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: 14,
      marginTop: 20,
      marginBottom: 30
    }}>
      <h2>Simulador de Sección Crítica</h2>

      <p>
        Dos procesos compiten por acceder a un recurso compartido.
        El mecanismo de exclusión mutua permite que solamente
        uno ingrese a la sección crítica a la vez.
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20
      }}>
        {tarjeta('P1')}
        {tarjeta('P2')}
      </div>

      <div style={{
        textAlign: 'center',
        padding: 20,
        borderRadius: 12,
        border: '2px dashed var(--ifm-color-emphasis-400)',
        marginBottom: 20
      }}>
        <h3>Recurso compartido</h3>

        <div style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: propietario
            ? 'var(--ifm-color-success)'
            : 'var(--ifm-color-primary)'
        }}>
          {propietario
            ? `Ocupado por ${propietario}`
            : 'LIBRE'}
        </div>

        <p style={{marginTop: 10, marginBottom: 0}}>
          Cola de espera: {cola.length ? cola.join(' → ') : 'Vacía'}
        </p>
      </div>

      <h3>Registro de eventos</h3>

      <div
        aria-live="polite"
        style={{
          maxHeight: 220,
          overflowY: 'auto',
          padding: 15,
          borderRadius: 8,
          background: 'var(--ifm-color-emphasis-100)',
          marginBottom: 20
        }}
      >
        {eventos.map((evento, index) => (
          <div
            key={index}
            style={{
              padding: '6px 0',
              borderBottom: '1px solid var(--ifm-color-emphasis-200)'
            }}
          >
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
